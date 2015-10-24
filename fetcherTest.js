var fetcher = require('./data-fetcher.js');
var titles = require('./title-codes.js');
var path = process.argv[2];
console.log('Path file: ' + path);
fetcher.fetchTitles(path, titles);