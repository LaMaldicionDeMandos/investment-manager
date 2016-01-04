/**
 * Created by boot on 1/4/16.
 */
var database = require('./database.js');
var loader = require('./ends_loader.js');
var titleCodes = require('./title-codes.js');
var async = require('async');
var functions = [];

module.exports = function(cookie) {
    titleCodes.forEach(function(key, title) {
        functions.push(function(callback) {
            loader(title.name, cookie).then(function(ends) {
                console.log('Ends for ' + title.name + ' --> ' + JSON.stringify(ends));
                callback(null, ends);
            });
        });
    });
    async.parallel(functions, function(err, results) {
        console.log("End");
        process.exit();
    });
};
