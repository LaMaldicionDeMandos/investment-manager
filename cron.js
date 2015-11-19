/**
 * Created by boot on 11/19/15.
 */
var CronJob = require('cron').CronJob;
var loop;
var start = new CronJob('0 11 * * 1-2-3-4-5', function() {
    console.log('Run loop');
    loop = loop || new CronJob('*/30 * * * * *', function() {
        console.log('Corre cada 30 segundos');
    }, function() {
        console.log('stop loop');
    });
    loop.start();
});

start.start();

var stop = new CronJob('0 17 * * 1-2-3-4-5', function() {
    if (loop) {
        console.log('stoping loop');
        loop.stop();
    }
});
stop.start();