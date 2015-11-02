/**
 * Created by marcelo on 30/10/15.
 */
var db = require('./database.js');
var Title = db.Title;

var name = process.argv[2];
var query = name ? {name: name} : {};
Title.find(query).select('name windowReports').exec(function(err, titles) {
   if (err) {
       console.log(err);
       return;
   }
   titles.forEach(function(title) {
       console.log('Report ' + title.name + '--> Antes: ' + title.windowReports[0].report.predictionBefore.before + " -- Despues: "
       + title.windowReports[0].report.predictionBefore.after + " -- Maximo Antes: " +
           (title.windowReports[0].report.predictionBefore.before + title.windowReports[0].report.predictionBefore.positiveError) + ' -- Maximo Despues: ' +
           (title.windowReports[0].report.predictionBefore.after + title.windowReports[0].report.predictionBefore.positiveError) + " -- Minimo Antes: " +
           (title.windowReports[0].report.predictionBefore.before - title.windowReports[0].report.predictionBefore.negativeError) + ' -- Minimo Despues: ' +
           (title.windowReports[0].report.predictionBefore.after - title.windowReports[0].report.predictionBefore.negativeError));
       console.log('---------------------------------------------');
   });
});