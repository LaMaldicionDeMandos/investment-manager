var database = require('./database.js');
var csv = require("csvjson");
function Title(name, array) {
	this.name = name;
	array.forEach(function(item) {
	   		item.opening = parseFloat(item.opening);
   			item.closing = parseFloat(item.closing);
   			item.percent = function() {
				return 100*(item.closing - item.opening)/item.opening;
			};
	});
	this.history = array;
	this.standardErrorByNMatches = function(n) {
		for (var i = this.history.length; i > 0; i++) {

		}
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
						diff+= Math.abs(lasts[j].percent() - jsonArray[i + j].percent());
					}
					difs.push(diff);
				} else {
					difs.push(NaN);
				}
		   	}
		   	var min = 10000000;
		   	var index = 0;
		   	for (var i = 0; i < difs.length; i++) {
		   		if (!isNaN(difs[i]) && difs[i] < min) {
		   			min = difs[i];
		   			index = i;
		   		}
		   	}
			return jsonArray[index - 1].percent();
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
