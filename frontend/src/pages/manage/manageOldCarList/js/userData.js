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
import LocalData from '../../../../component/webStorage/LocalData'

export default class User extends LocalData {
  constructor(user) {
    super({
      name: 'MANAGE_USER',
      lifetime: 86400*90,
      keys: ['uuid', 'sign', 'city_id']
    })

    if(user && user.hasOwnProperty('uuid') && user.hasOwnProperty('sign')){
      this.save({
        uuid: user.uuid,
        sign: user.sign
      })
    }
  }
}