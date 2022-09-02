/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: all
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-23-15:17
 * Description:
 *
 *************************************************/
process.env.NODE_ENV = 'production';

const ora=require('ora');
const webpack = require('webpack');
const ProjectList = require('./function/getProjectList.js');
const getWebpackConf = require('./function/getWebpackConf.js');
const argv = require('./function/parseArgv')
const copyProject = require('./function/copyProject')
const fse = require('fs-extra')
const path = require('path')

let length = ProjectList.length
console.log(`共有${length}个项目`)

function build(current_index){
  if(current_index >= length-1)return

  console.log(`*****正在打包第${current_index}个项目*****`)

  let project = ProjectList[current_index]

  //开始执行webpack
  const spinner = ora(`Building ${project.name}(${project.name_zh}) ${project.id}  for production...`);
  spinner.start();

  webpack(Object.assign(getWebpackConf(project),{mode:'production'}), function (err, stats) {
    spinner.succeed()
    if (err) throw err

    fse.ensureDir(project.output_file.path).then(()=>{
      return fse.writeJson(path.join(project.output_file.path,'webpack-stats.json'), stats.toJson({
        assets: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }))
    }).then(()=>{

      process.stdout.write(stats.toString({
        colors: true,
        assets: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        warnings: false, // 添加警告
        entrypoints: false, // 通过对应的 bundle 显示入口起点
        hash: false, // 添加 compilation 的哈希值
      }) + '\n\n')

/*      //如果命令行参数带cp且项目配置了目的目录的话，复制项目到目标目录
      if(argv.copy && project.copy){
        return copyProject(project)
      }*/
    }).then(()=>{
      console.log('  Build complete.\n')

      build(current_index+1)
    }).catch(err=>{
      throw err
    })

  })
}

let start = Number(process.argv.splice(2)[0]) || 0

build(start)


