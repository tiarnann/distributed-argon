const { exec } = require('child_process');
const path = require('path')

module.exports  = (command, rootDir='.') => {
	return new Promise((resolve, reject) => {
		exec(`${command}`,{cwd:path.resolve(rootDir)}, (err, stdout, stderr) => {
			if(err){
				console.log(stderr)
				console.log(err)
				reject({err,stderr})
			}
			resolve(stdout)
		})
	});
}