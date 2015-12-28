/**
 * Created by boot on 12/27/15.
 */
var fs = require('fs');
var th = require('through2');
var q = require('q');
var csv = require("csvjson");
var transform = th(function(data, encoding, done) {
    var string = data.toString();
    string = string.replace('Cantidad Compra', 'buyAmount');
    string = string.replace('Precio Compra', 'buyPrice');
    string = string.replace('Precio Venta', 'salePrice');
    string = string.replace('Cantidad Venta', 'saleAmount');
    string = string.replace(/AR\$ /g, '');
    this.push(string);
    done();
});
var create = function(path, fileName, newFileName) {
    var def = q.defer();
    var writer = fs.createWriteStream(path + '/' + newFileName);
    fs.createReadStream(path + '/' + fileName).pipe(transform).pipe(writer);
    writer.on('close', function() {
        var json = csv.toObject(path + '/' + newFileName).output;
        var list = [];
        var sortedList = json.sort(function(a, b) {
            if (a.title > b.title) return 1;
            if (a.title < b.title) return -1;
            if (!isNaN(a.buyPrice) && !isNaN(b.buyPrice)) {
                return parseFloat(a.buyPrice) > parseFloat(b.buyPrice) ? 1 : -1

            } else if (!isNaN(a.buyPrice) && isNaN(b.buyPrice)) {
                return 1;
            } else if(isNaN(a.buyPrice) && !isNaN(b.buyPrice)) {
                return -1;
            } else {
                if (!isNaN(a.salePrice) && !isNaN(b.salePrice)) {
                    return parseFloat(a.salePrice) > parseFloat(b.salePrice) ? -1 : 1;
                } else if (!isNaN(a.salePrice) && isNaN(b.salePrice)) {
                    return 1;
                } else if(isNaN(a.buyPrice) && !isNaN(b.buyPrice)) {
                    return -1;
                }
            }
            return 0;
        });
        var current = undefined;
        sortedList.forEach(function(item) {
           if(!current || current.name != item.title) {
               current = {name: item.title, ends: [{buyAmount: parseInt(item.buyAmount), buyPrice: parseFloat(item.buyPrice),
               salePrice: parseFloat(item.salePrice), saleAmount: parseInt(item.saleAmount)}]};
               list.push(current);
           } else {
               current.ends.push({buyAmount: item.buyAmount, buyPrice: item.buyPrice,
                   salePrice: item.salePrice, saleAmount: item.saleAmount});
           }
        });
        def.resolve(list);
    });
    return def.promise;
};

module.exports = create;