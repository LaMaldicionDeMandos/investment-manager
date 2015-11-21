/**
 * Created by boot on 11/21/15.
 */
var fetcher = require('./fetch_runtime');
var path = process.argv[2];
var latests = {};

var analyse = function(path) {
    var items = fetcher(path);
    items.forEach(function(item) {
        item.promise.then(function(list) {
            var last = latests[item.title.name];
            var latest = list.pop();
            if (!last || last.dateTime < latest.dateTime) {
                latests[item.title.name] = latest;
                console.log('Title ' + item.title.name + ': ' + latest.value);
            }
        });
    });
};

analyse(path);
