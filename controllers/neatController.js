var NeatModel = require('../models/neatModel.js');

/**
 * neatController.js
 *
 * @description :: Server-side logic for managing neats.
 */
module.exports = {

    /**
     * neatController.list()
     */
    list: function (req, res) {
        NeatModel.find(function (err, neats) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting neat.',
                    error: err
                });
            }

            return res.json(neats);
        });
    },

    /**
     * neatController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        NeatModel.findOne({_id: id}, function (err, neat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting neat.',
                    error: err
                });
            }

            if (!neat) {
                return res.status(404).json({
                    message: 'No such neat'
                });
            }

            return res.json(neat);
        });
    },

    /**
     * neatController.create()
     */
    create: function (req, res) {
        var neat = new NeatModel({
			date_time : req.body.date_time,
			pic : req.body.pic,
			floor : req.body.floor,
			proof_pict : req.body.proof_pict,
			checklist : req.body.checklist
        });

        neat.save(function (err, neat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating neat',
                    error: err
                });
            }

            return res.status(201).json(neat);
        });
    },

    /**
     * neatController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        NeatModel.findOne({_id: id}, function (err, neat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting neat',
                    error: err
                });
            }

            if (!neat) {
                return res.status(404).json({
                    message: 'No such neat'
                });
            }

            neat.date_time = req.body.date_time ? req.body.date_time : neat.date_time;
			neat.pic = req.body.pic ? req.body.pic : neat.pic;
			neat.floor = req.body.floor ? req.body.floor : neat.floor;
			neat.proof_pict = req.body.proof_pict ? req.body.proof_pict : neat.proof_pict;
			neat.checklist = req.body.checklist ? req.body.checklist : neat.checklist;
			
            neat.save(function (err, neat) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating neat.',
                        error: err
                    });
                }

                return res.json(neat);
            });
        });
    },

    /**
     * neatController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        NeatModel.findByIdAndRemove(id, function (err, neat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the neat.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
