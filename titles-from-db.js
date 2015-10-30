/**
 * Created by marcelo on 30/10/15.
 */
var db = require('./database.js');
var Title = db.Title;

var name = process.argv[2];
var query = name ? {name: name} : {};
Title.find(query, function(err, titles) {
   if (err) {
       console.log(err);
       return;
   }
   titles.forEach(function(title) {
       console.log('Report ' + title.name + ': ' + JSON.stringify(title.windowReports));
       console.log('---------------------------------------------');
   });
    process.exit();
});