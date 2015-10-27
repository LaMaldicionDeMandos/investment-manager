var titleFactory = require('./titles.js');
var path = process.argv[2];
var name = process.argv[3];
var size = process.argv[4] || 15;
var title = titleFactory(path, name);
console.log('Prediction ' + title.name + ': ' + title.predictionByNMatches(size));
title.save(function(err) {
	if (!err) {
		process.exit();
	} else {
		console.log(err);
	}
});