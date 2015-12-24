/**
 * Created by boot on 12/21/15.
 */
var TitleTrend = require('../database.js').TitleTrend;
var state = function(item) {
    return item.percentBeforeOpen() > 0 ? 1 : (item.percentBeforeOpen() < 0 ? -1 : 0);
};
var populateTrend = function(title, history, index){
    var next = state(history[index - 1]);
    title.trend.size++;
    if (next == 1) {
        title.trend.up++;
    } else if (next == -1) {
        title.trend.down++;
    } else {
        title.trend.zero++;
    }
    for(var i = 1;state(history[index - i]) == next;i++) {
        var att = next == 1 ? 'ups' : (next == -1 ? 'downs' : 'zeros');
        if (!title.trend[att][i]) {
            title.trend[att][i] = 1;
        } else {
            title.trend[att][i]++;
        }
    }
};
var findNegatives = function(history, size) {
    var list = [];
    for(var i = 1; i < history.length - size;i++) {
        if(history.slice(i, i + size).every(function(item){return item.percentBeforeOpen() < 0;}) && history[i + size].percentBeforeOpen() >= 0) {
            list.push(i);
        }
    }
    return list;
};
var findPositives = function(history, size) {
    var list = [];
    for(var i = 1; i < history.length - size;i++) {
        if(history.slice(i, i + size).every(function(item){return item.percentBeforeOpen() > 0;}) && history[i + size].percentBeforeOpen() <= 0) {
            list.push(i);
        }
    }
    return list;
};
var findZeros = function(history, size) {
    var list = [];
    for(var i = 1; i < history.length - size;i++) {
        if(history.slice(i, i + size).every(function(item){return item.percentBeforeOpen() == 0;}) && history[i + size].percentBeforeOpen() != 0) {
            list.push(i);
        }
    }
    return list;
};
var processNegative = function(title, history) {
    title.down = 1;
    for(;history[title.down].percentBeforeOpen() < 0;title.down++) {}
    var negatives = findNegatives(history, title.down);
    negatives.forEach(function(index) {
        populateTrend(title, history, index);
    });
};
var processPositive = function(title, history) {
    title.up = 1;
    for(;history[title.up].percentBeforeOpen() > 0;title.up++) {}
    var positives = findPositives(history, title.up);
    positives.forEach(function(index) {
        populateTrend(title, history, index);
    });
};
var processZero = function(title, history) {
    title.zero = 1;
    for(;history[title.zero].percentBeforeOpen() == 0;title.zero++) {}
    var zeros = findZeros(history, title.zero);
    zeros.forEach(function(index) {
        populateTrend(title, history, index);
    });
};
var process = function(_id, dto) {
    console.log('Saving model for trends');
    var title = new TitleTrend();
    title._id = _id;
    title.name = dto.name;
    title.up = 0;
    title.down = 0;
    title.zero = 0;
    title.days = 0;
    title.trend = {up: 0, down:0, zero: 0, size: 0, ups: {}, downs:{}, zeros:{}, downsPercent: {}, upsPercent: {}, zerosPercent: {}};
    console.log('Setting history for ' + dto.name);
    if (dto.history[0].percentBeforeOpen() < 0) {
        processNegative(title, dto.history);
    } else if(dto.history[0].percentBeforeOpen() > 0) {
        processPositive(title, dto.history);
    } else {
        processZero(title, dto.history);
    }
    title.days = Math.max(title.up, title.down, title.zero);
    for (var att in title.trend.ups) {
        title.trend.upsPercent[att] = 100*title.trend.ups[att]/title.trend.size;
    }
    for (var att in title.trend.zeros) {
        title.trend.zerosPercent[att] = 100*title.trend.zeros[att]/title.trend.size;
    }
    for (var att in title.trend.downs) {
        title.trend.downsPercent[att] = 100*title.trend.downs[att]/title.trend.size;
    }

    title.upPercent = 100*title.trend.up/title.trend.size;
    title.downPercent = 100*title.trend.down/title.trend.size;
    title.zeroPercent = 100*title.trend.zero/title.trend.size;
    title.save(function(err) {
        if (err) {
            console.log(err);
            console.log('Error: ' + title.name + ' --> ' + err);
        } else {
            console.log('Save Success:' + title.name);
        }
    });
};

module.exports = process;