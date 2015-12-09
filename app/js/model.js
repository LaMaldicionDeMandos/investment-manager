/**
 * Created by marcelo on 18/11/15.
 */
function Title(title) {
    this.id = title._id;
    this.index = title.windowReports[0].report.predictionBefore.index;
    this.name = title.name;
    this.after = title.windowReports[0].report.predictionBefore.after;
    this.before = title.windowReports[0].report.predictionBefore.before;
    this.maxBefore = title.windowReports[0].report.predictionBefore.before +
        title.windowReports[0].report.predictionBefore.positiveError;
    this.maxAfter = title.windowReports[0].report.predictionBefore.after +
       title.windowReports[0].report.predictionBefore.positiveError;
    this.minBefore = title.windowReports[0].report.predictionBefore.before +
        title.windowReports[0].report.predictionBefore.negativeError;
    this.minAfter = title.windowReports[0].report.predictionBefore.after +
        title.windowReports[0].report.predictionBefore.negativeError;
    this.maxError = title.windowReports[0].report.predictionBefore.positiveError;
    this.minError = title.windowReports[0].report.predictionBefore.negativeError;
    this.errors = title.windowReports[0].report.predictionBefore.errorList;
    var filterErrors = function(self, percent) {
        percent = percent || 100;
        var factor = (100 - percent)/100;
        var cant = self.errors.length*factor;
        var rest = cant%2;
        var pos = cant/2 + rest;
        var neg = cant/2;
        return neg > 0 ? self.errors.slice(pos, -neg) : self.errors.slice(pos);
    };
    this.changeMaxAndMinBefore = function(percent) {
        var filtered = filterErrors(this, percent);
        this.maxBefore = this.before + filtered[0];
        this.minBefore = this.before + filtered[filtered.length - 1];
    };
    this.changeMaxAndMinAfter = function(percent) {
        var filtered = filterErrors(this, percent);
        this.maxAfter = this.after + filtered[0];
        this.minAfter = this.after + filtered[filtered.length - 1];
    };
    this.changeErrorPercent = function(percent) {
        var filteredError = filterErrors(this, percent);
        var min = Math.round(this.errors[this.errors.length-1]*10)/10;
        var max = Math.round(this.errors[0]*10)/10;
        var values = [];
        for (var v = min;v<=max;v+=0.1) {
            values.push({c:[{v: v}, {v:0}]});
        }
        filteredError.forEach(function(value) {
            var cut = Math.round(value*10)/10;
            var col = values.filter(function(c) {
                var diff = cut - c.c[0].v;
                return diff < .05 && diff > -.05;
            })[0];
            if (col) col.c[1].v++;
        });
        console.log('Filtering errors');
        values.forEach(function(value) {
            value.c[1].v*=100/values.length;
        });
        console.log('Procesing errors');
        this.maxError = filteredError[0];
        this.minError = filteredError[filteredError.length-1];
        return values;
    };

    var regression = function(size, target, attr) {
        var sx = 0;
        var sy = 0;
        var sxx = 0;
        var sxy = 0;
        var syy = 0;
        for(var i = size - 1 ;i>=0;i--) {
            var j = size - i - 1;
            sx+= j;
            sy+= target[i][attr];
            sxx+= j*j;
            sxy+= j*target[i][attr];
            syy+= target[i][attr]*target[i][attr];
        }
        var b = (size*sxy - sx*sy)/(size*sxx - sx*sx);
        var a = (sy - b*sx)/size;
        return function(x) {
            return a + b*x;
        };
    };
    var tendingPositive = function(history) {
        var count = 1;
        for (; history[count].percentBeforeOpen() > 0;count++) {}
        return count;
    };
    var tendingNegative = function(history) {
        var count = 1;
        for (; history[count].percentBeforeOpen() < 0;count++) {}
        return count;
    };
    var tendingZero = function(history) {
        var count = 1;
        for (; history[count].percentBeforeOpen() == 0;count++) {}
        return count;
    };

    this.calculateRegression = function(size) {
        size = size || 31;
        var cRegression = regression(size, this.history, 'closing');
        var oRegression = regression(size, this.history, 'opening');

        this.closingNextValue = cRegression(size);
        this.closingLastValue = this.history[0].closing;
        this.closingPercent = 100*(this.closingNextValue - this.closingLastValue)/this.closingLastValue;
        this.openingNextValue = oRegression(size);
        this.openingLastValue = this.history[0].opening;
        this.totalPercent = 100*(this.closingNextValue - this.openingNextValue)/this.openingNextValue;
        this.jumpPercent = 100*(this.openingNextValue - this.closingLastValue)/this.closingLastValue;
    };

    this.populate = function(history, size) {
        size = size || 31;
        this.history = history;
        this.calculateRegression(size);
        var minEqualClose = history.filter(function(item) {
            return item.min == item.closing;
        }).length;
        var maxEqualClose = history.filter(function(item) {
            return item.max == item.closing;
        }).length;
        this.minDiference = history.map(function(item) {
                return item.percentBeforeOpen() - item.percentMin();
            }).reduce(function(last, actual) {
                return last + actual;
            })/history.length;
        this.maxDiference = history.map(function(item) {
                return item.percentMax() - item.percentBeforeOpen();
            }).reduce(function(last, actual) {
                return last + actual;
            })/history.length;
        this.minEqualClosePercent = 100*minEqualClose/history.length;
        this.maxEqualClosePercent = 100*maxEqualClose/history.length;

        if (history[0].percentBeforeOpen() > 0) {
            this.consecutive = tendingPositive(history);
        } else if (history[0].percentBeforeOpen() < 0){
            this.consecutive = tendingNegative(history);
        } else {
            this.consecutive = tendingZero(history);
        }
        this.tendings = {positives: {}, negatives: {}, zero: {}};
        var count = 1;
        var actual = null;
        for (var i = history.length - 2; i >= 0; i--) {
            var last = history[i + 1].percentBeforeOpen();
            actual = history[i].percentBeforeOpen();
            if (last < 0 && actual < 0) {
                count++;
                if (i == 0) {
                    if (this.tendings.negatives[count]) {
                        this.tendings.negatives[count].count++;
                    } else {
                        this.tendings.negatives[count] = {count: 1};
                    }
                }
            } else if (last < 0 && actual >=0) {
                if (this.tendings.negatives[count]) {
                    this.tendings.negatives[count].count++;
                } else {
                    this.tendings.negatives[count] = {count: 1};
                }
                count = 1;
            } else if (last == 0 && actual != 0) {
                if (this.tendings.zero[count]) {
                    this.tendings.zero[count].count++;
                } else {
                    this.tendings.zero[count] = {count: 1};
                }
                count = 1;
            } else if (last == 0 && actual == 0) {
                count++;
                if (i == 0) {
                    if (this.tendings.zero[count]) {
                        this.tendings.zero[count].count++;
                    } else {
                        this.tendings.zero[count] = {count: 1};
                    }
                }
            } else if (last > 0 && actual <= 0) {
                if (this.tendings.positives[count]) {
                    this.tendings.positives[count].count++;
                } else {
                    this.tendings.positives[count] = {count: 1};
                }
                count = 1;
            } else {
                count++;
                if (i == 0) {
                    if (this.tendings.positives[count]) {
                        this.tendings.positives[count].count++;
                    } else {
                        this.tendings.positives[count] = {count: 1};
                    }
                }
            }
        }
        this.tendings.totalPositives = 0;
        this.tendings.totalNegatives = 0;
        this.tendings.totalZeros = 0;
        for (var key in this.tendings.positives) {
            this.tendings.totalPositives+= this.tendings.positives[key].count;
        }
        for (var key in this.tendings.negatives) {
            this.tendings.totalNegatives+= this.tendings.negatives[key].count;
        }
        for (var key in this.tendings.zero) {
            this.tendings.totalZeros+= this.tendings.zero[key].count;
        }
        for (var key in this.tendings.positives) {
            this.tendings.positives[key].percent = 100*this.tendings.positives[key].count/this.tendings.totalPositives;
        }
        for (var key in this.tendings.negatives) {
            this.tendings.negatives[key].percent = 100*this.tendings.negatives[key].count/this.tendings.totalNegatives;
        }
        for (var key in this.tendings.zero) {
            this.tendings.zero[key].percent = 100*this.tendings.zero[key].count/this.tendings.totalZeros;
        }
        var divisor = this.tendings.totalPositives + this.tendings.totalNegatives + this.tendings.totalZeros;
        this.tendings.positivePercent = 100*this.tendings.totalPositives/divisor;
        this.tendings.negativePercent = 100*this.tendings.totalNegatives/divisor;
        this.tendings.zeroPercent = 100*this.tendings.totalZeros/divisor;
        if (this.name == 'INAG') {
            console.log(this.tendings);
        }
    };
};

function Chart(type, cols, colors, colsToShow) {
    cols = cols || [];
    this.type = type;
    this.displayed = true;
    this.data = {
        cols: cols,
        rows: []
    };
    this.options = {
        colors: colors || ['#0000FF'],
        defaultColors: ['#0000FF'],
        isStacked: false,
        fill: 0,
        displayExactValues: false,
        vAxis: {
            gridlines: {count: 6}
        }
    };
    var columns = [];
    var n = cols.length;
    for(var i = 0; i < n;i++) {
        columns.push(i);
    }
    this.view = {columns: colsToShow || columns};
};

Chart.Type = {
    LINE: 'LineChart',
    SCATTER: 'ScatterChart'
};

Chart.createRow = function(columns) {
    var cols = columns.map(function(value) {
        return {v: value};
    });
    return {c:cols};
};