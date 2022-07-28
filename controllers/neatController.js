const { default: mongoose } = require('mongoose')
var NeatModel = require('../models/neatModel.js')

var ChecklistItemModel = mongoose.model('checklistItem')
var ChecklistModel = mongoose.model('checklist')

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
            status: "success",
            message: "Data found",
            data: neats
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

    var checklist = new ChecklistModel()

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
