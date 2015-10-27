/**
 * Created by marcelo on 27/10/15.
 */
var db = require('./database.js');
db.clean(function(err) {
    console.log('collection removed, errors: ' + err);
    process.exit();
});