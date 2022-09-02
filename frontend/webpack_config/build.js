/**
 * Created by garvey on 2017/6/30.
 */
process.env.NODE_ENV = 'production';

const ora=require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const ProjectList = require('./function/getProjectList.js');
const getWebpackConf = require('./function/getWebpackConf.js');
const argv = require('./function/parseArgv')
const copyProject = require('./function/copyProject')
const fse = require('fs-extra')
const path = require('path')

let project=ProjectList.find(project=>project.id===argv.project_id);
if(!project){
	console.log(chalk.red(' [error] ')+'There is something wrong in get project object,please check build arguments and project_id in file ProjectList.js.');
	return
}

//开始执行webpack
const spinner = ora(`Building ${project.name}(${project.name_zh}) for production...`);
spinner.start();

webpack(Object.assign(getWebpackConf(project),{mode:'production'}), function (err, stats) {
	spinner.succeed()
	if (err) throw err

  fse.ensureDir(path.join(project.output_file.path,'./analyze')).then(()=>{
    return fse.writeJson(path.join(project.output_file.path,'./analyze/webpack-stats.json'), stats.toJson({
      assets: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }))
  }).then(()=>{

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      warnings: false, // 添加警告
      entrypoints: false, // 通过对应的 bundle 显示入口起点
      hash: false, // 添加 compilation 的哈希值
    }) + '\n\n')

    //如果命令行参数带cp且项目配置了目的目录的话，复制项目到目标目录
    if(argv.copy && project.copy){
      return copyProject(project)
    }
  }).then(()=>{
    console.log('  Build complete.\n')
  }).catch(err=>{
    console.log(err)
  })

})
