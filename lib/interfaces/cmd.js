const { exec } = require('child_process');

module.exports = cmd = (command, rootDir='.') => {
	return new Promise((resolve, reject) => {
		exec(`cd ${rootDir} && ${command};`, (err, stdout, stderr) => {
			if(err){
				console.log(stderr)
				console.log(err)
				reject({err,stderr})
			}
			resolve(stdout)
		})
	});
}