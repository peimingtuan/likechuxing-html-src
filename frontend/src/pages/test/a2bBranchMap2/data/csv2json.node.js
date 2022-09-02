/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: csv2json.node.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-07-15:49
 * Description:
 *
 *************************************************/
const fse = require('fs-extra')
const parse = require('csv-parse')

let output = []

const getBranches = function(arr){
  let branches = []
  let branch_names = []

  arr.forEach(item=>{
    if(!branch_names.includes(item[2])){
      branches.push({
        name:item[2],
        biz_type:item[3],
        lng:item[4],
        lat:item[5],
        count_end:0,
        count_begin:1
      })
      branch_names.push(item[2])
    }else{
      let branch = branches.find(item2=>item2.name===item[2])
      branch.count_begin++
    }

    if(!branch_names.includes(item[6])){
      branches.push({
        name:item[6],
        biz_type:item[7],
        lng:item[8],
        lat:item[9],
        count_end:1,
        count_begin:0
      })
      branch_names.push(item[6])
    }else{
      let _branch = branches.find(item2=>item2.name===item[6])
      _branch.count_end++
    }
  })

  fse.writeJSON('./branches.json', branches, 'utf-8').then(() => {
    process.stdout.write(branches.length + '条网点存储成功！\n')
  }).catch(err => {
    throw err
  })
}

fse.createReadStream('./20190103.csv')
  .pipe(parse())
  .on('data', data => {
    if (data[0] !== 'dt') output.push([
      data[1],
      data[2],
      data[3],
      data[4],
      data[5],
      data[6],
      data[7],
      data[8],
      data[9],
      data[10]
    ])
  })
  .on('end', () => {
    fse.writeJSON('./20190103.json', output, 'utf-8').then(() => {
      process.stdout.write(output.length + '条数据转换成功！\n')
    }).catch(err => {
      throw err
    })

    getBranches(output)
  })
