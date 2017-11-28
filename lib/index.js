const express = require('express')

const routes = require('./routes/api')
const config = require('./utils/config')
const logger = new (require('./utils/logger'))()

const app = express()

/*
	Middleware
*/

/*
	Routes
*/
app.use(routes)

app.listen(config.port, (...args)=>{
	logger.log(`Server listening on port ${config.port}`)
})