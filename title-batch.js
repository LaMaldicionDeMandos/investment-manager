var titleCodes = require('./title-codes.js');
var titleFactory = require('./titles.js');
var async = require('async');
var path = process.argv[2];
var size = process.argv[3] || 15;

var functions = [];
titleCodes.forEach(function(key, title) {
	console.log("Title: " + title.name);
	var title = titleFactory(path + '/' + key + '/' + title.name + '.csv', title.name);
	console.log('Prediction ' + title.name + ': ' + title.predictionByNMatches(size));
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
async.parallel(functions, function(err, results) {
	console.log("Exit");
	process.exit();
});
