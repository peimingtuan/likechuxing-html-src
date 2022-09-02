/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: userData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/15-下午3:58
 Description:
 Param:
 Return:
 *************************************************/
import SessionData from '../../../../../other_modules/like-webStorage/LocalData'

export default new class UserData extends SessionData {
  constructor () {
    super({
      name: 'inviteFriends4_user',
      lifetime: 86400*30,
      keys: [
        'uuid',
        'sign',
        'new_user',
        'phone'
      ]
    })

  }
}