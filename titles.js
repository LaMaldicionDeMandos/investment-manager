var database = require('./database.js');
var predictions = require('./predictions.js');
var csv = require("csvjson");
function Title(name, array) {
	this.name = name;
	array.forEach(function(item, index, array) {
	   		item.opening = parseFloat(item.opening);
   			item.closing = parseFloat(item.closing);
			item.max = parseFloat(item.max);
			item.min = parseFloat(item.min);
			item.jump = (index == array.length - 1) ? 0 : item.opening - parseFloat(array[index + 1].closing);
   			item.percentAfterOpen = function() {
				return 100*(item.closing - item.opening)/item.opening;
			};
			item.percentBeforeOpen = function() {
				return 100*(item.closing - item.opening + item.jump)/(item.opening - item.jump);
			};
	});
	this.history = array;

	this.standardErrorByNWindowBefore = function(n, percent) {
		return predictions.standardErrorByNWindowBefore(this, n, percent);
	};

	this.standardErrorByNWindowAfter = function(n, percent) {
		return predictions.standardErrorByNWindowAfter(this, n, percent);
	};

	this.predictionByNWindowBefore = function(n, position) {
		return predictions.predictionByNWindowBefore(this, n, position);
	};
	this.predictionByNWindowAfter = function(n, position) {
		return predictions.predictionByNWindowAfter(this, n, position);
	};
	var createPredictionReport = function(that, size, mode, errorPercent) {
		var prediction = new database.Prediction();
		prediction.index = that['predictionByNWindow' + mode](size);
		prediction.before = that.history[prediction.index].percentBeforeOpen();
		prediction.after = that.history[prediction.index].percentAfterOpen();
		var errorReport = that['standardErrorByNWindow' + mode](size, errorPercent);
		prediction.errorList = errorReport.errorList;
		prediction.positiveError = errorReport.positiveError;
		prediction.negativeError = errorReport.negativeError;
		return prediction;
	};
	this.windowReports = [{
		size: 10, report: {
		predictionBefore: createPredictionReport(this, 10, 'Before', 90),
		predictionAfter: createPredictionReport(this, 10, 'After', 90)
	}}];
	this.save = function(callback) {
		var dto = new database.Title();
		dto._id = database.ObjectId();
		dto.name = this.name;
		dto.history = [];
		this.history.forEach(function(item) {
			var historyDto = new database.History();
			historyDto.date = item.date;
			historyDto.opening = item.opening;
			historyDto.max = item.max;
			historyDto.min = item.min;
			historyDto.closing = item.closing;
			historyDto.amount = item.amount;
			historyDto.jump = item.jump;
			dto.history.push(historyDto);
		});
		var report = {size: this.windowReports[0].size};
		var windowReport = new database.WindowReport();
		windowReport.predictionBefore = this.windowReports[0].report.predictionBefore;
		windowReport.predictionAfter = this.windowReports[0].report.predictionAfter;
		report.report = windowReport;
		dto.windowReports = [report];
		dto.save(function(err) {
			if (err) {
				console.log(err);
				callback('Error: ' + dto.name + ' --> ' + err);
			} else {
				console.log('Save Success:' + dto.name);
				callback();
			}
		});
	};
};

var create = function(filename, name) {
	var json = csv.toObject(filename).output;
	return new Title(name, json);
};

module.exports = create;
