const express = require('express')

const routes = require('./routes/api')
const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()

/*
	Middleware
*/

/*
	Routes
*/

app.listen(config.port, ()=>{
	logger.error("This is red")
	logger.info("This is blue")
	logger.log("This is yellow")
})