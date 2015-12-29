/**
 * Created by boot on 12/29/15.
 */
var titleCodes = require('./title-codes.js');
var async = require('async');
var process = require('./ends_report/model.js');
var db = require('./database.js');

titleCodes.forEach(function(key, title) {
    process(db.ObjectId(), title);
});