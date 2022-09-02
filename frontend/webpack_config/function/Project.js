/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Project
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-22-15:54
 * Description:
 *
 *************************************************/
const fs = require('fs')
const path = require('path')

const file_path = './user.json'

// 项目根目录，对应 likechuxing-html-src/frontend
const PROJECT_ROOT = path.join(__dirname, '../../')
// 待发布的目录，对应 likechuxing-html/frontendDist
const PROJECT_BUILD_ROOT = path.join(PROJECT_ROOT, '../../', 'likechuxing-html/frontendDist/')

module.exports = class Project {

  constructor (file_path) {

    let data = require(file_path)

    this._checkProjectConfig(data)

    this.isProduction = process.env.NODE_ENV === 'production'

    /*** 基础属性 ***/
    this.src_path = path.dirname(file_path) // 项目源码目录
    this.id = Number(data.id) // 列表id，命令行npm run dev [id]中的索引项
    this.name = data.name // 项目名称，英文
    this.name_zh = data.name_zh || data.zh_name // 项目名称，中文
    this.group = data.group // 项目分组
    this.version = data.version || data.ver // 项目版本

    /*** 自定义编译属性 ***/
    this.bundle_vendor = data.bundle_vendor || false // 是否提取公共代码，多页项目建议提取 true/false
    this.dll = data.dll && data.dll.length > 0 ? data.dll : []  // 是否采用dll打包公共库，Array
    this.useHash = data.hasOwnProperty('useHash') ? data.useHash : true // 静态文件是否使用hash命名，默认true
    this.manualVersion = data.manualVersion || '' // 如果useHush=false 时，代替的用于手动控制版本号的字符串，例如：1001
    this.hash_js = this.isProduction && this.useHash ? '[chunkhash:6].' : this.manualVersion+'.'
    this.hash_css = this.isProduction && this.useHash ? '[contenthash:6].' : this.manualVersion+'.'

    // 是否不额外生成静态文件
    this.all_in_html = Boolean(data.all_in_html)

    this.copy = this._getCopyPath(data.copy) // 是否执行cp命令，true(会用默认路径)/false/[Object]

    this.template = this._getTemplate(data.template) // 配置html模板
    this.staticDirName = data.staticDirName || this.group + '_' + this.name // 打包后项目静态文件存放的目录名，如果不设置则默认是:group_name

    /*** webpack属性 ***/
    this.input_file = this._getInputFile(data.input_file) // 入口文件
    this.output_file = this._getOutPutFile(data.output_file) // 输出
  }

  _checkProjectConfig (project) {
    // todo 检测project原始配置中各必须字段是否存在
  }

  _getCopyPath (copy) {
    if (copy) {
      if (copy.hasOwnProperty('directory') && copy.hasOwnProperty('files')) {
        return {
          directory: path.join(PROJECT_ROOT, copy.directory),
          files: path.join(PROJECT_ROOT, copy.files)
        }
      } else {
        return {
          // js/css/images复制目的目录
          directory: path.join(PROJECT_BUILD_ROOT),
          // html等复制目的目录
          files: path.join(PROJECT_BUILD_ROOT, this.group, this.name)
        }
      }
    } else {
      return false
    }
  }

  _getInputFile (input_file) {
    let data = {}
    //input_file地址绝对化
    for (let k in input_file) {
      data[k] = input_file[k].map(item => path.join(this.src_path, item))
    }
    return data
  }

  _getOutPutFile (output_file) {
    let data = {
      publicPath: "/",
    }

    if (output_file) {
      // output地址绝对化
      data.path = path.join(PROJECT_ROOT, output_file.path)
      // filename增加hash todo 迁移到公共配置
      data.filename = output_file.filename.replace('[name].js', `[name].${this.hash_js}js`)
    } else {
      data.path = path.join(PROJECT_ROOT, `/dist/${this.group}/${this.name}`)
      data.filename = `js/${this.group}_${this.name}/[name].${this.hash_js}js`
    }

    return data
  }

  _getTemplate (template) {
    if(!template)return null

    let data = {}

    if(template.manual_list){
      data.manual_list = template.manual_list.map(item=>{
        return {
          title: item.title || "立刻出行",
          meta:item.meta || ['default'],
          filename:item.name,
          appMountId:item.appMountId || '',
          assets:item.assets || []
        }
      })
    }else{
      data.list = template.list.map(item => {
        return {
          filename: item.replace(/\.(html|pug)/,''),
          path: path.join(this.src_path, item)
        }
      })
    }

    // 打包时各html是否引入所有资源（单页应用无所谓，多页应用false，类似静态页结构的多项目单打包的true）
    data.importAll = template.importAll || false

    return data
  }

  getCopyRight (mode) {

    fs.access(path.join(__dirname, file_path), fs.constants.F_OK, (err) => {
      if (err) throw new Error(`请手动创建${path.join(__dirname, file_path)}文件，内容如下：
  {"name":"your name","email":"your office email"}\r\n
  ps：此文件没有也不应加入版本控制!
  pps：欢迎加入立刻出行前端组`)
    });

    const user = require(file_path);

    switch(mode){
      case 1:
        return `Copyright © since 2017 立刻出行 版权所有 Recent edit by ${user.name}/${user.email} on ${new Date().toLocaleString()}`
      default:
        return `Copyright © 2018 立刻出行 版权所有
Project name:${this.group}_${this.name}
Version:${this.version}
Recent edit by ${user.name}/${user.email} on ${new Date().toLocaleString()}`
    }
  }

}