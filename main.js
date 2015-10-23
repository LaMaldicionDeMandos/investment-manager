var accountFactory = require('./titles.js');
console.log('Path file: ' + process.argv[2]);
var size = process.argv[3] || 15;

accountFactory(process.argv[2], 'TRAN').then(function(title) {
   //console.log('Prediction');
   console.log('Prediction: ' + title.predictionByNMatches(size));
});