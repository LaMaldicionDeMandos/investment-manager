/**
 * Created by boot on 11/21/15.
 */
var fetcher = require('./fetch_runtime');
var q = require('q');
var titleCodes = require('./title-codes.js');
var path = process.argv[2];
var latests = {};

var titles = {};

var retrieveLatests = function(titlesCodes, path) {
    var items = fetcher(titlesCodes, path);
    var results = [];
    items.forEach(function(item) {
        var def = q.defer();
        item.promise.then(function(list) {
            var last = latests[item.title.name];
            var latest = list.pop();
            if (!last || last.dateTime < latest.dateTime) {
                latests[item.title.name] = latest;
                def.resolve(latest);
            } else {
                def.resolve(null);
            }
        });
        results.push({title:item.title, promise: def.promise});
    });
    return results;
};

var create = function(name, movement) {
    return {name:name, first: movement};
};

var analyzeTitle = function(title, movement) {
    if (movement) {
        var percent = 100*(movement.value - title.first.value)/title.first.value;
        console.log(title.name + ' Percent: ' + percent);
    }
};

var analyze = function(titleCodes, path) {
    var items = retrieveLatests(titleCodes, path);
    items.forEach(function(item) {
        item.promise.then(function(movement) {
            var title = titles[item.title.name];
            if (!title) {
                title = create(item.title.name, movement);
            }
            analyzeTitle(title, movement);
        });
    });
};

analyze(titleCodes, path);