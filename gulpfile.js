/**
 * Created by boot on 11/1/15.
 */
// get the dependencies
var gulp        = require('gulp'),
    childProcess  = require('child_process'),
    electron      = require('electron-prebuilt');

// create the gulp task
gulp.task('app', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});
gulp.task('window', function () {
    childProcess.spawn(electron, ['./window_report'], { stdio: 'inherit' });
});

gulp.task('trend', function () {
    childProcess.spawn(electron, ['./trend_report'], { stdio: 'inherit' });
});


gulp.task('debug', function () {
    childProcess.spawn(electron, ['--debug=5858', './app'], { stdio: 'inherit' });
});