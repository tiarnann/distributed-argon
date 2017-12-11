/* Node Modules */
const cluster = require('cluster');
const numCPUs = 2//require('os').cpus().length;

/* Project Modules */
const worker = require('./worker')
const logger = new (require('./utils/logger'))()
const config = require('./utils/config')

const {project,masterDir,tempDir} = config
const io = new (require('./interfaces/fileio'))(tempDir)
const git = new (require('./interfaces/git'))(tempDir)

if(typeof project === 'undefined'){
	logger.error('No project parameter found, exiting process...')
	process.exit(0)
}

if(cluster.isMaster){
  logger.log(`Master ${process.pid} is running`);

  git.clone(project, masterDir)
  	.then(()=>{
  		return git.commits(masterDir)
  	})
  	.then((commits)=>{
  		const commitsPerWorker = Math.ceil(commits.length / numCPUs)
  		
  		while(commits.length > 0){
  			const commitsForWorker = commits.splice(0, commitsPerWorker)

  			// Pass worker its environment
			cluster.fork({
				commits: commitsForWorker,
				rootDir: tempDir,
				masterDir: masterDir 
			});
  		}

  	})
  .catch((err)=>{
  	logger.error(err.err)
  	logger.error(err.stderr)
  })

} else {
	worker(logger)
}