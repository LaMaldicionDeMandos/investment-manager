var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/investment');
console.log('Connecting to mongodb');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
 
var PersonSchema = new Schema({_id: ObjectId, name: String, age: Number});

var Person = mongoose.model('Person', PersonSchema);

var person = new Person();
person._id =  mongoose.Types.ObjectId();
person.name = 'Aída';
person.age = 40;
person.save(function(err) {
	console.log(err);
});


