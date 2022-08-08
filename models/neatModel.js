var mongoose = require('mongoose')
var Schema = mongoose.Schema

var neatSchema = new Schema({
  date_time: { type: Date, required: true },
  pic: { type: String, required: true },
  floor: { type: Schema.Types.ObjectId, ref: 'floor', required: true },
})

var floorSchema = new Schema({
  floor: { type: Number, required: true },
  area: [
    {
      type: Schema.Types.ObjectId,
      ref: 'area',
      required: true,
    },
  ],
})

var areaSchema = new Schema({
  area_name: { type: String, required: true },
  checklist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'checklistItem',
      required: true,
    },
  ],
})

var checklistItemSchema = new Schema({
  task_name: { type: String, required: true },
  checked: { type: Boolean, required: true },
  proof_pict: { type: String },
})

mongoose.model('floor', floorSchema)
mongoose.model('area', areaSchema)
mongoose.model('checklistItem', checklistItemSchema)
module.exports = mongoose.model('neat', neatSchema)
