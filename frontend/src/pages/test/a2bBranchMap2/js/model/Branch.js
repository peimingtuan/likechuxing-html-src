/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Branch
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-05-14:13
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/

 module.exports = class Branch{
   constructor (branch) {
     this.id = Number(branch.id)
     this.name = branch.name
     this.biz_type = Number(branch.biz_type)
     this.lng = Number(branch.lng)
     this.lat = Number(branch.lat)

     this.count_begin = Number(branch.count_begin)
     this.count_end = Number(branch.count_end)
   }

 }