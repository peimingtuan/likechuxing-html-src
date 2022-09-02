/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: InviteFeiends2Data
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

export default class InviteFriends2Data extends SessionData {
  constructor(data) {
    super({
      name: 'InviteFriends2Data',
      keys: [
        'isInApp',
        'login',
        'uuid',
        'sign',
        'money',
        'realname',
        'account',
        'invite_cnt',
        'last_realname',
        'last_account'
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
      new Alert({
        title: '请先登录，再来参加活动',
        confirmButtonCallback: function () {
          appMutual.jumpLoginAndCloseThisWebview()
        }
      })
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


}