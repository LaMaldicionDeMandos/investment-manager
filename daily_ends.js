/**
 * Created by boot on 1/6/16.
 */
var fs = require('fs');

Date.prototype.format = function() {
    return this.getFullYear() + '-' +
        ((this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
        '-' + ((this.getDate() < 10) ? '0' + this.getDate() : this.getDate());
};

var today = new Date();
var yesterday = new Date(today.setDate(today.getDate() - 1)).format();

function parseList(string) {
    try {
        return JSON.parse(string);
    } catch(e) {
        return parseList(string.substr(0, string.length - 1));
    }
}
function getLatest(title, path) {
    path+= '/BCBA/' + title + '/' + yesterday;
    console.log('fetching: ' + path);
    var string = fs.readFileSync(path, 'utf8');
    return parseList(string);
}

module.exports = getLatest;