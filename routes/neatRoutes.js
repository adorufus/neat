var express = require('express');
var router = express.Router();
var neatController = require('../controllers/neatController.js');
var middlewares = require('../api/middlewares/index')

/*
 * GET
 */
router.get('/neat/data/all', neatController.list);

/*
 * GET
 */
router.get('/neat/data', neatController.show);
router.get('/neat/floor/all', neatController.get_all_floor);

/*
 * POST
 */
router.post('/neat/data/create', [middlewares.jwt_verifier.verify_token, middlewares.fileUpload.array("images", 3)], neatController.create);
router.post('/neat/floor/create', [middlewares.jwt_verifier.verify_token], neatController.create_floor);
router.post('/neat/area/create', [middlewares.jwt_verifier.verify_token], neatController.create_area);
router.post('/neat/checklist/create', [middlewares.jwt_verifier.verify_token, middlewares.fileUpload.single("proof_image")], neatController.create_checklist_item);

/*
 * PUT
 */
router.put('/neat/data/update', [middlewares.jwt_verifier.verify_token, middlewares.fileUpload.array("images", 3)], neatController.update);

/*
 * DELETE
 */
router.delete('/neat/data/remove', [middlewares.jwt_verifier.verify_token], neatController.remove);

module.exports = router;
