const { exec } = require('child_process');

module.exports = cmd = (command, rootDir='.') => {
	return new Promise((resolve, reject) => {
		exec(`cd ${rootDir} &&${command}`, (err, stdout, stderr) => {
			if(err){
				reject({err,stderr})
			}
			
			console.log(stdout)
			resolve(stdout)
		});
	});
}