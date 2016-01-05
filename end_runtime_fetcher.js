/**
 * Created by boot on 1/4/16.
 */
var fs = require('fs');
var loader = require('./ends_loader.js');
var titleCodes = require('./title-codes.js');
var async = require('async');
var functions = [];
var path = './titles/ends/BCBA';

Date.prototype.format = function() {
    return this.getFullYear() + '-' +
        ((this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
        '-' + ((this.getDate() < 10) ? '0' + this.getDate() : this.getDate());
};

var now = new Date().format();

function createFolderIfNotExist(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder,0744);
    }
}

function createFolder(title) {
    var titlePath = path + '/' + title;
    createFolderIfNotExist(titlePath);
}

function append(title, ends, callback) {
    var filename = path + '/' + title + '/' + now;
    fs.appendFile(filename, JSON.stringify(ends) + '\n', function(err) {
        callback(err, title);
        if (err) console.log(err);
    });
};
function EndRuntimeFetcher() {
    this.loader = function (cookie) {
        titleCodes.forEach(function (key, title) {
            createFolder(title.name);
            functions.push(function (callback) {
                loader(title.name, cookie).then(function (ends) {
                    console.log('Ends for ' + title.name + ' --> ' + JSON.stringify(ends));
                    var item = {time: new Date().getTime(), ends: ends};
                    append(title.name, item, callback);
                });
            });
        });
        async.parallel(functions, function (err, results) {
            console.log("End");
            //process.exit();
        });
    };

    this.cleaner = function () {
        console.log('Cleaning');
    };
};

module.exports = new EndRuntimeFetcher();
