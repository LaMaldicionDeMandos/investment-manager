/**
 * Created by marcelo on 01/12/15.
 */
var fs = require('fs');

String.prototype.endWith = function(string) {
    return this.lastIndexOf(string) == this.length - string.length;
};

function parseList(string) {
    try {
        return JSON.parse(string);
    } catch(e) {
        return parseList(string.substr(0, string.length - 1));
    }
}
function getLatest(title, path, n) {
    path+= '/BCBA/' + title;
    n = n || 1;
    var files = fs.readdirSync(path).filter(function(file) {
        return file.endWith('.json');
    }).sort().reverse().slice(0, n);
    var list = files.map(function(file) {
        var string = fs.readFileSync(path + '/' + file, 'utf8');
        return parseList(string);
    });
    return list;
}

module.exports = getLatest;