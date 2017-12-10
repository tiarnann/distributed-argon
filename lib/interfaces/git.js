const cmd = require('./cmd')

module.exports = (function(cmd){
	const Git = function(rootDir=''){
		this.rootDir = rootDir
	}
	
	Git.prototype.clone = function(ref) {
		return cmd(`git clone ${ref}`, this.rootDir)
	};

	Git.prototype.checkout = function(commit, force = false) {
		const args = (force)?'-f':'';
		return cmd(`git checkout ${commit} ${args}`, this.rootDir)
	};

	return Git
})(cmd)