var fetch = require('./data-fetcher.js');
var path = process.argv[2];
var id = process.argv[3];
console.log('Path file: ' + path);
console.log('Title Id: ' + id);
fetch(path, id);