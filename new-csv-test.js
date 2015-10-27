/**
 * Created by marcelo on 27/10/15.
 */
var csv = require('csvjson');
var path = process.argv[2];

var values = csv.toObject(path).output;
console.log(JSON.stringify(values));