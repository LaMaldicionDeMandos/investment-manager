var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/investment');
console.log('Connecting to mongodb');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var PredictionSchema = new Schema({after: Number, before: Number, errorList: [Number], positiveError: Number,
	negativeError: Number, index: Number});
var WindowReportSchema = new Schema({predictionBefore: PredictionSchema, predictionAfter: PredictionSchema});
var HistorySchema = new Schema({date: String, opening: Number, max: Number, min:Number, closing:Number, amount:String,
	jump: Number});
var TitleSchema = new Schema({_id: ObjectId, name: String, history:[HistorySchema],
	windowReports:[{size:Number, report:WindowReportSchema}]});

var Prediction = mongoose.model('Prediction', PredictionSchema);
var WindowReport = mongoose.model('WindowReport', WindowReportSchema);
var History = mongoose.model('History', HistorySchema);
var Title = mongoose.model('Title', TitleSchema);

function DBSchema() {
	this.ObjectId = mongoose.Types.ObjectId;
	this.Prediction = Prediction;
	this.WindowReport = WindowReport;
	this.History = History;
	this.Title = Title;
	this.clean = function(callback) { Title.remove({}, callback) }
}

var schema = new DBSchema();

process.on('exit', function() {
	console.log('Desconnecting db');
	mongoose.disconnect();
});

module.exports = schema;