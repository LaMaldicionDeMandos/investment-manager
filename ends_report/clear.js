/**
 * Created by boot on 12/30/15.
 */
var database = require('../database.js');

var clean = function(callback) {
    database.TitleEndsDaily.remove({}, callback)
};

var onEnd = function(err) {
    console.log("clear database");
    if (!err) {
        console.log("clear TitleEndsDaily");
    } else {
        console.log("error clear TitleEndsDaily");
    }
    process.exit();
};

clean(onEnd);
