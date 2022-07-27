var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var neatSchema = new Schema({
	'date_time' : Date,
	'pic' : String,
	'floor' : String,
	'proof_pict' : Array,
	'checklist' : String
});



module.exports = mongoose.model('neat', neatSchema);
