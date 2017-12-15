const WORKER_EVENT_INIT = 0 
const WORKER_EVENT_GET_WORK = 1 

module.exports=(function(handler){
	const id = process.env.workerId 

	// Message master on initialisation //
	process.send({
		event: WORKER_EVENT_INIT,
		workerId: id
	})


	// Getting jobs from master //
	for (var i = 0; i < 5; i++) {
		process.send({
			event: WORKER_EVENT_GET_WORK,
			workerId: id
		})
	}

	process.on('message', handler)
})