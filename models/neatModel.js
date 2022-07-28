var mongoose = require('mongoose')
var Schema = mongoose.Schema

var neatSchema = new Schema({
  date_time: {type: Date, required: true},
  pic: {type: String, required: true},
  floor: {type: Number, required: true},
  checklist: { type: Schema.Types.ObjectId, ref: 'checklist' },
})

var checklistSchema = new Schema({
  area_1: { type: Schema.Types.ObjectId, ref: 'checklistItem', required: true },
  area_2: { type: Schema.Types.ObjectId, ref: 'checklistItem', required: true },
  area_3: { type: Schema.Types.ObjectId, ref: 'checklistItem', required: true},
})

var checklistItemSchema = new Schema({
  checked: { type: Boolean, required: true },
  proof_pict: { type: String, required: true },
})

mongoose.model('checklist', checklistSchema)
mongoose.model('checklistItem', checklistItemSchema)
module.exports = mongoose.model('neat', neatSchema)
