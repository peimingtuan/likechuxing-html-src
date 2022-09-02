/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: withAxios
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/2-下午5:27
 Description:
 Param:
 Return:
 *************************************************/
import axios from 'axios'
import getVerification from '../../js/getVerification'
import getApiUrl from '../../js/getApiUrl'
require('../../js/polyfills')

class Ajax {
  constructor () {
    this.time_offset = null
    this.list = []

    axios.get(getApiUrl('/time/get')).then( res => {
      let now = Math.floor(new Date().getTime()/1000)
      this.time_offset = res.data.data.timestamp - now
      this.list.forEach( item => {
        this.postNow(...item)
      })
      this.list.length = 0
    })
  }

  post (url, data, cb) {
    if (this.time_offset === null) {
      this.list.push([url, data, cb])
    } else {
      this.postNow(url, data, cb)
    }
  }

  postNow (url, _data, cb) {
    let data = Object.assign({}, _data)
    if (data.hasOwnProperty('user_channel')){
      data.channel = data.user_channel || ''
      delete data.user_channel
    }
    data.user_version = 'h5_1000'
    data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0)
    data.verification = getVerification(data)
    axios.post(url, encodeFormData(data)).then( res => {
      cb(res.data)
    })
  }
}

function encodeFormData (data) {
  if (!data) return ''
  var pairs = []
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue
    if (typeof data[name] === 'function') continue
    if (data[name] === null || data[name] === undefined){
      data[name] = ''
    }
    var value = data[name].toString()
    name = encodeURIComponent(name.replace(' ', '+'))
    value = encodeURIComponent(value.replace(' ', '+'))
    pairs.push(name + '=' + value)
  }
  return pairs.join('&')
}

export default new Ajax()