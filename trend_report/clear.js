/**
 * Created by boot on 12/30/15.
 */
var database = require('../database.js');

var clean = function(callback) {
    database.TitleTrend.remove({}, callback)
};

var onEnd = function(err) {
    console.log("clear database");
    if (!err) {
        console.log("clear TitleTrend");
    } else {
        console.log("error clear TitleTrend");
    }
    process.exit();
};

clean(onEnd);
