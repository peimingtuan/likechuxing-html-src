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
import {Toast, Alert, Confirm} from "../../../../component/LikeAlert/index";

export default class MemberMallData extends SessionData {
  constructor(data){
    super({
      name: 'MemberMallData',
      keys: [
        'uuid',
        'sign',
        'name',
        'phone',
        'area',
        'address',
        'goodsDetail',
        'goodsExchange'
      ]
    })

    this.save(data)

    if(!this.state.uuid || !this.state.sign){
      new Alert({
        title: '请先登录App',
        confirmButtonCallback: function(){
          appMutual.jumpIndexAndCloseThisWebview()
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

  getAddress(){
    if (this.state.name && this.state.phone && this.state.address) {
      return {
        name: this.state.name,
        phone: this.state.phone,
        address: this.state.address
      }
    }

    return false
  }
}