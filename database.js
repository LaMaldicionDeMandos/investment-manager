var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/investment');
console.log('Connecting to mongodb');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var TitleSchema = new Schema({_id: ObjectId, name: String, history:[{date: String, opening: Number, max: Number, min:Number, closing:Number, amount:String,
	jump: Number}],
	windowReports:[{size:Number, report:{predictionBefore: {after: Number, before: Number, errorList: [Number], positiveError: Number,
		negativeError: Number, index: Number}, predictionAfter: {after: Number, before: Number, errorList: [Number], positiveError: Number,
		negativeError: Number, index: Number}}}]});

var Title = mongoose.model('Title', TitleSchema);

function DBSchema() {
	this.ObjectId = mongoose.Types.ObjectId;
	this.Title = Title;
	this.clean = function(callback) { Title.remove({}, callback) }
}

var schema = new DBSchema();

process.on('exit', function() {
	console.log('Desconnecting db');
	mongoose.disconnect();
});

module.exports = schema;