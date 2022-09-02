/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: MutualSend
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-下午12:18
 Description:
 Param:
 Return:
 *************************************************/
import MutualBase from './MutualBase'

export default class MutualSend extends MutualBase {
  constructor() {
    super()
  }

  // 选择优惠券
  coupon(id, value) {
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

  // 选择红包
  cash(id, value) {
    if (this.app_version < 2203) {
      // 旧版
      console.log('app version too old')
      return this.successJson
    }
    //新版
    return this.sendPrompt({
      type: 'send_cash',
      cash_id: String(id),
      cash_value: String(value)
    })
  }

  damage(ids) {
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

  damagePart(data){
    return this.sendPrompt({
      type: 'send_damagePart',
      id: data.id,
      name:data.name
    })
  }

  damageFinish(ids){
    return this.sendPrompt({
      type: 'send_damageFinish',
      ids: ids
    })
  }

  copy(msg) {
    return this.sendPrompt({
      type: 'send_copy',
      msg: msg
    })
  }

  // 更新右上角
  updateHeaderRight(text,function_name){
    return this.sendPrompt({
      type: 'send_updateHeaderRight',
      text: text,
      function_name: function_name
    })
  }

  updateTitle(title) {
    return this.sendPrompt({
      type: 'send_updateTitle',
      title: title
    })
  }

  url(opt) {
    if(typeof opt === 'string'){
      opt = {
        url:opt
      }
    }

    opt = Object.assign({
      url:'',
      destroy_current:1,
      callback_url:'',
      request_type:'post',
      need_param:1
    },opt)
    return this.sendPrompt({
      type: 'send_url',
      url: opt.url,
      request_type:opt.request_type,
      need_param:opt.need_param,
      options:{
        destroy_current:opt.destroy_current,
        callback_url:opt.callback_url
      }
    })
  }

  orderCar(){
    return this.sendPrompt({
      type: 'send_orderCar'
    })
  }

  indexRefresh(opt){
    return this.sendPrompt({
      type: 'send_indexRefresh',
      options:{
        destroy_current:opt.destroy_current
      }
    })
  }

  callNavigation(opt){
    return this.sendPrompt(Object.assign({
      type: 'send_callNavigation',
    },opt))
  }

  setIosEnvColor(opt){
    console.log(this)
    if(this.appArguments.user_sys === 'ios' && this.app_version >= 2202){
      console.log('sended')
      return this.sendPrompt({
        type: 'send_setEnvColor',
        footerColor:opt.color
      })
    }
  }
}