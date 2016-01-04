/**
 * Created by boot on 1/4/16.
 */
var request = require('request');
var cookie = process.argv[2];

var options = {
    url: 'https://www.invertironline.com/titulo/cotizacion/BCBA/GGAL',
    headers: {
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'es-419,es;q=0.8,en;q=0.6',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.invertironline.com/titulo/cotizacion/BCBA/IRSA',
        'Cookie': cookie,
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0'
    },
    gzip: true
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
    }
})