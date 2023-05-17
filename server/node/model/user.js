const {DateTime} = require('luxon')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
	firstName: {type: String},
	lastName: {type: String},
	email: {type: String, unique: true},
	password: {type: String, required: true},
	created_on: {type: Number, default: Date.now().valueOf()},
})

module.exports = mongoose.model('User', userSchema)