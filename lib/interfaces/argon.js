const cmd = require('./cmd')

module.exports = (function(cmd){
	const Argon = function(rootDir=''){
		this.rootDir = rootDir
	}
	
	Argon.prototype.analyse = function(dir) {
		return cmd(`argon --json ${this.rootDir}/${dir}`)
	};


	return Argon
})(cmd)