/**
 * Created by boot on 11/19/15.
 */
var fetcher = require('./runtime_fetcher');
var titles = require('./title-codes.js');

var fetch = function(path) {
    return fetcher.fetchTitles(path, titles);
};

module.exports = fetch;

