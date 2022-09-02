/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SessionData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/12-下午1:59
 Description:
 Param:
 Return:
 *************************************************/
const LOCAL_STORAGE_NAME = 'LIKE_STORE'

export default class LocalData {
  constructor({name, lifetime, keys}){
    this.full_name = LOCAL_STORAGE_NAME + '_' + name
    this.lifetime = Number(lifetime) || 86400*3
    this.keys = keys || []
    this.load()
  }

  load(){
    let local_data = sessionStorage.hasOwnProperty(this.full_name) ? JSON.parse(sessionStorage.getItem(this.full_name)) : {before:0, data:{}};
    let now = new Date().getTime()/1000
    let state_all = now < local_data.before ? local_data.data : {};
    let state = {}
    this.keys.forEach(key => {
      state[key] = state_all[key]
    })
    this.state = state
  }

  save(state){
    if(state){
      this.keys.forEach(key => {
        if(state.hasOwnProperty(key)){
          this.state[key] = state[key]
        }
      })
    }

    let now = Math.floor(new Date().getTime()/1000)
    sessionStorage.setItem(this.full_name, JSON.stringify({
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