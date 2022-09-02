/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: tran
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-05-17:05
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
const fse = require('fs-extra')

let data = []

fse.readFile('../data/group.txt','utf-8').then(res=>{
  let arr = res.split('\n')
  arr.forEach(item=>{
    let a = item.split(',')
    data.push({
      name:a[0],
      group:a[1]
    })
  })

  fse.writeJSON('../data/group.json',data)
})

