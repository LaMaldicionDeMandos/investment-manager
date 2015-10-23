var accountFactory = require('./account.js');
console.log('Path file: ' + process.argv[2]);
var size = process.argv[3] || 15;

accountFactory(process.argv[2], 'TRAN').then(function(account) {
   console.log(JSON.stringify(account));
});


/*
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
*/