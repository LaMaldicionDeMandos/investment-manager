var accountFactory = require('./account.js');
console.log('Path file: ' + process.argv[2]);
var size = process.argv[3] || 15;

accountFactory(process.argv[2], 'TRAN').then(function(account) {
   //console.log('Prediction');
   console.log('Prediction: ' + account.predictionByNMatches(size));
});