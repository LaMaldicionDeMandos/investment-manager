var titleCodes = require('./title-codes.js');
var titleFactory = require('./titles.js');
var async = require('async');
require('./database.js').clean();
var path = process.argv[2];
var size = parseInt(process.argv[3]) || 15;
var cleanDb = function(callback) {
	require('./database.js').clean(function(err) {
		console.log("clear database");
		if (!err) {
			callback(null, null);
		} else {
			callback(err);
		}
	});
};
var functions = [];
var reportAfter = function(title) {
	return {prediction:title.predictionByNWindowAfter(size), report: title.standardErrorByNMatchesAfter(size)};
};
var reportBefore = function(title) {
	return {prediction:title.predictionByNWindowBefore(size), report: title.standardErrorByNMatchesBefore(size)};
};
var printResult = function(prediction, result, titleName) {
	var max = result.prediction + result.report.positives;
	var min = result.prediction - result.report.negatives;
	console.log('Prediccion ' + prediction + ' ' + titleName + ': ' + result.prediction + ' maximo: ' + max + ' minimo: ' + min);
}
titleCodes.forEach(function(key, title) {
	var title = titleFactory(path + '/' + key + '/' + title.name + '.csv', title.name);
	var result = reportAfter(title);
	printResult('Despues de Apertura', result, title.name);
	result = reportBefore(title);
	printResult('Antes de Apertura  ', result, title.name);
	functions.push(function(callback) {
		title.save(function(err) {
			if (!err) {
				callback(null, title);
			} else {
				callback(err, title);
			}
		});
	});
});
var saveItems = function(callback) {
	async.parallel(functions, function(err, results) {
		console.log("End saving titles");
		callback(err, results);
	});
}
async.series([cleanDb, saveItems], function(err, results) {
	console.log("End");
	process.exit();
});
