var yaml = require('js-yaml')
var fs = require("fs")
var process = require('process')

try{
	var config = yaml.safeLoad(fs.readFileSync(__dirname + "/config.yaml"))
	console.info('Load the config successfully')
	// console.log(config)
	module.exports = config
} catch (e) {
	console.error(e)
	console.log('Fail to load the config')
	process.exit(1)
}

