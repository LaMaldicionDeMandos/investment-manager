var request = require('request');
var fs = require('fs');
var baseUrl = 'https://www.invertironline.com/Titulo/DescargarCotizacionesHistoricasTitulo?idTitulo=';

module.exports = function(filepath, titleId) {
	request(baseUrl + titleId).pipe(fs.createWriteStream(filepath));
};