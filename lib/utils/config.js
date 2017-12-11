const temp = 'tmp'
const {project, commits, rootDir} = process.env
const splitCommits = (commits || '').split(',')

module.exports = {
	'port': process.env['port'] || 8080,
	'project': project,
	'commits':  splitCommits,
	'masterDir': 'master-copy',
	'tempDir': temp,
	'rootDir': rootDir
}
