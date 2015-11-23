/**
 * Created by boot on 11/19/15.
 */
var request = require('request');
var fs = require('fs');
var th = require('through2');
var q = require('q');
var baseUrl = 'https://www.invertironline.com/Titulo/GraficoIntradiario?idTitulo=%s&idTipo=4&idMercado=1';

var replace = function(p, c) { return p.replace(/%s/, c);};
String.prototype.format = function(p) {
    return p.reduce(replace, this);
};

Date.prototype.format = function() {
    return this.getFullYear() + '-' +
        ((this.getMonth() < 10) ? '0' + this.getMonth() : this.getMonth()) +
        '-' + ((this.getDay() < 10) ? '0' + this.getDay() : this.getDay())
}

function parseList(string) {
    try {
        return JSON.parse(string);
    } catch(e) {
        return parseList(string.substr(0, string.length - 1));
    }
}

function Fetcher() {
    var that = this;
    this.fetchTitle = function(title, path) {
        var def = q.defer();
        var transform = th(function(data, encoding, done) {
            var string = data.toString();
            string = string.replace(/FechaHoraGMT/g, 'dateTimeGMT');
            string = string.replace(/FechaHora/g, 'dateTime');
            string = string.replace(/Ultima/g, 'value');
            string = string.replace(/CantidadNominal/g, 'nominalCount');
            string = string.replace(/Fecha/g, 'date');
            string = string.replace(/hora/g, 'time');
            this.push(string);
            done();
        });
        var writer = fs.createWriteStream(path);
        writer.on('close', function() {
            var string = fs.readFileSync(path, 'utf8');
            var list = parseList(string);
            def.resolve(list);
        });
        request(baseUrl.format([title])).pipe(transform).pipe(writer);
        return def.promise;
    };
    this.fetchTitles = function(path, titles) {
        var promises = [];
        titles.forEach(function(key, title) {
            var finalPath = path + '/' + key + '/' + title.name;
            if (!fs.existsSync(finalPath)) {
                fs.mkdirSync(finalPath,0744);
            }
            finalPath+= '/' + new Date().format() + '.json';
            promises.push({title: title, promise: that.fetchTitle(title.id, finalPath)});
        });
        return promises;
    };
};

module.exports = new Fetcher();