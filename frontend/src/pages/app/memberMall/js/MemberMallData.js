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

import {appMutual} from '../../../../../other_modules/app-mutual/'
import {Alert} from '../../../../../other_modules/vue-plugins/like-base/'

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
      Alert({
        title:'提示',
        msg: '请先登录App',
        confirmButtonCallback: function(){
          appMutual.jump.indexAndCloseThisWebview()
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