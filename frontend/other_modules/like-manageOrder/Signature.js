/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: in
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/13-下午3:44
 Description:先从本地取，本地取不到从接口取
 Param:
 Return:
 *************************************************/
import sha1 from "sha1"
import {getOspApiUrl} from '../url-constructor/'
import myAjax from '../like-request/withAxiosV3'
import LocalData from '../like-webStorage/LocalData'

export default class Signature{
  constructor (){
    // 指向本地存储的数据
    this.signData = new LocalData({
      name: 'dd.sign.key',
      lifetime: 7200,
      keys: [
        'agent',
        'corp',
        'corp_ken',
        'ticket'
      ]
    })

  }

  async _getBase(){
    if(!this.signData.state.ticket){
      await myAjax.post(getOspApiUrl('/ding-js/base-sign')).then(res => {
        if (res.status === 0) {
          this.signData.save(res.data)
          this.signData.setExpire(res.data.expire)
        } else {
          throw {msg: '获取签名ticket失败'}
        }
      })
    }

    return {
      agent:this.signData.state.agent,
      corp:this.signData.state.corp,
      corp_ken:this.signData.state.corp_ken,
      ticket:this.signData.state.ticket
    }
  }

  // 生成随机字符串
  _getNonceStr(){
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let str = "";
    let charsLength = chars.length;
    for (let i = 0; i < 16; i++) {
      let tmpInt = Math.floor(Math.random() * ((charsLength - 1) + 1));
      str += chars.charAt(tmpInt);
    }
    return str;
  }

  // 签名
  _getSignature(ticket, nonceStr, timeStamp, url){
    let str = 'jsapi_ticket=' + ticket
    str+='&noncestr=' + nonceStr
    str+='&timestamp=' + timeStamp
    str+='&url=' + url;
    return sha1(str);
  }

  async getSignObj(url){
    let sign = await this._getBase()

    let now = Math.floor(new Date().getTime() / 1000)
    let nonceStr = this._getNonceStr()
    return {
      url: url,
      nonceStr,
      agentId: sign.agent,
      timeStamp: now,
      corpId: sign.corp,
      access_token: sign.corp_ken,
      signature: this._getSignature(sign.ticket, nonceStr, now, url)
    }
  }
}
