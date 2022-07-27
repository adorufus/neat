var express = require('express');
var router = express.Router();
var neatController = require('../controllers/neatController.js');

/*
 * GET
 */
router.get('/', neatController.list);

/*
 * GET
 */
router.get('/:id', neatController.show);

/*
 * POST
 */
router.post('/', neatController.create);

/*
 * PUT
 */
router.put('/:id', neatController.update);

/*
 * DELETE
 */
router.delete('/:id', neatController.remove);

module.exports = router;
