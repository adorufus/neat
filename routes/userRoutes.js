var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var middlewares = require('../api/middlewares/index')

/*
 * GET
 */
router.get('/users', middlewares.jwt_verifier.verify_token, userController.list);

/*
 * GET
 */
router.get('/user', middlewares.jwt_verifier.verify_token, userController.show);

/*
 * POST
 */
router.post('/auth/register', userController.create);

/*
 * POST
 */
router.post('/auth/login', userController.login);

/*
 * PUT
 */
router.put('/user/edit', middlewares.jwt_verifier.verify_token, userController.update);

/*
 * DELETE
 */
router.delete('/user/remove', middlewares.jwt_verifier.verify_token, userController.remove);

module.exports = router;
