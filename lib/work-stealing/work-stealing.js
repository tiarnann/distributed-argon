const cluster = require('cluster')
const worker = require('../workers/worker')
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
			console.log(`Stealing job for worker: ${id}`)
			return 
		}
		return job
	}	

	const killWorkers = ()=>{
		for(const id in cluster.workers){
			cluster.workers[id].kill()
		}
	}

	let workCount = numberOfWorkers * 3
	const handleWorkerMessage = (worker, message)=>{
		console.log('received message')
		const {event, workerId} = message
		switch(event){
			case WORKER_EVENT_INIT:
				console.log(`Master: received init event from worker: ${workerId}`)
			break
			case WORKER_EVENT_GET_WORK:
				console.log(`Master: received get work event from worker: ${workerId}`)
				if(workCount === 0){
					killWorkers()
				}else {
					workCount--
					const job = getJob(workerId, JobQueues)
					worker.send({job})
				}
			break
			default:
				console.log('Master: received unknown event')
		}
	}

	/*Fire up workers*/
	for(let i = 0; i < numberOfWorkers;  i++){
		const worker = cluster.fork({
			workerId: i
		})

		worker.on('message', handleWorkerMessage.bind(null, worker))
	}	
}

if(cluster.isWorker){
	worker(()=>{
		console.log('handling work')
	})
}