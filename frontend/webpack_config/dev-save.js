/**
 * Created by garvey on 2017/6/30.
 */
const ora=require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const ProjectList = require('./function/getProjectList.js');
const argv = require('./function/parseArgv')
const getWebpackConf = require('./function/getWebpackConf.js');

let project=ProjectList.find(project=>project.id===argv.project_id);
if(!project){
  console.log(chalk.red(' [error] ')+'There is something wrong in get project object,please check build arguments and project_id in file ProjectList.js.');
  return
}

process.env.NODE_ENV = 'development';

const spinner = ora('building for development...');
spinner.start();

let config=getWebpackConf(project);
Object.keys(config.entry).forEach(function (name) {
	config.entry[name] = ['./webpack_config/dev-client.js'].concat(config.entry[name])
})

webpack(config, function (err, stats) {
	spinner.succeed()
	if (err) throw err
	process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')

	console.log('  Build complete.\n')
})
