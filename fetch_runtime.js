/**
 * Created by boot on 11/19/15.
 */
var fetch = require('./runtime_fetcher');
var titleId = process.argv[2];
var path = process.argv[3];

fetch(titleId, path);

