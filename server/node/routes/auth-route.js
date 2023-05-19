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
router.post('/login', async (req, res) => {
	let validUser = false;
	const data = req.body

	try {
		const response = await User.findOne({email: data.email})
		const passwordsMatch = bcrypt.compareSync(data.password, response.password);
		if (passwordsMatch) {
			res.json({success: true, message: 'Successfully Logged in'})
		}
		else {
			res.json({success: false, message: 'Logged in failed'})
		}
	}
	catch (err) {
		res.status(401).send('Authentication failed')
	}
})

module.exports = router