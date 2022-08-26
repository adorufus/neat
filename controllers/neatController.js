const { reject } = require('lodash')
const { default: mongoose } = require('mongoose')
var NeatModel = require('../models/neatModel.js')

var ChecklistItemModel = mongoose.model('checklistItem')
var FloorModel = mongoose.model('floor')
var AreaModel = mongoose.model('area')
var NeatDataModel = mongoose.model('neatData')
var AreaDataModel = mongoose.model('areaData')
var ChecklistDataModel = mongoose.model('checklistData')

/**
 * neatController.js
 *
 * @description :: Server-side logic for managing neats.
 */

const getItem = (files, task_name) =>
  new Promise((resolve, reject) => {
    items = []
    for (var i = 0; i < files.length; i++) {
      var checklistData = new ChecklistDataModel()
      // checklistData.task_name = task_name[i]
      checklistData.proof_pict =
        'http://localhost:8000/images/' + files[0].filename
      // checklistData.checked = true

      checklistData.save((ciErr, ciData) => {
        if (ciErr) {
          console.log(ciErr)
          reject(ciErr)
          return
        }

        console.log('ciData: ' + ciData)

        items.push(ciData._id.toHexString())
      })
    }

    setTimeout(() => resolve(items), 1000)
  })

const getChecklists = (data) =>
  new Promise((resolve, reject) => {
    checklists = []

    for (var i = 0; i < data.length; i++) {
      ChecklistItemModel.find({ area: data[i]._id }, (ciErr, ciData) => {
        if (ciErr) {
          console.log(ciErr)
          reject(ciErr)
          return
        }

        checklists.push(ciData.length)

        console.log(checklists)
      })
    }

    setTimeout(() => resolve(checklists), 1000)
  })

module.exports = {
  create_floor: async function (req, res) {
    var { floor } = req.body

    var floorModel = new FloorModel()

    floorModel.floor = floor

    floorModel.save((err, data) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'floor created',
        data: data,
      })
    })
  },

  get_all_floor: (req, res) => {
    FloorModel.find((err, data) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        data: data,
      })
    })
  },

  get_area_by_floor: (req, res) => {
    var { floor_id } = req.query
    AreaModel.find({ floor: floor_id }, async (err, data) => {
      await getChecklists(data).then((promise, reject) => {
        if (reject) {
          console.log(reject)
        } else {
          if (err) {
            return res.status(400).json({
              status: 'failure',
              error: err,
            })
          }

          return res.status(200).json({
            status: 'success',
            message: 'Floor Found',
            checklist_length: promise,
            data: data,
          })
        }
      })
    })
  },

  get_checklist_by_area: (req, res) => {
    var { area_id } = req.query
    ChecklistItemModel.find({ area: area_id }, (err, data) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'Checklists Found',
        data: data,
      })
    })
  },

  create_area: (req, res) => {
    var { area_name, floor } = req.body

    var areaModel = new AreaModel()

    areaModel.area_name = area_name
    areaModel.floor = floor

    areaModel.save((err, data) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'area created',
        data: data,
      })
    })
  },

  create_checklist_item: (req, res) => {
    var { task_name, area_id } = req.body

    var checklistItem = new ChecklistItemModel()

    checklistItem.task_name = task_name
    checklistItem.area = area_id

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
  // create: async function (req, res) {
  //   files = req.files

  //   var { pic, floor, floor_id, area_name, task_name, checked } = req.body

  //   var neatData = new NeatDataModel()
  //   var neat = new NeatModel()

  //   neatData.floor = floor

  //   await getItem(files, task_name).then((items) => {
  //     console.log(items)
  //     if (items) {
  //       var neatData = new NeatDataModel()
  //       var areaData = new AreaDataModel()

  //       areaData.area_name = area_name
  //       areaData.checklist = items

  //       areaData.save((thisErr, aData) => {
  //         if (thisErr) {
  //           console.log(thisErr)
  //           return
  //         }

  //         console.log(aData)
  //         neatData.floor = floor_id
  //         neatData.area = aData._id

  //         neatData.save((err, nData) => {
  //           var neat = new NeatModel({
  //             date_time: Date.now(),
  //             pic: pic,
  //             neat_data: nData._id,
  //           })

  //           neat.save(function (err, neat) {
  //             if (err) {
  //               return res.status(500).json({
  //                 message: 'Error when creating neat',
  //                 error: err,
  //               })
  //             }

  //             neat.populate(
  //               {
  //                 path: 'neat_data',
  //                 populate: [
  //                   {
  //                     path: 'area',
  //                     populate: {
  //                       path: 'checklist',
  //                     },
  //                   },
  //                   {
  //                     path: 'floor',
  //                   },
  //                 ],
  //               },
  //               (err) => {
  //                 return res.status(200).json({
  //                   status: 'succes',
  //                   message: 'Task Completed',
  //                   data: neat,
  //                 })
  //               },
  //             )

  //             // neat.populate('checklist', (err) => {
  //             //   neat.checklist.populate(
  //             //     ['area_1', 'area_2', 'area_3'],
  //             //     (error) => {

  //             //     },
  //             //   )
  //             // })
  //           })
  //         })
  //       })
  //     } else {
  //       return res.status(400).json({
  //         status: 'failure',
  //         message: 'Tolong selesaikan semua area ya!',
  //       })
  //     }
  //   })
  // },
  create: async function (req, res) {
    files = req.files

    var { pic, floor, floor_id, checked } = req.body

    var neatData = new NeatDataModel()
    var neat = new NeatModel()

    neatData.floor = floor

    await getItem(files).then((items) => {
      console.log(items)
      if (items) {
        var neatData = new NeatDataModel()

        neatData.floor = floor_id
        neatData.checklist = items

        neatData.save((err, nData) => {
          var neat = new NeatModel({
            date_time: Date.now(),
            pic: pic,
            neat_data: nData._id,
          })

          neat.save(function (err, neat) {
            if (err) {
              return res.status(500).json({
                message: 'Error when creating neat',
                error: err,
              })
            }

            neat.populate(
              {
                path: 'neat_data',
                populate: [
                  {
                    path: 'checklist',
                  },
                  {
                    path: 'floor',
                  },
                ],
              },
              (err) => {
                return res.status(200).json({
                  status: 'succes',
                  message: 'Task Completed',
                  data: neat,
                })
              },
            )

            // neat.populate('checklist', (err) => {
            //   neat.checklist.populate(
            //     ['area_1', 'area_2', 'area_3'],
            //     (error) => {

            //     },
            //   )
            // })
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
