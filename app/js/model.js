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
        values.forEach(function(value) {
            value.c[1].v*=100/values.length;
        });
        this.maxError = filteredError[0];
        this.minError = filteredError[filteredError.length-1];
        return values;
    };
};