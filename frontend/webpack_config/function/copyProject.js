/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: cpProject
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/20-下午1:53
 Description:
 Demo:
 Others:
 *************************************************/
const path = require('path')
const fse = require('fs-extra')

module.exports = function (project) {
  const from = project.output_file.path
  const directory = project.copy.directory
  const files = project.copy.files

  // 从webpack-stats文件中解析目标路径
  return fse.readJson(path.join(from, './analyze/webpack-stats.json')).then(obj => {
    // 入口文件
    let html_files = []
    // 静态资源文件集合
    let static_files = []

    obj.assets.forEach(item => {
      if (/^\.\//.test(item.name)) {
        html_files.push(item)
      } else {
        static_files.push(item)
      }
    })

    // 静态资源命名hash化，先删除旧文件
    return Promise.all(static_files.map(item => fse.remove(path.join(project.copy.directory, item.name, '../'))))
      .then(() => {
        // 复制webpack-stats.json文件
        return fse.copy(path.join(from, './analyze/webpack-stats.json'), path.join(files, './analyze/webpack-stats.json'), {overwrite: true})
      }).then(() => {
        // 复制入口文件
        return Promise.all(html_files.map(item => fse.copy(path.join(from, item.name), path.join(files, item.name), {overwrite: true})))
      }).then(() => {
        // 复制额外文件
        let input_file_path = project.input_file[Object.keys(project.input_file)[0]][0]
        let file_list = fse.readdirSync(path.dirname(input_file_path))
        if(file_list.includes('fileCopy')){
          let copy_path = path.join(path.dirname(input_file_path),'./fileCopy/')
          return fse.copy(copy_path, files, {overwrite: true})
        }
      }).then(() => {
        // 复制静态文件
        return Promise.all(static_files.map(item => fse.copy(path.join(from, item.name), path.join(directory, item.name), {overwrite: true})))
      })

  })
}

