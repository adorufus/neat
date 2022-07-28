var middlewares = {
    jwt_verifier: require('./jwt-verifier'),
    passport: require('./passport'),
    fileUpload: require('./fileUpload')
}

module.exports = middlewares