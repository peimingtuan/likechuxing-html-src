/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: User
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/6-下午7:06
 Description:
 Param:
 Return:
 *************************************************/
import LocalData from './LocalData'

export default class User extends LocalData {
  constructor(user) {
    super({
      name: 'USER',
      lifetime: 86400,
      keys: ['uuid', 'sign']
    })

    if(user && user.hasOwnProperty('uuid') && user.hasOwnProperty('sign')){
      this.save({
        uuid: user.uuid,
        sign: user.sign
      })
    }
  }
}