/**
 * Created by boot on 11/21/15.
 */
var fetcher = require('./fetch_runtime');
//var fetcher = require('./fetcher_test');
var q = require('q');
var titleCodes = require('./title-codes.js');
var Title = require('./database').Title;
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
        title.percent = 100*(movement.value - title.first.value)/title.first.value;
        if (!title.history) {
            Title.findOne({name: title.name}).select('history').exec(function(err, titleHistory) {
                var history = titleHistory.history;
                history.forEach(function(item) {
                    item.percentAfterOpen = function() {
                        return 100*(item.closing - item.opening)/item.opening;
                    };
                    item.percentBeforeOpen = function() {
                        return 100*(item.closing - item.opening + item.jump)/(item.opening - item.jump);
                    };
                    item.percentMin = function() {
                        return 100*(item.min - item.opening + item.jump)/(item.opening - item.jump);
                    };
                    item.percentMax = function() {
                        return 100*(item.max - item.opening + item.jump)/(item.opening - item.jump);
                    };
                });
                title.minLimit = history.slice().sort(function(a,b) {
                    return a.percentMin() - b.percentMin();
                }).slice(history.length*(100 - 90)/100)[0].percentMin();
                title.maxLimit = history.slice().sort(function(a,b) {
                    return b.percentMax() - a.percentMax();
                }).slice(history.length*(100 - 90)/100)[0].percentMax();
                title.history = history;
                analyzePercent(title);
            });
        } else {
            analyzePercent(title);
        }
    };
};

var analyzePercent = function(title) {
    console.log('Percent: ' + title.name + ' ==> ' + title.percent);
    if (title.percent < title.minLimit) {
        console.log('*********************** Alerta de minimo *******************');
    }
    if (title.percent > title.maxLimit) {
        console.log('*********************** Alerta de maximo *******************');
    }
};

var analyze = function(titleCodes, path) {
    var items = retrieveLatests(titleCodes, path);
    items.forEach(function(item) {
        item.promise.then(function(movement) {
            var title = titles[item.title.name];
            if (!title) {
                title = create(item.title.name, movement);
                titles[item.title.name] = title;
            }
            analyzeTitle(title, movement);
        });
    });
};

module.exports = function(path) {
    analyze(titleCodes, path);
}