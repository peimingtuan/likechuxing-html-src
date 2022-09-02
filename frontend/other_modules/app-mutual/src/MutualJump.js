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

export default class MutualJump extends MutualBase {
  constructor() {
    super()
  }

  undoneRental(rental) {
    return this.sendPrompt({
      type: 'jump_undoneRental',
      rental_no: rental.uuid,
      rental_status: rental.status
    })
  }

  beforeRentalPhoto(rental_id) {
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

  accidentPhoto(rental_id) {
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

  indexAndCloseThisWebview() {
    if (this.app_version < 2000) {
      // 旧版交互
      this.appMutualOld.jumpIndexAndCloseThisWebview()
      return this.successJson
    }

    if (this.appArguments.user_sys === 'android' && this.app_version < 2103) {
      // 旧版交互,低版本安卓存在清除栈问题，2.1.3修复
      this.appMutualOld.jumpIndexAndCloseThisWebview()
      return this.successJson
    }

    //新版
    return this.sendPrompt({
      type: 'jump_indexAndCloseThisWebview'
    })
  }

  loginAndCloseThisWebview(opt = {}) {
    //2.1.3版本app开始支持调到登录页
    if (this.app_version < 2103) {
      return this.jumpIndexAndCloseThisWebview()
    } else {
      return this.sendPrompt({
        type: 'jump_loginAndCloseThisWebview',
        options:{
          destroy_current:opt.destroy_current,
          callback_url:opt.callback_url || ''
        }
      })
    }
  }

  license(opt) {
    if (this.app_version >= 2107) {
      let data = {
        type: 'jump_license',
        license_status:opt.license_status,
        target:Number(opt.license_status) === 3 ? 1 : 0,
        options:{
          destroy_current:opt.destroy_current,
          callback_url:opt.callback_url || ''
        }
      }
      if(opt.count_channel)data.count_channel = opt.count_channel
      return this.sendPrompt(data)
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到认证')
    }
  }

  userCenter(opt){
    if (this.app_version >= 2203) {
      let data = {
        type: 'jump_userCenter',
        options:{
          destroy_current:opt.destroy_current,
          callback_url:opt.callback_url || ''
        }
      }
      return this.sendPrompt(data)
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到个人中心')
    }
  }

  deposit(opt){
    if (this.app_version >= 2109) {
      let data = {
        type: 'jump_deposit',
        options:{
          destroy_current:opt.destroy_current,
          callback_url:opt.callback_url || ''
        }
      }
      if(opt.count_channel)data.count_channel = opt.count_channel
      return this.sendPrompt(data)
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到押金')
    }
  }

  recharge(data){
    if (this.app_version >= 2109) {
      return this.sendPrompt({
        type: 'jump_recharge',
        options:{
          destroy_current:data.destroy_current,
          callback_url:data.callback_url || ''
        }
      })
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到充值')
    }
  }

  peccancy(data){
    if (this.app_version >= 2109) {
      return this.sendPrompt({
        type: 'jump_peccancy',
        options:{
          destroy_current:data.destroy_current,
          callback_url:data.callback_url || ''
        }
      })
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到违章处理')
    }
  }

  selfService(data){
    if (this.app_version >= 2109) {
      return this.sendPrompt({
        type: 'jump_selfService',
        options:{
          destroy_current:data.destroy_current,
          callback_url:data.callback_url || ''
        }
      })
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到自助缴费')
    }
  }

  userMessage(data){
    if (this.app_version >= 2109) {
      return this.sendPrompt({
        type: 'jump_userMessage',
        options:{
          destroy_current:data.destroy_current,
          callback_url:data.callback_url || ''
        },
        message_type:data.type
      })
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到消息列表')
    }
  }

  refuelDetail(data){
    if (this.app_version >= 2109) {
      return this.sendPrompt({
        type: 'jump_rentalRefuelDetail',
        options:{
          destroy_current:data.destroy_current,
          callback_url:data.callback_url || ''
        },
        rental_no:data.rental_no
      })
    }else{
      console.warn('当前app版本过低或检测不到版本，无法跳转到消息列表')
    }
  }
}