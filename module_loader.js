/**
 * Created by boot on 12/24/15.
 */
var fs = require('fs');

var files = fs.readdirSync('./');

function load(name) {
    var modules = [];
    files.forEach(function(file) {
        if (fs.lstatSync(file).isDirectory()) {
            var module = './' + file + '/' + name + '.js';
            if (fs.existsSync(module)) {
                modules.push(require(module));
            }
        }
    });
    return modules;
};

module.exports = load;