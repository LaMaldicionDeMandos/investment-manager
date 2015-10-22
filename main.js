var csv = require('csv-to-json');
console.log('Path file: ' + process.argv[2]);
var file = {filename: process.argv[2]};
var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: ';'});
 
//end_parsed will be emitted once parsing finished 
converter.on("end_parsed", function (jsonArray) {
   console.log(jsonArray); //here is your result jsonarray 
});
 
//read from file 
require("fs").createReadStream(file.filename).pipe(converter);
