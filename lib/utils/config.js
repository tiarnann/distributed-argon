const temp = 'tmp'
const {project, rootDir} = process.env

module.exports = {
	'port': process.env['port'] || 8080,
	'project': project || 'https://github.com/rubik/argon',
	'masterDir': 'master-copy',
	'tempDir': temp,
	'rootDir': rootDir
}
