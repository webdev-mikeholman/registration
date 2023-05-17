const router = require('express').Router();
const User = require('../model/user')
const bcrypt = require('bcryptjs')

// Register new user
router.post('/register', async (req, res) => {
	const data = req.body

	const hashedPassword = await bcrypt.hash(data.password, 10)

	const user = new User({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		password: hashedPassword
	})

	user.save()
		.then(() => {
			res.json({success: true, message: 'Account successfully registered'})
		})
		.catch(err => {
			console.log(err.message)
			res.json({success: false, message: 'Oops! Something went wrong'})
		})
})

// Verify existing user
router.post('/login', (req, res) => {
	const data = req.body

	const passwordsMatch = bcrypt.compareSync(data.password, hash);
})

module.exports = router