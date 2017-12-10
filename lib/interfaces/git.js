const cmd = require('./cmd')

module.exports = (function(cmd){
	const Git = function(rootDir=''){
		this.rootDir = rootDir
	}
	
	Git.prototype.clone = function(projectUrl,dest='') {
		return cmd(`git clone ${projectUrl} ${dest}`, this.rootDir)
	};

	Git.prototype.checkout = function(commit, force = false) {
		const args = (force)?'-f':'';
		return cmd(`git checkout ${commit} ${args}`, this.rootDir)
	};

	Git.prototype.commits = function(dir) {
		const projectDir = `${this.rootDir}/${dir}`

		return cmd(`git log --format=%h`, projectDir)
			.then((hashes)=>{
				// Split into an array of hashes and get rid of empty strings
				return hashes.split('\n').reduce((accum, current)=>{
					if (current !== ''){
						accum.push(current)
					}
					
					return accum
				},[])
			})
	};

	return Git
})(cmd)