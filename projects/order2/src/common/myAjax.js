/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: myAjax
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/10-下午5:29
 Description:
 Param:
 Return:
 *************************************************/
import axios from 'axios'
import store from '../store/store'
import router from '../router/index'
import getVerification from './getVerification'
import API from './apiAddress'
import {Toast} from '../../other_modules/vue-plugins/like-base'
import Err from './class/Err'

class MyAjax {
  constructor() {
    this.time_offset = null
    this.server_time = 0

    // 先拿服务器时间，以免客户端时间不对导致签名超时
    this.getting = axios.get(API.time.get).then(res => {
      if (res.status === 200) {
        let now = Math.floor(new Date().getTime() / 1000)
        this.server_time = res.data.data.timestamp
        this.time_offset = this.server_time - now
      } else {
        Toast('抱歉，时间服务器开小差了，请稍后重试')
      }
    }).catch(err => {
      Toast('抱歉，服务器开小差了，请稍后重试')
    })
  }

  get(url) {
    return axios.get(url)
  }

  postV2(url, data) {
    // 等待获取正确的时间
    return this.getting.then(() => {

      return axios.post(
        url,
        this.appendNormalArguments(data),
        {
          transformRequest: [data => encodeFormData(data)],
          transformResponse: [
            // 格式化返回的数据使之成为对象
            res => typeof res === 'string' ? JSON.parse(res) : res
          ],
          timeout: 30000
        }).then(res => {

        // 取到http的body，http错误axios会自己throw error
        let data = res.data

        // 全局只代理登录信息过期的错误
        if (data.status === 6001) {

          Toast('登录信息已过期，请重新登录')
          router.push( '/user/login')

          throw new Err(101)

        } else {

          return data

        }
      }).catch(err=>{
        console.warn(err)
        Toast('网络故障，请检查网络设置')
      })
    })
  }

  async post(url, data, opt) {
    console.warn(url+'使用post')
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
        if (data.status === 0) {
          resolve(data)
        } else {
          // 接口错误处理
          if (data.status === 6001) {
            Toast('登录信息已过期，请重新登录')
            router.push({path: '/user/login'})
          } else {
            // 默认代理显示err
            if (!opt || opt.errAgent) {
              Toast(data.msg)
            }
          }
          reject(data)
        }
      }).catch(function (err) {
        console.log(data)
        console.warn(err)
        // http错误处理
        Toast('抱歉，服务器开小差了.')
      })
    })
  }

  postPage(url, data) {
    var temp = document.createElement("form");
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";
    let _data = this.appendNormalArguments(data)
    for (let key in _data) {
      let opt = document.createElement("textarea");
      opt.name = key;
      opt.value = _data[key];
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
    data.device_name = 'm.likechuxing.com'
    // 登录信息
    if (store.state.user.is_login) {
      data.uuid = store.state.user.uuid
      data.sign = store.state.user.sign
    }
    // 定位
    if (store.state.user.lat) {
      data.user_lat = store.state.user.lat
      data.user_lng = store.state.user.lng
    }
    // 城市信息
    if (!data.city_id && store.state.user.city_id) {
      data.city_id = store.state.user.city_id
    }
    if (store.state.user.city_name) {
      data.city_name = store.state.user.city_name
    }
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
