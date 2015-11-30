/**
 * Created by boot on 11/19/15.
 */
var fetcher = require('./runtime_fetcher');

var fetch = function(titles, path) {
    return fetcher.fetchTitles(path, titles);
};

module.exports = fetch;

