/**
 * Created by boot on 11/19/15.
 */
Date.prototype.formatTime = function() {
    return '' + (this.getHours() >= 10 ? this.getHours() : ('0' + this.getHours())) +
            ':' + (this.getMinutes() >= 10 ? this.getMinutes() : ('0' + this.getMinutes()));
};
cookie = process.argv[2];
var fetcher = require('./end_runtime_fetcher.js');
var loader = fetcher.loader;
var cleaner = fetcher.cleaner;
var runNow = process.argv[3] == 'true';
var CronJob = require('cron').CronJob;
var loopJob;
var loop = function() {
    console.log("Analizing " + new Date().formatTime());
    try {
        loader(cookie);
    } catch(e) {
        console.log(e);
    }
};
var start = function() {
    console.log('Run loop');
    loopJob = loopJob || new CronJob('0 * * * * *', loop, function() {
            console.log('stop loop');
        }, true);
};
var stop = function() {
    if (loopJob) {
        console.log('stoping loop');
        loopJob.stop();
    }
    cleaner();
};
var startJob = new CronJob('0 10 * * 1-5', start, null, true);
if (runNow) {
    start();
}
var stopJob = new CronJob('5 17 * * 1-5', stop, null, true);