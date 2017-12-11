/* Project Modules */
const cmd = require('./interfaces/cmd')
const config = require('./utils/config') 
const {rootDir, commits, masterDir} = config

const io = new (require('./interfaces/fileio'))(rootDir)
const git = new (require('./interfaces/git'))(rootDir)
const argon = new (require('./interfaces/argon'))(rootDir)
const id = process.pid


const folder = (commit, id) =>{
	return `git-hash@${commit}-process-${id}`
}

module.exports= worker = (logger)=>{
	logger.info(`Worker ${process.pid} started`);
	
	for(const commit of commits) {
		const newFolderName = folder(commit, id)
		
		io.copyFolder(masterDir, newFolderName)
			.then(()=>{
				return git.reset(commit, newFolderName, true)
			})
			.then(()=>{
				return argon.analyse(newFolderName)
			})
			.then(()=>{
				logger.info(`Worker ${process.pid} closing`);
				process.exit()
			})
			.catch((err)=>{
				logger.error(err)
			})
	}


}