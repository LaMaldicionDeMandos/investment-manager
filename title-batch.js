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
titleCodes.forEach(function(key, title) {
	var title = titleFactory(path + '/' + key + '/' + title.name + '.csv', title.name);
	var prediction = title.predictionByNMatches(size);
	var report = title.standardErrorByNMatches(size);
	var max = prediction + report.positives;
	var min = prediction - report.negatives;
	console.log('Prediction ' + title.name + ': ' + prediction + ' -- maximo: ' + max + ' -- minimo: ' + min);
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
