var mongoose = require('mongoose')
var Schema = mongoose.Schema

var neatSchema = new Schema({
  date_time: { type: Date, required: true },
  pic: { type: String, required: true },  
  neat_data: {type: Schema.Types.ObjectId, ref: 'neatData', required: true},
})

var neatData = new Schema({
  floor: {type: Schema.Types.ObjectId, ref: 'floor', required: true},
  checklist: [{type: Schema.Types.ObjectId, ref: 'checklistData', required: true}],
})

var areaData = new Schema({
  area_name: {type: String, required: true},
  checklist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'checklistData',
      required: true,
    },
  ],
})

var checklistData = new Schema({
  // task_name: {type: String, required: true},
  // checked: { type: Boolean, required: true },
  proof_pict: { type: String },
})

var floorSchema = new Schema({
  floor: { type: Number, required: true },
})

var areaSchema = new Schema({
  area_name: { type: String, required: true },
  floor: {type: Schema.Types.ObjectId, ref: 'floor', required: true},
})

var checklistItemSchema = new Schema({
  task_name: { type: String, required: true },
  area: {type: Schema.Types.ObjectId, ref: 'area', required: true},
})

mongoose.model('neatData', neatData)
mongoose.model('areaData', areaData)
mongoose.model('checklistData', checklistData)
mongoose.model('floor', floorSchema)
mongoose.model('area', areaSchema)
mongoose.model('checklistItem', checklistItemSchema)
module.exports = mongoose.model('neat', neatSchema)
