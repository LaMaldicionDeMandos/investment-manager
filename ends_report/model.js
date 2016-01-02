/**
 * Created by boot on 12/21/15.
 */
var db = require('../database.js');
var TitleEnds = db.TitleEnds;
var TitleEndsDaily = db.TitleEndsDaily;

function calculateEstimated(ends) {
    var sumBuy = 0;
    var sumSale = 0;
    ends.forEach(function(item) {
        if (item.buyAmount != null) { sumBuy+= item.buyAmount;}
        if (item.saleAmount != null) { sumSale+= item.saleAmount;}
    });
    var sum = Math.min(sumBuy, sumSale);
    sumBuy = 0;
    sumSale = 0;
    var buy;
    var sale;
    for (var i = ends.length-1; sum > sumBuy;i--) {
        sumBuy+= ends[i].buyAmount;
        if (sumBuy >= sum) {
            buy = ends[i].buyPrice;
        }
    }
    for (var j = ends.length-1; sum > sumSale ;j--) {
        try {
            sumSale+= ends[j].saleAmount;
        }catch(e) {
            console.log('Sum: ' + sum + ' SumSale: ' + sumSale + ' j: ' + j);
            throw e;
        }
        if (sumSale >= sum) {
            sale = ends[j].salePrice;
        }
    }
    return (buy + sale)/2;
}

function calculateEstimatedPerfect(ends) {
    var buyIndex = 4;
    var saleIndex = 4;
    var amount = 0;
    var price = 0;
    while(buyIndex >= 0 && saleIndex >=0) {
        if (!ends[buyIndex] || isNaN(ends[buyIndex].buyAmount)) {
            buyIndex--;
            continue;
        }
        if (!ends[saleIndex] || isNaN(ends[saleIndex].saleAmount)) {
            saleIndex--;
            continue;
        }
        var min = Math.min(ends[buyIndex].buyAmount, ends[saleIndex].saleAmount);
        ends[buyIndex].buyAmount-= min;
        ends[saleIndex].saleAmount-= min;
        amount+= min;
        price+=min*(ends[buyIndex].buyPrice + ends[saleIndex].salePrice)/2;
        if (ends[buyIndex].buyAmount == 0){
            buyIndex--;
        }
        if (ends[saleIndex].saleAmount == 0){
            saleIndex--;
        }
    }
    return price/amount;
}
var process = function(_id, dto) {
    console.log('Finding model for ends ' + dto.name);
    TitleEnds.findOne({name: dto.name}, function(err, end) {
        if (err || !end) {
            console.log('Error with: ' + dto.name + err);
            console.log(JSON.stringify(end));
            return;
        }

        var last = end.ends[end.ends.length-1];
        if (last.ends.every(function(end) { return end.buyAmount == null }) ||
            last.ends.every(function(end) { return end.saleAmount == null })) {
            return;
        }
        console.log('Saving model for ends ' + dto.name);
        var title = new TitleEndsDaily();
        title._id = _id;
        title.name = dto.name;
        title.ends = last.ends.map(function(end) {
            return {buyAmount: end.buyAmount, buyPrice: end.buyPrice, saleAmount: end.saleAmount, salePrice: end.salePrice};
        });
        title.price = dto.history[0].closing;
        try {
            title.estimated = calculateEstimated(last.ends);
            var estimated = calculateEstimatedPerfect(last.ends);
        }catch(e) {
           console.log(dto.name + 'Throw an error --> ' + e);
        }
        var percent = 100*(estimated - title.price)/title.price;
        title.averangeEstimated = estimated;
        title.averangePercent = percent;
        title.percent = 100*(title.estimated - title.price)/title.price;
        title.save(function(err) {
            if (err) {
                console.log(err);
                console.log('Error: ' + title.name + ' --> ' + err);
            } else {
                console.log('Save Success Ends:' + title.name);
            }
        });
    });

};

module.exports = process;