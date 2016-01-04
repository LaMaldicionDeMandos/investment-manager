/**
 * Created by boot on 1/4/16.
 */
var parser = require('html-to-json');
var q = require('q');
var urlTemplate = 'https://www.invertironline.com/titulo/cotizacion/BCBA/';
function Options(title, cookie) {
    this.url = urlTemplate + title;
    this.headers = {
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'es-419,es;q=0.8,en;q=0.6',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.invertironline.com/titulo/cotizacion/BCBA/IRSA',
        'Cookie': cookie,
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0'
    };
    this.gzip = true;
};

function clear(ends) {
    while(ends.length > 0 && (isNaN(ends[0].amount) || ends[0].amount == 0)) {
        ends.splice(0, 1);
    }
};

function process(title, cookie) {
    var options = new Options(title, cookie);
    var def = q.defer();
    var promise = parser.request(options, ['.grid_12.centre-blk .grid_6.alpha table:contains("Caja de Puntas") tbody ' +
    'tr:not(".sub-header") td', function($doc) {
        return $doc
            .text().replace('.', '').replace('AR$ ','').replace(',','.');

    }]);
    promise.done(function (result) {
        var ends = [];
        for (var i = 0; i < result.length;i++) {
            if(i % 4 == 0) {
                ends.push({buyAmount: parseInt(result[i])});
            } else if(i % 4 == 1){
                ends[ends.length-1].buyPrice = parseFloat(result[i]);
            } else if(i % 4 == 2){
                ends[ends.length-1].salePrice = parseFloat(result[i]);
            } else if(i % 4 == 3){
                ends[ends.length-1].saleAmount = parseInt(result[i]);
            }
        }
        def.resolve(ends);
        var buys = ends.map(function(item) {
            return {amount: item.buyAmount, price: item.buyPrice};
        });
        var sales = ends.map(function(item) {
            return {amount: item.saleAmount, price: item.salePrice};
        });
        var trans = [];
        clear(buys);
        clear(sales);
        while(buys.length > 0 && sales.length > 0) {
            var min = Math.min(buys[0].amount, sales[0].amount);
            trans.push({amount: min, price: (buys[0].price + sales[0].price)/2});
            buys[0].amount-= min;
            sales[0].amount-= min;
            clear(buys);
            clear(sales);
        }
        var sum = 0;
        var val = 0;
        trans.forEach(function(tran) {
            sum+=tran.amount;
            val+=tran.amount*tran.price;
        });
        //console.log('Promedio: ' + val/sum);
        //console.log('Ultimo: ' + JSON.stringify(trans.pop()));
    });
    return def.promise;
};

module.exports = process;