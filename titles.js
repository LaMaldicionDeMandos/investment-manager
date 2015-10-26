var q = require('q');
var database = require('./database.js');
var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: ';'});
var fs = require("fs");
function Title(name, array) {
	this.name = name;
	array.forEach(function(item) {
	   		item.opening = parseFloat(item.Apertura.replace(',', '.', 'gi'));
   			item.close = parseFloat(item.Cierre.replace(',', '.', 'gi'));
   			item.percent = function() {
				return 100*(item.close - item.opening)/item.opening;
			};
	});
	this.history = array;
	this.predictionByNMatches = function(n) {
			var jsonArray = this.history.slice(0, this.history.length);
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
			return jsonArray[index - 1].percent();
		};
	this.save = function(callback) {
		var dto = new database.Title();
		dto._id = database.ObjectId();
		dto.name = this.name;
		dto.history = [];
		this.history.forEach(function(item) {
			var historyDto = new database.History();
			historyDto.Fecha = item.Fecha;
			historyDto.Apertura = item.Apertura;
			historyDto.Maximo = item.Maximo;
			historyDto.Minimo = item.Minimo;
			historyDto.Cierre = item.Cierre;
			historyDto.CantNominal = item.CantNominal;
			historyDto.opening = item.opening;
			historyDto.close = item.close;
			dto.history.push(historyDto);
		});
		dto.save(function(err) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				console.log('Save Success:' + dto.name);
				callback();
			}
		});
	}		 
};

Title.prototype.fromDto = function(dto) {
	return new Title(dto.name, dto.history);
}
var create = function(filename, name) {
	var defer = q.defer();
	converter.on("end_parsed", function (json) {
		var title = new Title(name, json);
		defer.resolve(title);
	}); 
	fs.createReadStream(filename).pipe(converter);
	return defer.promise;
};

module.exports = create;
