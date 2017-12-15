const cluster = require('cluster')
const worker = require('../workers/worker')

module.exports=(function(cluster, worker, numberOfWorkers, jobs, workHandler){
	const WORKER_EVENT_INIT = 0 
	const WORKER_EVENT_GET_WORK = 1

	if(cluster.isMaster){
		const JobQueues = []

		/* Creating worker job queues*/
		for (var i = 0; i < numberOfWorkers; i++) {
			JobQueues.push([1,2,3])
		}

		const getJob = (id, queue)=>{
			// Pop job from workers queue //
			const job = JobQueues[id].pop()
			return job
		}	

		const handleWorkerMessage = (worker, message)=>{
			const {event, workerId} = message

			switch(event){
				case WORKER_EVENT_INIT:
					console.log(`Master: received init event from worker: ${workerId}`)
				break
				case WORKER_EVENT_GET_WORK:
					console.log(`Master: received get work event from worker: ${workerId}`)
					
					const job = getJob(workerId, JobQueues)

					if(typeof job === 'undefined' || job == null){
						if(worker.isConnected()){
							worker.kill()

							const numberOfActiveWorkers = Object.keys(cluster.workers)
							if(numberOfActiveWorkers === 0){
								process.exit()
							}
						}
					} else {
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
		worker(workHandler)
	}
}).bind(null, cluster, worker)