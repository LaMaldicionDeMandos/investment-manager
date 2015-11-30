var request = require('request');
var fs = require('fs');
var th = require('through2');
var baseUrl = 'https://www.invertironline.com/Titulo/DescargarCotizacionesHistoricasTitulo?idTitulo=';

function Fetcher() {
	var that = this;
	this.fetchTitle = function(filepath, titleId) {
		var transform = th(function(data, encoding, done) {
			var string = data.toString();
			string = string.replace('Fecha', 'date');
			string = string.replace('Apertura', 'opening');
			string = string.replace('Maximo', 'max');
			string = string.replace('Minimo', 'min');
			string = string.replace('Cierre', 'closing');
			string = string.replace('CantNominal', 'amount');
			string = string.replace(/,/g, '.');
			string = string.replace(/;/g, ',');
			this.push(string);
			done();
		});
		request(baseUrl + titleId).pipe(transform).pipe(fs.createWriteStream(filepath));
	};
	this.fetchTitles = function(path, titles) {
		titles.forEach(function(key, title) {
			var finalPath = path + '/' + key + '/' + title.name + '.csv';
			console.log('Fetching ' + title.name + ' in ' + finalPath);
			that.fetchTitle(finalPath, title.id);
		});
	};
};	

module.exports = new Fetcher();