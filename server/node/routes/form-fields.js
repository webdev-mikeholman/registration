const router = require('express').Router();
const formFields = require('../model/form')


// Get form fields
router.get('/fields', async (req, res) => {
	try {
		const response = await formFields.find().sort('order')
		res.status(200).send(response)
	} catch (err) {
		console.log(err)
	}

})


module.exports = router