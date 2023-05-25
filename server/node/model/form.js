const mongoose = require('mongoose')

const Schema = mongoose.Schema

const formSchema = new Schema({
	fieldTitle: {type: String},
	fieldDisplay: {type: String},
	required: {type: Boolean},
	type: {type: String},
	type2: {type: String},
	active: {type: Boolean},
	lastModified: {type: Date},
	formPages: {type: String},
	order: {type: Number}
})

module.exports = mongoose.model('formfields', formSchema)