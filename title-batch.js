var titleCodes = require('./title-codes.js');
var execSh = require('exec-sh');
var path = process.argv[2];
var size = process.argv[3] || 15;
titleCodes.forEach(function(key, title) {
	execSh('node main.js ' + path + '/' + key + '/' + title.name + '.csv ' + title.name + ' ' + size);
});
