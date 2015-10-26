var request = require('request');
var fs = require('fs');
var baseUrl = 'https://www.invertironline.com/Titulo/DescargarCotizacionesHistoricasTitulo?idTitulo=';

function Fetcher() {
	this.fetchTitle = function(filepath, titleId) {
		request(baseUrl + titleId).pipe(fs.createWriteStream(filepath));
	};
	this.fetchTitles = function(path, titles) {
		titles.forEach(function(key, title) {
			var finalPath = path + '/' + key + '/' + title.name + '.csv';
			console.log('Fetching ' + title.name + ' in ' + finalPath);
			this.fetchTitle(finalPath, title.id);
		});
	};
};	

module.exports = new Fetcher();