var q = require('q');
var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: ';'});

var create = function(filename, name) {
	var defer = q.defer();
	var account = {name: name};
	converter.on("end_parsed", function (jsonArray) {
		jsonArray.forEach(function(item) {
	   		item.opening = parseFloat(item.opening.replace(',', '.', 'gi'));
   			item.close = parseFloat(item.close.replace(',', '.', 'gi'));
   			item.percent = function() {
				return 100*(item.close - item.opening)/item.opening;
			};
			account.history = jsonArray;
			defer.resolve(account);
   		}); 
	});
	require("fs").createReadStream(filename).pipe(converter);
	return defer.promise;
}

module.exports = create;
