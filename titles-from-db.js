/**
 * Created by marcelo on 30/10/15.
 */
var db = require('./database.js');
var Title = db.Title;

var name = process.argv[2];
var query = name ? {name: name} : {};
Title.find(query).select('_id name windowReports history').exec(function(err, titles) {
   if (err) {
       console.log(err);
       return;
   }
   titles.forEach(function(title) {
       console.log('Report ' + title.name + ': ' + JSON.stringify(title.windowReports));
       Title.findOne(title).select('history').exec(function(err, history) {
           console.log('History: ' + history.history);
       });
       console.log('---------------------------------------------');
   });
});