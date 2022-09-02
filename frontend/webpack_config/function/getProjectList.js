/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getProjects
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/11-下午3:26
 Description:扫描目录结构，生成项目树
 Param:
 Return:
 *************************************************/
const fs = require('fs');
const path = require('path');
const Project = require('./Project')

const PROJECT_DIR = path.join(__dirname, '../../src/pages')
const TARGET_FILE = /^likePackage\.js(on)?$/

let time1 = new Date().getTime()
let _list = readDir(PROJECT_DIR)
let time2 = new Date().getTime()
let list = _list.map(file=>new Project(file)).sort((item1, item2)=>item1.id-item2.id)
let time3 = new Date().getTime()

let data = {
    read_time:time2-time1+'ms',
    process_time:time3-time2+'ms',
    total_time:time3-time1+'ms',
    list
}
fs.writeFile('webpack_config/function/project_list_temp.json',JSON.stringify(data, null, "\t"),function(){})

module.exports = list

function readDir(_path){
    let list = []
    let files = fs.readdirSync(_path)

    files.forEach(file=>{
        let new_path = path.join(_path,file)
        if(TARGET_FILE.test(file)){
            list.push(new_path)
        }else if(!/(\.)|(^js$)|(^css$)|(^image$)/.test(file)){
            let stat = fs.statSync(new_path)
            if(stat.isDirectory()){
                list = list.concat(readDir(new_path))
            }
        }
    })
    return list
}

