/**
 * Created by marcelo on 26/11/15.
 */
var async = require('async');
var titles = require('./title-codes.js');
var db = require('./database.js');
var TitleExtreme = db.TitleExtreme;
Date.prototype.format = function() {
    return this.getFullYear() + '-' +
        ((this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
        '-' + ((this.getDate() < 10) ? '0' + this.getDate() : this.getDate());
};
var path = process.argv[2];
var file = process.argv[3] || (new Date().format() + '.json');
var fs = require('fs');

function createTitleExtreme(code) {
    var item = new TitleExtreme();
    item._id = db.ObjectId();
    item.code = code;
    item.extremes = [];
    return item;
}

function parseList(string) {
    try {
        return JSON.parse(string);
    } catch(e) {
        return parseList(string.substr(0, string.length - 1));
    }
}

function create(movements) {
    var first = movements[0];
    movements.sort(function(a, b){
        return a.value - b.value;
    });
    var min = movements[0];
    var max = movements.pop();
    var minDate = new Date(min.dateTime);
    var maxDate = new Date(max.dateTime);
    var minE = {percent: 100*(min.value - first.value)/first.value,
        hour: first == min ? 8 : minDate.getHours(),
        minute: first == min ? 0 : minDate.getMinutes()};
    var maxE = {percent: 100*(max.value - first.value)/first.value,
        hour: first == max ? 8 : maxDate.getHours(),
        minute: first == max ? 0 : maxDate.getMinutes()};
    return {date: first.dateTime, min: minE, max: maxE};
}
var functions = [];
titles.forEach(function(key, title) {
    var dir = path + "/" + key + "/" + title.name;
    TitleExtreme.findOne({code: title.name}, function(err, item) {
        item = item || createTitleExtreme(title.name);
        console.log("Reading file " + dir + '/' + file);
        var movements = fs.readFileSync(dir + '/' + file);
        var extreme = create(parseList(movements.toString()));
        item.extremes.push(extreme);
        item.save(function(err) {
            if (!err) {
                console.log("End saved title: " + title.name);
            } else {
                //callback(null, title);
                console.log("Error saving title: " + title.name);
                //callback(err, title);
            }
        });
/*        functions.push(function(callback) {
            console.log("End saving title: " + title.name);
            item.save(function(err) {
                if (!err) {
                    console.log("Error saving title: " + title.name);
                    callback(null, title);
                } else {
                    console.log("End saved title: " + title.name);
                    callback(err, title);
                }
            });
        });*/
    });
});
var saveItems = function(callback) {
    async.parallel(functions, function(err, results) {
        console.log("End saving titles");
        callback(err, results);
    });
};
async.series([saveItems], function(err, results) {
    console.log("End");
    //process.exit();
});