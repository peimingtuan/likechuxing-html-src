/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: withAxiosV3
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-29-19:03
 * Description:
 *
 *************************************************/
import axios from 'axios'
import getVerification from './getVerificationV2'
import {time} from '../like-function/time'
import filterInvalidParams from './filterInvalidParams'
import {h5} from "./keys";
import formUrlEncoded from 'form-urlencoded'
import parseurl from 'parseurl'

class MyAjax {
  constructor () {
    this.time_offset = 0
    this.hasFixTime = false
  }

  // 返回的是当前时间
  getTimestamp () {
    return time.getTimestamp() + this.time_offset
  }

  get (url, data) {
    let search = data ? formUrlEncoded(data) : ''

    if(search)url = /\?/.test(url) ? url+'&' + search : '?' + search

    return axios.get(url).then(res => res.data)
  }

  post (url, data) {
    // 过滤掉null undefiled NaN
    let params = filterInvalidParams(data)

    params = this._appendNormalArguments(params)

    return axios.post(url, params, {
      headers: {
        //'Content-type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [data => decodeURIComponent(formUrlEncoded(data))],
      transformResponse: [
        // 格式化返回的数据使之成为对象
        (res,header) => {
          if(typeof res === 'string' && /application\/json/.test(header['content-type'])){
            return JSON.parse(res)
          }else{
            return res
          }
        }
      ],
      timeout: 30000
    }).then(res => {
      if(!this.hasFixTime && res.data.msg === '验证失败'){
        return this._handleSignError(url).then(()=>this.post(url,data))
      }else{
        return res.data
      }
    }).catch(err => {
      // http错误处理
      throw err
    })
  }

  postPage (url, data) {
    let temp = document.createElement("form");
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";
    let _data = this._appendNormalArguments(data)
    for (let x in _data) {
      let opt = document.createElement("textarea");
      opt.name = x;
      opt.value = _data[x];
      temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
  }

  jsonp (url, params, callback) {
    url = url + '?';
    for (let i in params) {
      url = url + i + '=' + params[i] + '&';
    }
    let timeStamp = (Math.random() * 100000).toFixed(0);
    window['ck' + timeStamp] = callback || function () {};
    let completeUrl = url + '&callback=ck' + timeStamp;
    let script = document.createElement('script');
    script.src = completeUrl;
    script.id = 'jsonp';
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function (e) {
      document.getElementsByTagName('head')[0].removeChild(script)
    };
    script.onerror = function (e) {
      console.log(e)
    };
  }

  _handleSignError(_url){
    let url = parseurl({url:_url})
    // 拿服务器时间，以免客户端时间不对导致签名超时
    return this.get(`${url.protocol}//${url.host}/time/get`).then(res=>{
      this.hasFixTime = true
      let now = time.getTimestamp()
      this.time_offset = Number(res.data.timestamp) - now
    })
  }

  // 只过滤File类型的数据，不签名，但值不受影响
  _filterOtherTypeValue (params) {
    let params_new = {}
    for (let key in params) {
      if (!(params[key] instanceof File)) {
        params_new[key] = String(params[key])
      }
    }

    return params_new
  }

  _appendNormalArguments (data) {
    data = Object.assign({}, data)

    // 增加user_channel
    if (data.hasOwnProperty('user_channel')) {
      data.channel = data.user_channel || ''
      delete data.user_channel
    }

    // 代码版本
    if (!data.hasOwnProperty('user_version')) {
      data.user_version = 'h5_2203'
    } else {
      let version = data.user_version.split('_')[1]
      data.user_version = 'h5_' + version
    }

    // agent
    data.user_sys_version = window.navigator.userAgent

    data.device_name = 'h5'
    // 签名时间
    data.client_time = this.getTimestamp()
    // 签名算法
    data.verification = getVerification(this._filterOtherTypeValue(data), h5)

    return data
  }
}

export default new MyAjax()