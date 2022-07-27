var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : {type: String, required: true, unique: true},
	'password' : {type: String, required: true},
	'role' : {type: String, required: true},
	'assigned_floor' : Number,
	'full_name': {type: String, required: true},
	'salt': String
});

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({
        _id: this._id,
        role: this.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP,
    })
}

module.exports = mongoose.model('user', userSchema);
