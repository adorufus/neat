const jwt = require('jsonwebtoken')

module.exports.verify_token = function (req, res, next) {
  var token

  if ('authorization' in req.headers) {
    token = req.headers['authorization'].split(' ')[1]
  }

  if (!token) {
    return res.status(403).json({
      status: 'unauthorized',
      message: 'Kamu dilarang masuk, soalnya ga punya akses!',
    })
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({
            status: 'error',
            message: 'failed to authenticate',
            error: err,
          })
      else {
        req._id = result._id
        next()
      }
    })
  }
}
