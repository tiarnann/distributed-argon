const chalk = require('chalk')

module.exports=(function(color, stdout){
	const Console = stdout

	const now = function(){
		return color.italic(Date())
	}

	const Logger = function(){}

	Logger.prototype = {
		log: (...args) => {
			const string = `${now()} // ${args.join(' ')}`
			const colored = color.yellow(string)
			Console.log(colored)
		},

		info: (...args)=>{
			const string = `${now()} // ${args.join(' ')}`
			const colored = color.blue(string)
			Console.info(colored)
		},

		error: (...args)=>{
			const string = `${now()} // ${args.join(' ')}`
			const colored = color.red(string)
			Console.error(colored)
		}
	}

	return Logger
})(chalk, console)