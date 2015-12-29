/**
 * Created by boot on 12/21/15.
 */
var db = require('../database.js');
var TitleEnds = db.TitleEnds;
var TitleEndsDaily = db.TitleEndsDaily;
var process = function(_id, dto) {
    console.log('Finding model for ends ' + dto.name);
    TitleEnds.findOne({name: dto.name}, function(err, end) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Saving model for ends ' + dto.name);
        var last = end.ends[end.ends.length-1];
        var title = new TitleEndsDaily();
        title._id = _id;
        title.name = dto.name;
        title.ends = last.ends;
        title.price = dto.history[0].closing;
        var buyIndex = 4;
        var saleIndex = 4;
        var amount = 0;
        var price = 0;
        while(buyIndex >= 0 && saleIndex >=0) {
            if (!last.ends[buyIndex] || isNaN(last.ends[buyIndex].buyAmount)) {
                buyIndex--;
                continue;
            }
            if (!last.ends[saleIndex] || isNaN(last.ends[saleIndex].saleAmount)) {
                saleIndex--;
                continue;
            }
            var min = Math.min(last.ends[buyIndex].buyAmount, last.ends[saleIndex].saleAmount);
            last.ends[buyIndex].buyAmount-= min;
            last.ends[saleIndex].saleAmount-= min;
            amount+= min;
            price+=min*(last.ends[buyIndex].buyPrice + last.ends[saleIndex].salePrice)/2;
            if (last.ends[buyIndex].buyAmount == 0){
                buyIndex--;
            }
            if (last.ends[saleIndex].saleAmount == 0){
                saleIndex--;
            }
        }
        var estimated = price/amount;
        var percent = 100*(estimated - title.price)/title.price;
        title.estimated = estimated;
        title.percent = percent;
        title.save(function(err) {
            if (err) {
                console.log(err);
                console.log('Error: ' + title.name + ' --> ' + err);
            } else {
                console.log('Save Success:' + title.name);
            }
        });
    });

};

module.exports = process;