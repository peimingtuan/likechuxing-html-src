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

class User extends LocalData {
  constructor() {
    super({
      name: 'USER',
      lifetime: 86400*30,
      keys: [
        'uuid',
        'sign',
        'is_login',
        'phone'
      ]
    })
  }
}

export default new User()
