var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/investment');
console.log('Connecting to mongodb');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var HistorySchema = new Schema({date: String, opening: String, max: String, min:String, closing:String, amount:String});
var TitleSchema = new Schema({_id: ObjectId, name: String, history:[HistorySchema]});

var History = mongoose.model('History', HistorySchema);
var Title = mongoose.model('Title', TitleSchema);

function DBSchema() {
	this.ObjectId = mongoose.Types.ObjectId;
	this.History = History;
	this.Title = Title;
	this.clean = function(callback) { Title.remove({}, callback) }
}

var schema = new DBSchema();

process.on('exit', function() {
	mongoose.disconnect();
});

module.exports = schema;