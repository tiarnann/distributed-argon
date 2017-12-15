/* Node Modules */
process.setMaxListeners(0);
const cluster = require('cluster');
const numCPUs = process.env.workers || require('os').cpus().length;

/* Project Modules */
const worker = require('./workers/worker')
const logger = new (require('./utils/logger'))()
const config = require('./utils/config')

const {project, masterDir, tempDir} = config
const io = new (require('./interfaces/fileio'))(tempDir)
const git = new (require('./interfaces/git'))(tempDir)
const argon = new (require('./interfaces/argon'))(tempDir)

if(process.env.silent) console.info = ()=>{}

if(cluster.isMaster){
	let start;
	if(typeof project === 'undefined'){
		logger.error('No project parameter found, exiting process...')
		process.exit(0)
	}

	let manager;
	if(process.env.WorkStealing){
		manager = require('./managers/work-stealing')
	} else {
		manager = require('./managers/master-slave')
	}

	git.clone(project, masterDir)
	.then(()=>{ 
		return git.commits(masterDir)
	})
	.then(commits=>{
		start = new Date()
		manager(cluster, worker, numCPUs, commits)
	})
	.catch(error=>{
		console.error(error)
	})

	// Print timing info //
	process.on('exit',()=>{
		const end = new Date()
		const timeTaken = (end.getTime() - start.getTime())/1000
		const mode = (process.env.WorkStealing)?'work-stealing':'master-slave'
		console.log(`Mode\t\t#Workers\tTime\t`)
		console.log(`${mode}\t\t${numCPUs}\t${timeTaken}s\t`)
	})
}
else {
	worker((callback, process, message)=>{
		const commit = message.job
		const newFolderName = `git-process-${process.pid}-${commit}`
		return io.copyFolder(masterDir, newFolderName)
			.then(()=>{
				return git.reset(commit, newFolderName, true)
			})
			.then(()=>{
				return argon.analyse(newFolderName)
			})
			.then((analysis)=>{
				console.info(`Worker ${process.env.workerId}: Finished job ${commit}\n`)
				callback()
			})
	})
}

