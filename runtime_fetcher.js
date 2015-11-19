/**
 * Created by boot on 11/19/15.
 */
var request = require('request');
var fs = require('fs');
var th = require('through2');
var baseUrl = 'https://www.invertironline.com/Titulo/GraficoIntradiario?idTitulo=%s&idTipo=4&idMercado=1';

var replace = function(p, c) { return p.replace(/%s/, c);};
String.prototype.format = function(p) {
    return p.reduce(replace, this);
};

function Fetcher() {
    var that = this;
    this.fetchTitle = function(title, path) {
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
        console.log('Fetching titles from: ' + baseUrl.format([title]));
        request(baseUrl.format([title])).pipe(transform).pipe(fs.createWriteStream(path));
    };
    this.fetchTitles = function(path, titles) {
        titles.forEach(function(key, title) {
            var finalPath = path + '/' + key + '/' + title.name + '.json';
            that.fetchTitle(title.id, finalPath);
        });
    };
};

module.exports = new Fetcher();