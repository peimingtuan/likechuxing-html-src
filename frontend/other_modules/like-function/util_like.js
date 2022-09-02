/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: util_like
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018/11/19-11:02 AM
 * Description:
 *************************************************/

/**
 * 返回真是活动id，2018-11-19 为适配app2.2.4服务端灵活控制
 * 活动弹窗，使得活动id可变，规则是:
 * new_id = id*10000+Math.random()*10000
 *
 * @param {string/number} id origin activity_id
 *
 * @return {number} real activity_id
 *
 **/
const getRealActivityId = function(id){

  if(id === undefined)throw new Error('param id is required')

  let _id = Number(id)
  if(!_id)throw new Error('id must be number like')

  // id > 10000的是转译过的活动id
  if(_id < 10000){
    return _id
  }else{
    return Math.floor(_id/10000)
  }
}

export {
  getRealActivityId
}
 