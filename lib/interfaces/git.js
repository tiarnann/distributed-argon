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
	};

	return Git
})(cmd)