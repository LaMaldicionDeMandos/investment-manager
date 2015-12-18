function Title(dto) {
    var that = this;
    this.id = dto._id;
    this.name = dto.name;
    this.up = 0;
    this.down = 0;
    this.zero = 0;
    this.days = 0;
    this.trend = {up: 0, down:0, zero: 0, size: 0, ups: {}, downs:{}, zeros:{}};
    var state = function(item) {
        return item.percentBeforeOpen > 0 ? 1 : (item.percentBeforeOpen < 0 ? -1 : 0);
    };
    var populateTrend = function(history, index){
        var next = state(history[index - 1]);
        that.trend.size++;
        if (next == 1) {
            that.trend.up++;
        } else if (next == -1) {
            that.trend.down++;
        } else {
            that.trend.zero++;
        }
        for(var i = 1;state(history[index - i]) == next;i++) {
            var att = next == 1 ? 'ups' : (next == -1 ? 'downs' : 'zeros');
            if (!that.trend[att][i]) {
                that.trend[att][i] = 1;
            } else {
                that.trend[att][i]++;
            }
        }
    };
    var findNegatives = function(history, size) {
        var list = [];
        for(var i = 1; i < history.length - size;i++) {
            if(history.slice(i, i + size).every(function(item){return item.percentBeforeOpen < 0;}) && history[i + size].percentBeforeOpen >= 0) {
                list.push(i);
            }
        }
        return list;
    };
    var findPositives = function(history, size) {
        var list = [];
        for(var i = 1; i < history.length - size;i++) {
            if(history.slice(i, i + size).every(function(item){return item.percentBeforeOpen > 0;}) && history[i + size].percentBeforeOpen <= 0) {
                list.push(i);
            }
        }
        return list;
    };
    var findZeros = function(history, size) {
        var list = [];
        for(var i = 1; i < history.length - size;i++) {
            if(history.slice(i, i + size).every(function(item){return item.percentBeforeOpen == 0;}) && history[i + size].percentBeforeOpen != 0) {
                list.push(i);
            }
        }
        return list;
    };
    var processNegative = function(history) {
        that.down = 1;
        for(;history[that.down].percentBeforeOpen < 0;that.down++) {}
        var negatives = findNegatives(history, that.down);
        negatives.forEach(function(index) {
           populateTrend(history, index);
        });
    };
    var processPositive = function(history) {
        that.up = 1;
        for(;history[that.up].percentBeforeOpen > 0;that.up++) {}
        var positives = findPositives(history, that.up);
        positives.forEach(function(index) {
            populateTrend(history, index);
        });
    };
    var processZero = function(history) {
        that.zero = 1;
        for(;history[that.zero].percentBeforeOpen == 0;that.zero++) {}
        var zeros = findZeros(history, that.zero);
        zeros.forEach(function(index) {
            populateTrend(history, index);
        });
    };
    this.setHistory = function(history) {
        console.log('Setting history for ' + this.name);
        this.history = history;
        if (this.history[0].percentBeforeOpen < 0) {
            processNegative(history);
        } else if(this.history[0].percentBeforeOpen > 0) {
            processPositive(history);
        } else {
            processZero(history);
        }
        this.days = Math.max(this.up, this.down, this.zero);
        for (var att in this.trend.ups) {
            this.trend.ups[att] = 100*this.trend.ups[att]/this.trend.size;
        }
        for (var att in this.trend.zeros) {
            this.trend.zeros[att] = 100*this.trend.zeros[att]/this.trend.size;
        }
        for (var att in this.trend.downs) {
            this.trend.downs[att] = 100*this.trend.downs[att]/this.trend.size;
        }

        this.upPercent = 100*this.trend.up/this.trend.size;
        this.downPercent = 100*this.trend.down/this.trend.size;
        this.zeroPercent = 100*this.trend.zero/this.trend.size;
    }
}