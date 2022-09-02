/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: getBindBranches.node.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-05-11:01
 * Description:
 *
 *************************************************/
const fse = require('fs-extra')
const branches_origin = require('../data/branch.json')
const Branch = require('./model/Branch')
const gps2distance = require('../../../../../other_modules/like-tool/gps2Distance')

let branches = branches_origin.map(item=>new Branch(item))

const makeBind = function(branches){
  let binded =  branches.filter(item => item.rank > 0)
  let other = branches.filter(item => item.rank === 0)

  let group = binded.concat()
  let group_b = binded.concat()

  function cal (target,source,onlyB) {
    let _temp = source.filter(item => {
      if(onlyB && item.biz_type===1)return true

      if (target.some(item2 => {
        return gps2distance.distance([item2.lng, item2.lat], [item.lng, item.lat]) < 0.5
      })) {
        target.push(item)
        return false
      } else {
        return true
      }
    })

    if (_temp.length < source.length) {
      cal(target,_temp,onlyB)
    } else {
      left = _temp
    }
  }

  cal(group,other)
  group.forEach(item=>{item.bind_type_all=true})
  cal(group_b,other,true)
  group_b.forEach(item=>{item.bind_type_b=true})

  console.log(`全部网点：${branches.length}\n联结：${group.length}\nB类联结：${group_b.length}`)
}

console.time('cal')
makeBind(branches)
console.timeEnd('cal')

fse.writeJson('../data/branch_bind.json',branches).catch(err=>{
  throw err
})