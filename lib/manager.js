/* Node Modules */
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

/* Project Modules */
const worker = require('./workers/worker')
const logger = new (require('./utils/logger'))()
const config = require('./utils/config')

const {project,masterDir,tempDir} = config
const io = new (require('./interfaces/fileio'))(tempDir)
const git = new (require('./interfaces/git'))(tempDir)

// if(typeof project === 'undefined'){
// 	logger.error('No project parameter found, exiting process...')
// 	process.exit(0)
// }

let manager;
if(process.env.WorkStealing){
	manager = require('./managers/work-stealing')
} else {
	manager = require('./managers/master-slave')
}

// git.clone(project, masterDir)
// .then(()=>{ 
// 	return git.commits(masterDir)
// })
// .then(commits=>{

// })

manager(numCPUs, [1,2,3,2,4,5,3,2], (callback)=>{
	console.log('work')
	callback()
})