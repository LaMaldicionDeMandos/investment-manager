console.log('Path file: ' + process.argv[2]);
var file = {filename: process.argv[2]};
var size = process.argv[3] || 15;
var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: ';'});

//end_parsed will be emitted once parsing finished 
converter.on("end_parsed", function (jsonArray) {
   	jsonArray.forEach(function(item) {
   		item.opening = parseFloat(item.opening.replace(',', '.', 'gi'));
   		item.close = parseFloat(item.close.replace(',', '.', 'gi'));
   		item.percent = function() {
			return 100*(item.close - item.opening)/item.opening;
		};
   	}); 
   	var lasts = jsonArray.slice(0, size);
   	jsonArray.splice(0, size);
   	var difs = [];
   	for (var i = 0; i < jsonArray.length - size;i++) {
   		var diff = 0;
   		for (var j = 0; j < size; j++) {
   			diff+= Math.abs(lasts[j].percent() - jsonArray[i + j].percent());
   		}
   		difs.push(diff);
   	}
   	var min = 10000000;
   	var index = 0;
   	for (var i = 0; i < difs.length; i++) {
   		if (difs[i] < min) {
   			min = difs[i];
   			index = i;
   		}
   	}
   	console.log('Min: ' + min);
   	console.log('Index: ' + index);
   	for(var i = 0; i < size ; i++) {
   		console.log('referencia: ' + lasts[i].percent() + '  --  obtenido: ' + jsonArray[index + i].percent());
   	}
      console.log('New Value: ' + jsonArray[index - 1].percent());
});
 
//read from file 
require("fs").createReadStream(file.filename).pipe(converter);
