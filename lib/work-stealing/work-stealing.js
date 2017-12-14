const cluster = require('cluster')
const numberOfWorkers = require('os').cpus().length

if(cluster.isMaster){
	const workTable = Array(numberOfWorkers).map(n=>(new Array()))
	
	const workFor = ()=>{
		for(let n = 0; n <= workTable.length;  n++){
			console.log()
		}
	}

	/*Fire up workers*/
	for(let i = 0; i <= numberOfWorkers;  i++){
		const worker = cluster.fork({
			workerId: i
		})

		worker.on('message', (message)=>{
			const {workerId, event} = message
			console.log(workerId, event)
			worker.send({
				workerId,event
			})
		})
	}
}
if(cluster.isWorker){
	process.send({
		'workerId': process.env.workerId,
		'event': 'steal'
	})

	process.on('message',(message)=>{
		console.log(message, process.env.workerId)
	})
}