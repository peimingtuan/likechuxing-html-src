/**
 * Created by garvey on 2017/6/30.
 */
const chalk = require('chalk');
const table = require('table');
const path = require('path')
let ProjectList = require('./function/getProjectList')

const PROJECT_ROOT = path.join(__dirname,'../','src/pages')

function getProjectList(keyword) {
	if (!!keyword)
		ProjectList = ProjectList.filter( project => {
			let filterColumn = [
				project.group,
				project.name
			]
			return filterColumn.some(item => new RegExp(keyword,'i').test(item))
		});
	return ProjectList.map( project =>
		[project.id, project.name_zh, color(project.group, keyword), color(project.name, keyword), project.src_path.replace(PROJECT_ROOT,'...'), project.version]
	)
}

function color(str, keyword) {
	return !!keyword ? str.replace(new RegExp(keyword,'gi'), function(){
        return chalk.bgGreen(arguments[0])
	}) : str
}

let total = ProjectList.length
let _list = getProjectList(process.argv[2])

console.log('> Project list ('+_list.length+'/'+total+'):');

console.log(table.table([
	['ID', 'NAME_ZH', 'GROUP', 'NAME','DIR', 'VER'],
	..._list
]))

console.log(
	'  Choose the project\'s index which you want to package.\n'+
	'  And type '+chalk.yellow('"npm run [dev|dev-save|build] -- [ID]"\n')
);

if (ProjectList.length === 0)
	console.log(chalk.yellow('"It seems no result,maybe you write the wrong group name or en_name.Please check it"\n'));
