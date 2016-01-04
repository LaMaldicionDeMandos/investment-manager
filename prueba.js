/**
 * Created by boot on 1/4/16.
 */
var loader = require('./end_runtime_fetcher.js');
var cookie = process.argv[2];
loader(cookie);