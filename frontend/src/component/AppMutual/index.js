/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: AppMutual
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/23-上午10:26
 Description:APP交互，app2.0.0以下定义的方法先进行版本判断
 Demo:
 Others:
 *************************************************/
import MutualBase from './MutualBase'
import AppMutualOld from './old/AppMutualOld'
import OpenApp from './OpenApp'

export default class AppMutual extends MutualBase {
  constructor() {
    super()
    this.appMutualOld = new AppMutualOld()
  }

  sendCoupon(id, value) {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.chooseCoupon(id, value)
      return this.successJson
    }
    //新版
    return this.sendPrompt({
      type: 'send_coupon',
      coupon_id: id,
      coupon_value: value
    })
  }

  sendDamage(ids) {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.sendDamage(ids)
      return this.successJson
    }
    //新版
    return this.sendPrompt({
      type: 'send_damage',
      ids: ids
    })
  }

  sendCopy(msg) {
    return this.sendPrompt({
      type: 'send_copy',
      msg: msg
    })
  }

  sendUpdateTitle(title) {
    return this.sendPrompt({
      type: 'send_updateTitle',
      title: title
    })
  }

  sendUrl(url) {
    return this.sendPrompt({
      type: 'send_url',
      url: url
    })
  }

  jumpUndoneRental(rental) {
    return this.sendPrompt({
      type: 'jump_undoneRental',
      rental_no: rental.uuid,
      rental_status: rental.status
    })
  }

  jumpBeforeRentalPhoto(rental_id) {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.jumpBeforeRentalPhoto(rental_id)
      return this.successJson
    }
    //新版
    return this.sendPrompt({
      type: 'jump_beforeRentalPhoto',
      rental_id: rental_id
    })
  }

  jumpAccidentPhoto(rental_id) {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.jumpAccidentPhoto(rental_id)
      return this.successJson
    }
    //新版
    return this.sendPrompt({
      type: 'jump_accidentPhoto',
      rental_id: rental_id
    })
  }

  jumpIndexAndCloseThisWebview() {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.jumpIndexAndCloseThisWebview()
      return this.successJson
    }

    if (this.appArguments.user_sys == 'android' && this.app_version < 2103) {
      // 旧版交互,低版本安卓存在清除栈问题，2.1.3修复
      this.appMutualOld.jumpIndexAndCloseThisWebview()
      return this.successJson
    }

    //新版
    return this.sendPrompt({
      type: 'jump_indexAndCloseThisWebview'
    })
  }

  jumpLoginAndCloseThisWebview(callback_url) {
    //2.1.3版本app开始支持调到登录页
    if (this.app_version < 2103) {
      return this.jumpIndexAndCloseThisWebview()
    } else {
      return this.sendPrompt({
        type: 'jump_loginAndCloseThisWebview',
        callback_url: callback_url
      })
    }
  }

  jumpLicense(data) {
    if (this.app_version >= 2107) {
      return this.sendPrompt({
        type: 'jump_license',
        license_status:data.license_status,
        target:Number(data.license_status) === 3 ? 1 : 0,
        callback_url: data.callback_url
      })
    }
  }

  shareWx(opt) {
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
    return this.sendPrompt(data)
  }

  open = new OpenApp()
}

