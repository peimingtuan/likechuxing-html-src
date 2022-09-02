/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: LocalData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/6-下午7:04
 Description:
 Param:
 Return:
 *************************************************/

const LOCAL_STORAGE_NAME = 'LIKE_STORE'
import {getTimestamp} from "../like-function/util";

export default class LocalData {
  constructor({name, lifetime, keys}){
    this.full_name = LOCAL_STORAGE_NAME + '_' + name
    this.lifetime = Number(lifetime) || 86400*3
    this.keys = keys || []
    this.state = {}
    this._load()
  }

  _load(){
    let local_data = localStorage.hasOwnProperty(this.full_name) ? JSON.parse(localStorage.getItem(this.full_name)) : {before:0, data:{}};
    let now = getTimestamp()
    let state_all = now < local_data.before ? local_data.data : {};
    this.keys.forEach(key => {
      this.state[key] = state_all[key] || null
    })
  }

  // 设置过期时间
  setExpire(timestamp){
    let now = getTimestamp()
    if(now >= timestamp){
      this.clearLocal()
    }else{
      localStorage.setItem(this.full_name, JSON.stringify({
        before: timestamp,
        data: this.state
      }))
    }
  }

  save(state){
    if(state){
      this.keys.forEach(key => {
        if(state.hasOwnProperty(key)){
          this.state[key] = state[key]
        }
      })
    }

    let now = getTimestamp()
    localStorage.setItem(this.full_name, JSON.stringify({
      before: now + this.lifetime,
      data: this.state
    }))
  }

  clear(){
    for(let key in this.state){
      this.state[key] = null
    }

    this.clearLocal()
  }

  clearLocal(){
    localStorage.removeItem(this.full_name)
  }
}