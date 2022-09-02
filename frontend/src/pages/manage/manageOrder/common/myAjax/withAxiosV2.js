/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: withAxiosV2
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/8-下午5:19
 Description:
 Param:
 Return:
 *************************************************/
import axios from 'axios'
import getVerification from '../../../../../js/getVerification'
import getApiUrl from '../../../../../js/getApiUrl'
require('es6-promise').polyfill();

class MyAjax {
  constructor() {
    this.time_offset = null
    this.server_time = 0

    // 先拿服务器时间，以免客户端时间不对导致签名超时
    this.getting = axios.get(getApiUrl('/time/get')).then(res => {
      if (res.status === 200) {
        let now = Math.floor(new Date().getTime() / 1000)
        this.server_time = res.data.data.timestamp
        this.time_offset = this.server_time - now
      } else {

      }
    }).catch(err => {

    })
  }

  get(url) {
    return axios.get(url)
  }

  async post(url, data) {
    // 等待获取正确的时间
    await this.getting

    return new Promise((resolve, reject) => {
      axios.post(url, this.appendNormalArguments(data), {
        transformRequest: [data => encodeFormData(data)],
        transformResponse: [
          // 格式化返回的数据使之成为对象
          res => typeof res === 'string' ? JSON.parse(res) : res
        ],
        timeout: 30000
      }).then(res => {
        let data = res.data
        resolve(data)
      }).catch(err => {
        // http错误处理
        reject(err)
      })
    })
  }

  postPage(url, data) {
    var temp = document.createElement("form");
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";
    let _data = this.appendNormalArguments(data)
    for (var x in _data) {
      var opt = document.createElement("textarea");
      opt.name = x;
      opt.value = _data[x];
      temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
  }

  jsonp(url, params, callback) {
    let that = this;
    url = url + '?';
    for (let i in params) {
      url = url + i + '=' + params[i] + '&';
    }
    let timeStamp = (Math.random() * 100000).toFixed(0);
    window['ck' + timeStamp] = callback || function () {
    };
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

  appendNormalArguments(data) {
    data = Object.assign({}, data)
    // 增加user_channel
    if (data.hasOwnProperty('user_channel')) {
      data.channel = data.user_channel || ''
      delete data.user_channel
    }
    // 代码版本
    data.user_version = 'h5_2106'
    data.user_sys_version = window.navigator.userAgent.replace(/\s/g, '')
    data.device_name = 'h5'
    // 签名时间
    data.client_time = Math.floor(new Date().getTime() / 1000) + this.time_offset
    // 签名算法
    data.verification = getVerification(data)
    return data
  }
}

function encodeFormData(data) {
  if (!data) return ''
  var pairs = []
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue
    if (typeof data[name] === 'function') continue
    var value = String(data[name])
    name = encodeURIComponent(name.replace(/\s/g, ''))
    value = encodeURIComponent(value.replace(/\s/g, ''))
    pairs.push(name + '=' + value)
  }
  return pairs.join('&')
}

export default new MyAjax()