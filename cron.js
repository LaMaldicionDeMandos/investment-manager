/**
 * Created by boot on 11/19/15.
 */
password = process.argv[2];
console.log('Password: ' + password);
var runNow = process.argv[3] == 'true';
var analyze = require('./runtime_analytics');
var CronJob = require('cron').CronJob;
var loopJob;
var loop = function() {
    console.log("Analizing");
    analyze('./titles/runtime');
};
var start = function() {
    console.log('Run loop');
    loopJob = loopJob || new CronJob('*/10 * * * * *', loop, function() {
            console.log('stop loop');
        }, true);
};
var stop = function() {
    if (loopJob) {
        console.log('stoping loop');
        loopJob.stop();
    }
};
var startJob = new CronJob('0 11 * * 1-5', start, null, true);
if (runNow) {
    start();
}
var stopJob = new CronJob('0 17 * * 1-5', stop, null, true);