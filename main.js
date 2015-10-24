var titleFactory = require('./titles.js');
var titleCodes = require('./title-codes.js');
var path = process.argv[2];
var size = process.argv[3] || 15;
var titles = [];
titleCodes.forEach(function(key, titleItem) {
	var finalPath = path + '/' + key + '/' + titleItem.name + '.csv';
	titleFactory(finalPath, titleItem.name).then(function(title) {
   	console.log('Prediction ' + title.name + ': ' + title.predictionByNMatches(size));
});
});