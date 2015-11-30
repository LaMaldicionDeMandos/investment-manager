/**
 * Created by boot on 11/30/15.
 */
var fetch = require('./fetch_runtime');
var titles = require('./title-codes');
var path = process.argv[2];

fetch(titles, path);
