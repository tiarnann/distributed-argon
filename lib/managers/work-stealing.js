module.exports=(function(cluster, worker, numberOfWorkers, jobs){
	const WORKER_EVENT_INIT = 0 
	const WORKER_EVENT_GET_WORK = 1

	if(cluster.isMaster){
		const JobQueues = []

		/* Creating worker job queues*/
		let workCount = jobs.length
		const jobsPerWorker = jobs.length / numberOfWorkers
		for (var i = 0; i < numberOfWorkers &&  jobs.length > 0; i++) {
			const workerJobs = jobs.splice(0, jobsPerWorker)
			JobQueues.push(workerJobs)
		}

		const getJob = (id, queue)=>{
			// Pop job from workers queue //
			const job = JobQueues[id].pop()

			// If job doesn't exist, steal job from another queue //
			if(typeof job === 'undefined' && job == null){
				const randomId = Math.floor(numberOfWorkers*Math.random())
				
				console.info(`Stealing job for worker: ${id} from worker ${randomId}`)

				return JobQueues[randomId].pop()
			}
			return job
		}	

		const killWorkers = ()=>{
			console.info('Master: killing workers')
			for(const id in cluster.workers){
				cluster.workers[id].kill()
			}
		}

		
		console.info(jobs.length)
		const handleWorkerMessage = (worker, message)=>{
			const {event, workerId} = message

			switch(event){
				case WORKER_EVENT_INIT:
					console.info(`Master: received init event from worker: ${workerId}`)
				break
				case WORKER_EVENT_GET_WORK:
					console.info(`Master: received get work event from worker: ${workerId}`)
					if(workCount === 0){
						killWorkers()
					}else {
						workCount--
						const job = getJob(workerId, JobQueues)
						worker.send({job})
					}
				break
				default:
					console.info('Master: received unknown event')
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
})