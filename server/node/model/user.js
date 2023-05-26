const {DateTime} = require('luxon')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
	firstName: {type: String},
	lastName: {type: String},
	email: {type: String, unique: true},
	password: {type: String, required: true},
	created_on: {type: Date, default: Date.now()},
	is_super_user: {type: Boolean, default: false},
	is_admin: {type: Boolean, default: false},
})

module.exports = mongoose.model('User', userSchema)