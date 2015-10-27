var titleCodes = require('./title-codes.js');
var titleFactory = require('./titles.js');
var path = process.argv[2];
var size = process.argv[3] || 15;
titleCodes.forEach(function(key, title) {
	console.log("Title: " + title.name);
	var title = titleFactory(path + '/' + key + '/' + title.name + '.csv', title.name);
	console.log('Prediction ' + title.name + ': ' + title.predictionByNMatches(size));
	title.save(function(err) {
		if (!err) {
			//process.exit();
		}
	});
});
