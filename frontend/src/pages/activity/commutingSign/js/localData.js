/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: localData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/27-下午8:07
 Description:
 Param:
 Return:
 *************************************************/
import LocalData from '../../../../component/webStorage/LocalData'

export default class User extends LocalData {
  constructor(user) {
    super({
      name: 'WORLD_CUP_USER',
      lifetime: 86400*20,
      keys: ['uuid', 'sign','new_user']
    })

    if(user && user.hasOwnProperty('uuid') && user.hasOwnProperty('sign')){
      this.save({
        uuid: user.uuid,
        sign: user.sign
      })
    }
  }
}