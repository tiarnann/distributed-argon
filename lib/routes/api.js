const router = require('express').Router()
const sanitize = require('sanitize')()

router.get('/',(req,res)=>{
	res.send('If you see this, the servers working. Woo')
})

module.exports = router