const express = require('express')
const cors = require('cors')
const port = 3001
const app = express()
const auth = require('./routes/auth-route')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: '../../.env'})

// Connect to MongoDB
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO)
		console.log("Connected to MongoDB")
	} catch (err) {
		throw err
	}
}

app.use(cors())
app.use(express.json())

// Connect to model
app.use('/auth', auth)

// Generic landing page
app.get('/', (req, res) => res.status(200).send('Welcome'))


app.listen(port, () => {
	connect()
	console.log(`Listening on port ${port}`)
})
