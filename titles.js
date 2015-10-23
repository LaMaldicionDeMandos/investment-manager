var q = require('q');
var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: ';'});
var fs = require("fs");
function Title(name, array) {
	that = this;
	this.name = name;
	array.forEach(function(item) {
	   		item.opening = parseFloat(item.opening.replace(',', '.', 'gi'));
   			item.close = parseFloat(item.close.replace(',', '.', 'gi'));
   			item.percent = function() {
				return 100*(item.close - item.opening)/item.opening;
			};
	});
	this.history = array;
	this.predictionByNMatches = function(n) {
			var jsonArray = that.history.slice(0, that.history.length);
			var lasts = jsonArray.slice(0, n);
		   	jsonArray.splice(0, n);
		   	var difs = [];
		   	for (var i = 0; i < jsonArray.length - n;i++) {
		   		var diff = 0;
		   		for (var j = 0; j < n; j++) {
		   			diff+= Math.abs(lasts[j].percent() - jsonArray[i + j].percent());
		   		}
		   		difs.push(diff);
		   	}
		   	var min = 10000000;
		   	var index = 0;
		   	for (var i = 0; i < difs.length; i++) {
		   		if (difs[i] < min) {
		   			min = difs[i];
		   			index = i;
		   		}
		   	}
		   	for(var i = 0; i < n ; i++) {
		   		console.log('referencia: ' + lasts[i].percent() + '  --  obtenido: ' + jsonArray[index + i].percent());
		   	}
			return jsonArray[index - 1].percent();
		};	 
};
var create = function(filename, name) {
	var defer = q.defer();
	var title = {name: name};
	converter.on("end_parsed", function (json) {
		var title = new Title(name, json);
		defer.resolve(title);
	}); 
	fs.createReadStream(filename).pipe(converter);
	return defer.promise;
};

module.exports = create;
