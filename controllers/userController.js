var UserModel = require('../models/userModel.js')
const bcrypt = require('bcryptjs')
var mongoose = require('mongoose')
var passport = require('passport')
var lodash = require('lodash')

var User = mongoose.model('user')

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
  /**
   * userController.list()
   */
  list: function (req, res) {
    UserModel.find(function (err, users) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'All user data found',
        data: lodash
          .chain(users)
          .map((user) =>
            lodash.pick(user, ['_id', 'full_name', 'assigned_floor', 'username', 'role']),
          ),
      })
    })
  },

  /**
   * userController.show()
   */
  show: function (req, res) {
    var id = req.query.id

    UserModel.findOne({ _id: id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user.',
          error: err,
        })
      }

      if (!user) {
        return res.status(404).json({
          message: 'No such user',
        })
      }

      return res.json({
        status: "success",
        message: "User found",
        data: lodash.pick(user, ['_id', 'full_name', 'assigned_floor', 'username', 'role'])
      })
    })
  },

  /**
   * userController.create()
   */
  create: async function (req, res) {
    var { full_name, username, password, role } = req.body

    var user = new User()

    if (username && password && full_name && role) {
      if (password.length < 6) {
        res.status(400).json({
          status: error,
          message: 'Password at least 6 characters long',
        })
      } else {
        var salt = await bcrypt.genSalt(10)

        user.username = username
        user.password = await bcrypt.hash(password, salt)
        user.salt = salt
        user.full_name = full_name
        user.role = role

        user.save((err, doc) => {
          if (err) {
            if (err.code == 11000) {
              res.status(400).json({
                status: 'error',
                message: 'Username Already Registered',
                error: err,
              })
            } else {
              return next(err)
            }
          } else {
            res.status(201).json({
              status: 'success',
              message: 'user created!',
              data: {
                _id: doc['_id'],
                username: username,
                email: email,
                role: role,
                full_name: full_name,
              },
            })
          }
        })
      }
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Username, email, role or password are required!',
      })
    }
  },

  login: function (req, res) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(400).json(err)
      else if (user)
        return res.status(200).json({
          status: 'success',
          message: 'user authenticated',
          token: user.generateJwt(),
        })
      else return res.status(404).json(info)
    })(req, res)
  },

  /**
   * userController.update()
   */
  update: function (req, res) {
    var id = req.query.id

    UserModel.findOne({ _id: id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting user',
          error: err,
        })
      }

      if (!user) {
        return res.status(404).json({
          message: 'No such user',
        })
      }

      user.username = req.body.username ? req.body.username : user.username
      user.password = req.body.password ? req.body.password : user.password
      user.role = req.body.role ? req.body.role : user.role
      user.assigned_floor = req.body.assigned_floor
        ? req.body.assigned_floor
        : user.assigned_floor

      user.save(function (err, user) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating user.',
            error: err,
          })
        }

        return res.json({
          status: 'success',
          message: 'User updated',
          data: user,
        })
      })
    })
  },

  /**
   * userController.remove()
   */
  remove: function (req, res) {
    var id = req.query.id

    UserModel.findByIdAndRemove(id, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the user.',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'User removed',
      })
    })
  },
}
