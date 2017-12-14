const cluster = require('cluster')
const numberOfWorkers = require('os').cpus().length

// Worker initiated ready to be sent work 
const WORKER_EVENT_INIT = 0

// Worker finished all work ready to be sent work from another worker
const WORKER_EVENT_STEAL = 1

// Worker finished all work ready to be sent work from another worker
const WORKER_EVENT_ADD_WORK = 2

if(cluster.isMaster){
	const workTable = [...Array(numberOfWorkers).keys()].reduce((table, key)=>{
		table[key] = []
		return table
	},{})
	console.log(workTable)
	const workFor = ()=>{
		for(let n = 0; n < workTable.length;  n++){
			console.log()
		}
	}

	/*Fire up workers*/
	for(let i = 0; i < numberOfWorkers;  i++){
		const worker = cluster.fork({
			workerId: i
		})

		worker.on('message', (message)=>{
			const {workerId, event} = message
			switch (event) {
				case WORKER_EVENT_INIT:
				break
				case WORKER_EVENT_STEAL:
				break
				case WORKER_EVENT_ADD_WORK:
				console.log(`Work from ${workerId}`)
				const {work} = message
				workTable[workerId].push(work)
				console.log(workTable[workerId].length)
				break
			}
		})
	}
}
if(cluster.isWorker){

	let n = Math.floor(Math.random()*10)

	while(n > 0){
		process.send({
			'workerId': process.env.workerId,
			'event': WORKER_EVENT_ADD_WORK,
			'work': {
				'something': 'something else'
			}
		})
		n--
	}

	process.on('message',(message)=>{
		console.log(message, process.env.workerId)
	})
}

