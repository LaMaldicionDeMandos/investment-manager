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
    return jsonArray[index - 1][percentFunc]();
};

function standardErrorByNWindow(it, n, percentFunc) {
    var predictions = [];
    for (var i = 0; i < it.history.length - n; i++) {
        predictions.push(predictionByNWindow(it, n, i, percentFunc));
    }
    var negatives = [];
    var positives = [];

    for(var i = 1; i < predictions.length;i++) {
        var prediction = predictions[i];
        var real = it.history[i-1][percentFunc]();
        if (prediction - real <= 0) {
            positives.push(real - prediction);
        }
        if (real - prediction <= 0) {
            negatives.push(prediction - real);
        }
    }
    var total = positives.length + negatives.length;
    var report = {positivesPercent: 100*positives.length/total, negativesPercent:100*negatives.length/total};
    var sum = 0;
    var neg = 0;
    var pos = 0;
    positives.forEach(function(value) {
        sum+= value;
        pos+= value;
    });
    negatives.forEach(function(value) {
        sum+= value;
        neg+= value;
    });
    report.error = sum/(positives.length + negatives.length);
    report.positives = pos/positives.length;
    report.negatives = neg/negatives.length;
    return report;
};

exports.standardErrorByNWindowBefore = function(it, n) {
    return standardErrorByNWindow(it, n, 'percentBeforeOpen');
};

exports.standardErrorByNWindowAfter = function(it, n) {
    return standardErrorByNWindow(it, n, 'percentAfterOpen');
};

exports.predictionByNWindowBefore = function(it, n, position) {
    return predictionByNWindow(it, n, position, 'percentBeforeOpen');
};

exports.predictionByNWindowAfter = function(it, n, position) {
    return predictionByNWindow(it, n, position, 'percentAfterOpen');
};