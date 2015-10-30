/**
 * Created by marcelo on 30/10/15.
 */
var db = require('./database.js');
var Title = db.Title;

Title.find(function(err, titles) {
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