/**
 * Created by boot on 11/19/15.
 */
Date.prototype.formatTime = function() {
    return '' + (this.getHours() >= 10 ? this.getHours() : ('0' + this.getHours())) +
            ':' + (this.getMinutes() >= 10 ? this.getMinutes() : ('0' + this.getMinutes()));
}
password = process.argv[2];
sendMail = !(process.argv[4] == 'false');
console.log('Password: ' + password);
var runNow = process.argv[3] == 'true';
var analyze = require('./runtime_analytics');
var CronJob = require('cron').CronJob;
var loopJob;
var loop = function() {
    console.log("Analizing " + new Date().formatTime());
    analyze('./titles/runtime');
};
var start = function() {
    console.log('Run loop');
    loopJob = loopJob || new CronJob('*/30 * * * * *', loop, function() {
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