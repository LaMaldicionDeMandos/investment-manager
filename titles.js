var database = require('./database.js');
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
	this.standardErrorByNMatches = function(n) {
		var predictions = [];
		for (var i = 0; i < this.history.length - n; i++) {
			predictions.push(this.predictionByNMatches(n, i).after);
		}
		var negatives = [];
		var positives = [];

		for(var i = 1; i < predictions.length;i++) {
			var prediction = predictions[i];
			var real = this.history[i-1].percentAfterOpen();
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
	this.predictionByNMatches = function(n, position) {
			position = position || 0;
			var jsonArray = this.history.slice(0, this.history.length);
			n = (this.history.length - position > n) ? n : this.history.length - position;
			var lasts = jsonArray.slice(position, position + n);
		   	var difs = [];
		   	for (var i = 0; i < jsonArray.length - n;i++) {
				if (i + n  <= position || i >= position + n) {
					var diff = 0;
					for (var j = 0; j < n; j++) {
						diff+= Math.abs(lasts[j].percentAfterOpen() - jsonArray[i + j].percentAfterOpen());
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
			return {after: jsonArray[index - 1].percentAfterOpen(), before: jsonArray[index - 1].percentBeforeOpen()};
		};
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
