/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: MutualShare
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-下午12:14
 Description:
 Param:
 Return:
 *************************************************/
import MutualBase from './MutualBase'

export default class MutualShare extends MutualBase {
  constructor() {
    super()
  }

  wx(opt) {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.shareWx(opt)
      return this.successJson
    }
    //新版
    let data = {
      type: 'share_wx',
      share_type: opt.share_type,
      destination: opt.destination
    }
    if (opt.hasOwnProperty('activity_id')) {
      data.activity_id = opt.activity_id
    }
    if(opt.hasOwnProperty('rental_no')){
      data.rental_no = opt.rental_no
    }
    return this.sendPrompt(data)
  }
}