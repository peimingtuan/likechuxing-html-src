/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: getItemsColor
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-15-15:14
 * Description:
 *
 * @param {number} level 分组数
 * @param {string} color_from 16进制颜色
 * @param {string} color_to 16进制颜色
 *
 *************************************************/
module.exports = function getItemColors (level,color_from,color_to) {
  let from = {
    r:parseInt(color_from.substr(0,2),16),
    g:parseInt(color_from.substr(2,2),16),
    b:parseInt(color_from.substr(4,2),16)
  }

  let step = {
    r:(parseInt(color_to.substr(0,2),16)-from.r)/(level-1),
    g:(parseInt(color_to.substr(2,2),16)-from.g)/(level-1),
    b:(parseInt(color_to.substr(4,2),16)-from.b)/(level-1)
  }

  let colors = [];

  for(let i=0;i<level;i++){
    let r = Math.round(from.r+step.r*i)
    let g = Math.round(from.g+step.g*i)
    let b = Math.round(from.b+step.b*i)
    colors.push(r.toString(16)+g.toString(16)+b.toString(16))
  }

  return colors
}
