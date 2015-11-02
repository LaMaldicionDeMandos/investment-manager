/**
 * Created by boot on 11/1/15.
 */
// app/main.js
'use strict';

// Module to control application life.
var app = require('app');

// Module to create native browser window.
var BrowserWindow = require('browser-window');
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    console.log('All closed: ' + process.platform);
    if (process.platform != 'darwin') {
        app.quit();
    }
    process.exit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {

    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600, title: 'Investment Manager', icon: 'app/assets/logo.png' });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Open the devtools.
    // mainWindow.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

});