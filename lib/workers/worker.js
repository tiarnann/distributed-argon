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
	const getJob = ()=>{
		process.send({
			event: WORKER_EVENT_GET_WORK,
			workerId: id
		})
	}

	// Kick off work process
	getJob()
	process.on('message', (message)=>{
		console.info(`Worker ${id}: Received work`)
		handler(getJob, process, message)
	})
})