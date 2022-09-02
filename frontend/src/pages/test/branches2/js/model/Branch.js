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

     this.rank = Number(branch.rank)

     this.bind_type_b = false
     this.bind_type_all = false
   }

   zip(){
     return [this.id,this.name,this.biz_type,this.lng,this.lat,this.rank,this.bind_type_b,this.bind_type_all]
   }

   unZip(data){
     this.id = data[0]
     this.name =data[1]
     this.biz_type = data[2]
     this.lng = data[3]
     this.lat = data[4]

     this.rank = data[5]

     this.bind_type_b = data[6]
     this.bind_type_all = data[7]
   }

 }