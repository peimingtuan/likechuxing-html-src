/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: MemberMallData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/12-下午2:03
 Description:
 Param:
 Return:
 *************************************************/
import SessionData from '../../../../component/webStorage/SessionData'
import AppMutual from '../../../../component/AppMutual'
const appMutual = new AppMutual()
import {Alert} from "../component/LikeAlert/index";
import getAppArguments from '../../../../js/getAppArguments'

export default class MemberMallData extends SessionData {
  constructor(data) {
    super({
      name: 'MillionGiftData',
      keys: [
        'isInApp',
        'login',
        'uuid',
        'sign',
        'money',
        'transfer_type',
        'realname',
        'account',
        'bankCode',
        'last_realname',
        'last_account',
        'last_bankCode'
      ]
    })

    this.appArgument = getAppArguments()
    if (this.appArgument.isLogin) {
      this.save({
        uuid: this.appArgument.uuid,
        sign: this.appArgument.sign
      })
    }
    this.save(data)
    this.checkLogin()
  }

  isInApp(){
    return this.appArgument.isInApp
  }

  checkLogin(){
    if (!this.state.uuid || !this.state.sign) {
      if(this.appArgument.isInApp){
        new Alert({
          title: '请前往个人中心登录',
          confirmButtonCallback: function () {
            appMutual.jumpLoginAndCloseThisWebview()
          }
        })
      }else{
        new Alert({
          title: '登录信息已过期，请重新登录',
          confirmButtonCallback: function () {
            window.location.href = '/activity/millionGift2/share.html?channel=millionGift2WxShare'
          }
        })
      }
    }
  }

  getUser(){
    if(this.state.uuid && this.state.sign){
      return {
        uuid: this.state.uuid,
        sign: this.state.sign
      }
    }

    return false
  }

  hasLastAccount(){
    return !!this.state.last_account
  }

  isEditAgain(){
    // 是否输入过account等信息
    return !!this.state.account
  }

  isWxPayTransferType(){
    return this.state.transfer_type === '3'
  }
  isAliPayTransferType(){
    return this.state.transfer_type === '1'
  }
}