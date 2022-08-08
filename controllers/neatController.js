const { default: mongoose } = require('mongoose')
var NeatModel = require('../models/neatModel.js')

var ChecklistItemModel = mongoose.model('checklistItem')
var FloorModel = mongoose.model('floor')
var AreaModel = mongoose.model('area')

/**
 * neatController.js
 *
 * @description :: Server-side logic for managing neats.
 */

const getItem = (files) =>
  new Promise((resolve) => {
    items = []
    for (var i = 0; i < files.length; i++) {
      checklistItem = new ChecklistItemModel()
      checklistItem.proof_pict =
        'http://localhost:8000/images/' + files[0].filename
      checklistItem.checked = true

      checklistItem.save(async (ciErr, ciData) => {
        if (ciErr) {
          console.log(ciErr)
          return
        }

        items.push(checklistItem)
      })
    }

    setTimeout(() => resolve(items), 1000)
  })

module.exports = {
  create_floor: async function (req, res) {
    var { floor, area_id } = req.body

    var floorModel = new FloorModel()

    floorModel.floor = floor
    for (var i = 0; i < area_id.length; i++) {
      console
      floorModel.area.push(area_id[i])
    }

    floorModel.save((err, data) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      data.populate(
        {
          path: 'area',
          populate: {
            path: 'checklist',
          },
        },
        (areaErr) => {
          if (areaErr) {
            return res.status(400).json({
              status: 'failure',
              error: areaErr,
            })
          }

          return res.status(200).json({
            status: 'success',
            message: 'floor created',
            data: data,
          })
        },
      )
    })
  },

  get_all_floor: (req, res) => {
    FloorModel.find()
      .populate({
        path: 'area',
        populate: {
          path: 'checklist',
        },
      })
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            status: 'failure',
            error: areaErr,
          })
        }

        return res.status(200).json({
          status: 'success',
          data: data,
        })
      })
  },

  create_area: (req, res) => {
    var { area_name, checklist_item } = req.body

    var areaModel = new AreaModel()

    areaModel.area_name = area_name

    for (var i = 0; i < checklist_item.length; i++) {
      areaModel.checklist.push(checklist_item[i])
    }

    areaModel.save((err, data) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      data.populate('checklist', (err) => {
        return res.status(200).json({
          status: 'success',
          message: 'area created',
          data: data,
        })
      })
    })
  },

  create_checklist_item: (req, res) => {
    var { task_name, checked } = req.body

    var file = req.file

    var checklistItem = new ChecklistItemModel()

    checklistItem.task_name = task_name
    checklistItem.checked = checked

    if (file) {
      checklistItem.proof_pict = 'http://localhost:8000/images/' + file.filename
    } else {
      checklistItem.proof_pict = ''
    }

    checklistItem.save((err, data) => {
      if (err) {
        res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'checklist created',
        data: data,
      })
    })
  },

  /**
   * neatController.list()
   */
  list: async function (req, res) {
    NeatModel.find()
      .populate({
        path: 'checklist',
        populate: [
          {
            path: 'area_1',
          },
          {
            path: 'area_2',
          },
          {
            path: 'area_3',
          },
        ],
      })
      .exec(function (err, neats) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting neat.',
            error: err,
          })
        }

        return res.json({
          status: 'success',
          message: 'Data found',
          data: neats,
        })
      })
  },

  /**
   * neatController.show()
   */
  show: function (req, res) {
    var id = req.params.id

    NeatModel.findOne({ _id: id }, function (err, neat) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting neat.',
          error: err,
        })
      }

      if (!neat) {
        return res.status(404).json({
          message: 'No such neat',
        })
      }

      return res.json(neat)
    })
  },

  /**
   * neatController.create()
   */
  create: async function (req, res) {
    files = req.files

    var checklist = new FloorModel()

    await getItem(files).then((items) => {
      if (items && items.length == 3) {
        checklist.area_1 = items[0]._id
        checklist.area_2 = items[1]._id
        checklist.area_3 = items[2]._id
        checklist.save((cErr, cData) => {
          console.log(cData)
          if (cErr) {
            return res.status(400).json({
              status: 'failure',
              message: cErr,
            })
          }

          var neat = new NeatModel({
            date_time: Date.now(),
            pic: req.body.pic,
            floor: req.body.floor,
            checklist: cData.id,
          })

          neat.save(function (err, neat) {
            if (err) {
              return res.status(500).json({
                message: 'Error when creating neat',
                error: err,
              })
            }

            neat.populate('checklist', (err) => {
              neat.checklist.populate(
                ['area_1', 'area_2', 'area_3'],
                (error) => {
                  return res.status(200).json({
                    status: 'succes',
                    message: 'Task Completed',
                    data: neat,
                  })
                },
              )
            })
          })
        })
      } else {
        return res.status(400).json({
          status: 'failure',
          message: 'Tolong selesaikan semua area ya!',
        })
      }
    })
  },

  /**
   * neatController.update()
   */
  update: function (req, res) {
    var id = req.params.id

    NeatModel.findOne({ _id: id }, function (err, neat) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting neat',
          error: err,
        })
      }

      if (!neat) {
        return res.status(404).json({
          message: 'No such neat',
        })
      }

      neat.date_time = req.body.date_time ? req.body.date_time : neat.date_time
      neat.pic = req.body.pic ? req.body.pic : neat.pic
      neat.floor = req.body.floor ? req.body.floor : neat.floor
      neat.proof_pict = req.body.proof_pict
        ? req.body.proof_pict
        : neat.proof_pict
      neat.checklist = req.body.checklist ? req.body.checklist : neat.checklist

      neat.save(function (err, neat) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating neat.',
            error: err,
          })
        }

        return res.json(neat)
      })
    })
  },

  /**
   * neatController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id

    NeatModel.findByIdAndRemove(id, function (err, neat) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the neat.',
          error: err,
        })
      }

      return res.status(204).json()
    })
  },
}
