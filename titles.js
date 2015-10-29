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

	this.standardErrorByNWindowBefore = function(n) {
		return predictions.standardErrorByNWindowBefore(this, n);
	};

	this.standardErrorByNWindowAfter = function(n) {
		return predictions.standardErrorByNWindowAfter(this, n);
	};

	this.predictionByNWindowBefore = function(n, position) {
		return predictions.predictionByNWindowBefore(this, n, position);
	};
	this.predictionByNWindowAfter = function(n, position) {
		return predictions.predictionByNWindowAfter(this, n, position);
	}
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
		var report = new database.WindowReport();
		var prediction = this.predictionByNWindowBefore(10).percentBeforeOpen();
		report.predictionBefore = prediction.percentBeforeOpen();
		report.predictionAfter = prediction.percentAfterOpen();
		dto.windowReports = []
		dto.save(function(err) {
			if (err) {
				console.log(err);
				callback('Error: ' + dto.name + ' --> ' + err);
			} else {
				console.log('Save Success:' + dto.name);
				callback();
			}
		});
	}		 
};

Title.prototype.fromDto = function(dto) {
	return new Title(dto.name, dto.history);
};

var create = function(filename, name) {
	var json = csv.toObject(filename).output;
	return new Title(name, json);
};

module.exports = create;
