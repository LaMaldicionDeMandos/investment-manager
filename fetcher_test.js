/**
 * Created by boot on 11/23/15.
 */
var fetcher = require('./fetch_runtime');
var titleCodes = require('./title-codes.js');
var q = require('q');
var path = './titles/runtime';
var items = fetcher(titleCodes, path);
var next = 1448362740000;
var fetch = function(titles, path) {
    var time = next;
    next+= 30000;
    var mocked = items.map(function(item) {
        var def = q.defer();
        item.promise.then(function(list) {
           var filtered = list.filter(function(movement) {
               return movement.dateTime <= time;
           })
           def.resolve(filtered);
        });
        return {title: item.title, promise: def.promise}
    });
    return mocked;
};

module.exports = fetch;