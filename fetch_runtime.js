/**
 * Created by boot on 11/19/15.
 */
var fetcher = require('./runtime_fetcher');
var titles = require('./title-codes.js');
var path = process.argv[2];

fetcher.fetchTitles(path, titles);

