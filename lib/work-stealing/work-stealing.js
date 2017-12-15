const cluster = require('cluster')
const numberOfWorkers = require('os').cpus().length

const WORKER_EVENT_INIT = 0 
const WORKER_EVENT_GET_WORK = 1 // Worker finished all work ready to be sent work from another worker

if(cluster.isMaster){
	const JobQueues = []

	/* Creating worker job queues*/
	for (var i = 0; i < numberOfWorkers; i++) {
		JobQueues.push([1,2,3])
	}

	const getJob = (id, queue)=>{
		const job = JobQueues[id].pop()

		// job doesn't exist, handle steal //
		if(typeof job === 'undefined' && job == null){
			console.log('steal now')
			return 
		}
		console.log(job)
		return job
	}

	const handleWorkerMessage = (message)=>{
		console.log('received message')
		const {event, workerId} = message
		switch(event){
			case WORKER_EVENT_INIT:
				console.log(`Master: received init event from worker: ${workerId}`)
			break
			case WORKER_EVENT_GET_WORK:
				getJob(workerId, JobQueues)
			break
			case WORKER_EVENT_STEAL:
			break
			default:
				console.log('Master: received unknown event')
		}
	}

	/*Fire up workers*/
	for(let i = 0; i < 1;  i++){
		const worker = cluster.fork({
			workerId: i
		})

		worker.on('message', handleWorkerMessage)
	}	
}

if(cluster.isWorker){

	process.send({
		event: WORKER_EVENT_INIT
	})
	for (var i = 0; i < 5; i++) {
		process.send({
			event: WORKER_EVENT_GET_WORK,
			workerId: process.env.workerId 
		})
	}
}

