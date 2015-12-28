/**
 * Created by boot on 12/27/15.
 */
var database = require('./database.js');
var fetcher = require('./end_transformer.js');
var path = process.argv[2];
var filename = process.argv[3];
var newfilename = process.argv[4];
var async = require('async');

Date.prototype.format = function() {
   return this.getFullYear() + '-' +
       ((this.getMonth() < 9) ? '0' + (this.getMonth() + 1) : (this.getMonth() + 1)) +
       '-' + ((this.getDate() < 10) ? '0' + this.getDate() : this.getDate());
};

console.log('Upgrade schema with Ends');
var Schema = database.Schema;
var TitleEndsSchema = new Schema({_id: Schema.ObjectId, name: String, ends: [{date: String, ends:
    [{buyAmount: Number, buyPrice: Number, saleAmount: Number, salePrice: Number}]}]}, {strict: false});
var TitleEnds = database.mongoose.model('TitleEnds', TitleEndsSchema);
database.TitleEnds = TitleEnds;

var functions = [];

fetcher(path, filename, newfilename).then(function(ends) {
   ends.forEach(function(end) {
      console.log('Fetching end, ' + end.name);
      functions.push(function(callback) {
         console.log('finding end in database, ' + end.name);
         TitleEnds.findOne({'name': end.name}, function(err, title) {
            console.log('found: ' + end.name + ' ' + JSON.stringify(title));
            var dto = {date: new Date().format(), ends: end.ends};
            if (title == null) {
               console.log('not found end, ' + end.name);
               title = new TitleEnds();
               title._id = database.ObjectId();
               title.name = end.name;
               title.ends = [dto];
            } else {
               title.ends.push(dto);
            }
            console.log('Saving end, ' + end.name);
            title.save(function(err) {
               if (!err) {
                  console.log('end ' + end.name + ' saved');
                  callback(null, title);
               } else {
                  console.log('Error saving end, ' + end.name);
                  callback(err, title);
               }
            });
         });
      });
   });
   async.series(functions, function(err, results) {
      console.log("End");
      process.exit();
   });
});