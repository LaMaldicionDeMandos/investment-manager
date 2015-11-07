/**
 * Created by marcelo on 29/10/15.
 */
function predictionByNWindow(it, n, position, percentFunc) {
    position = position || 0;
    var jsonArray = it.history.slice(0, it.history.length);
    n = (it.history.length - position > n) ? n : it.history.length - position;
    var lasts = jsonArray.slice(position, position + n);
    var difs = [];
    for (var i = 0; i < jsonArray.length - n;i++) {
        if (i + n  <= position || i >= position + n) {
            var diff = 0;
            for (var j = 0; j < n; j++) {
                diff+= Math.abs(lasts[j][percentFunc]() - jsonArray[i + j][percentFunc]());
            }
            difs.push(diff);
        } else {
            difs.push(NaN);
        }
    }
    var min = 10000000;
    var index = 0;
    for (var i = 1; i < difs.length; i++) {
        if (!isNaN(difs[i]) && difs[i] < min) {
            min = difs[i];
            index = i;
        }
    }
    return index - 1;
};

function standardErrorByNWindow(it, n, percent, percentFunc) {
    var predictions = [];
    for (var i = 0; i < it.history.length - n; i++) {
        predictions.push(it.history[predictionByNWindow(it, n, i, percentFunc)][percentFunc]());
    }
    var errors = [];

    for(var i = 1; i < predictions.length;i++) {
        var prediction = predictions[i];
        var real = it.history[i-1][percentFunc]();
        errors.push(real - prediction);
    }

    var factor = 1 - percent/100;
    var cant = errors.length*factor;
    var rest = cant%2;
    var pos = cant/2 + rest;
    var neg = cant/2;

    errors.sort(function(a, b) { return b - a;});
    var filteredError = errors.slice(pos, -neg);
    var report = {};
    report.positiveError = filteredError[0];
    report.negativeError = filteredError[filteredError.length-1];
    report.errorList = errors;
    return report;
};

exports.standardErrorByNWindowBefore = function(it, n, percent) {
    return standardErrorByNWindow(it, n, percent, 'percentBeforeOpen');
};

exports.standardErrorByNWindowAfter = function(it, n, percent) {
    return standardErrorByNWindow(it, n, percent, 'percentAfterOpen');
};

exports.predictionByNWindowBefore = function(it, n, position) {
    return predictionByNWindow(it, n, position, 'percentBeforeOpen');
};

exports.predictionByNWindowAfter = function(it, n, position) {
    return predictionByNWindow(it, n, position, 'percentAfterOpen');
};