var titleFactory = require('./titles.js');
var path = process.argv[2];
var name = process.argv[3];
var size = process.argv[4] || 15;
titleFactory(path, name).then(function(title) {
   	console.log('Prediction ' + title.name + ': ' + title.predictionByNMatches(size));
   	title.save(function(err) {
		if (!err) {
			process.exit();
		}
	});
});