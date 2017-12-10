const cmd = require('./cmd')

module.exports = (function(cmd){
	const FileIO = function(rootDir=''){
		this.rootDir = rootDir
	}
	
	FileIO.prototype.newFolder = function(folder) {
		return cmd(`git clone ${ref}`, this.rootDir)
	};

	return FileIO
})(cmd)