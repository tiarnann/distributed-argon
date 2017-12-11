const cmd = require('./cmd')

module.exports = (function(cmd){
	const FileIO = function(rootDir=''){
		this.rootDir = rootDir
	}
	
	FileIO.prototype.newFolder = function(name) {
		return cmd(`mkdir ${name}`, this.rootDir)
	};

	FileIO.prototype.copyFolder = function(source, dest) {
		return cmd(`cp -r ${source} ${dest}`, this.rootDir)
	};

	FileIO.prototype.removeFolder = function(name) {
		return cmd(`rm -r ${name}`, this.rootDir)
	};


	return FileIO
})(cmd)