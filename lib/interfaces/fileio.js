const cmd = require('./cmd')

module.exports = (function(cmd){
	const FileIO = function(rootDir=''){
		this.rootDir = rootDir
	}
	
	FileIO.prototype.newFolder = function(name) {
		return cmd(`mkdir ${name}`, this.rootDir)
	};

	FileIO.prototype.copyFolder = function(source, dest) {
		return this.newFolder(dest)
			.then(cmd(`cp -a ${source}/. ${dest}/`, this.rootDir))
	};

	FileIO.prototype.removeFolder = function(name) {
		return cmd(`rm -rf ${name}`, this.rootDir)
	};


	return FileIO
})(cmd)