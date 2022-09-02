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
const group = require('../../data/group.json')

const getGroupId = function(name){
  switch(name){
    case '第1象限':
      return 1;
    case '第2象限':
      return 2;
    case '第3象限':
      return 3;
    case '第4象限':
      return 4;
    default:
      return 5
  }
}

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

     let group_type = group.find(item=>item.name===this.name)
     if(group_type){
       this.group = getGroupId(group_type.group)
     }else{
       this.group = 5
     }
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