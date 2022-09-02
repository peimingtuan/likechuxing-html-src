/**
 * Created by garvey on 2017/8/24.
 */
import axios from 'axios'
import store from '../store/store'
import router from '../router/index'
import getVerification from '../common/getVerification'

const myaxios = {
  post: function (url, data, conf) {
    let config = Object.assign({
      // 显示http错误，相当于是否自动代理catch（err）
      showError: true,
      // 是否显示服务器返回的status=1的错误
      showStatus1: true
    }, conf)

    let _axios = axios.post(url, data, {
      // 此时data还是Object
      transformRequest: [
        // 增加登录信息
        function (data) {
          let _data = Object.assign({}, data, {
            user_version: 'h5_2201',
            channel: 'h5',
            user_sys_version: window.navigator.userAgent,
            device_name: '立刻出行网页版'
          })
          if (store.state.user.is_login) {
            _data = Object.assign(_data, {
              uuid: store.state.user.uuid,
              sign: store.state.user.sign
            })
          }
          if (store.state.data.lat) {
            _data = Object.assign(_data, {
              user_lat: store.state.data.lat,
              user_lng: store.state.data.lng
            })
          }
          if (store.state.data.city_id) {
            _data.city_id = store.state.data.city_id
          }
          if (store.state.data.city_name) {
            _data.city_name = store.state.data.city_name
          }
          for (let key in _data) {
            if (typeof _data[key] === 'string') {
              _data[key] = _data[key].replace(/\s+/g, '')
            }
          }
          return _data
        },
        // 增加客户端时间
        function (data) {
          let now = Math.floor(new Date().getTime() / 1000)
          let time_offset = store.state.data.time_offset
          return Object.assign(data, {client_time: now + time_offset})
        },
        // 签名
        function (data) {
          return Object.assign(data, {verification: getVerification(data)})
        },
        // 拼装成a=1&b=2的格式
        function (data) {
          return encodeFormData(data)
        }
      ],
      // 修改接收后的数据
      transformResponse: [
        // 服务器返回当前未登录
        function (res) {
          let data = typeof res === 'string' ? JSON.parse(res) : res
          // 不检验是否登录的接口
          let excuplate_url = [
            /\/wx-js\/sign-package/
          ]
          if (excuplate_url.every(item => !item.test(url)) && +data.status === 6001) {
            store.dispatch('Alert/show', {
              mold: 'toast',
              msg: data.msg
            })
            store.dispatch('user/logout')
            router.push({name: 'login'})
          }
          return data
        },
        function (data) {
          // 校验返回status如果不等于0，显示错误信息
          if (config.showStatus1 && +data.status !== 0) {
            store.dispatch('Alert/show', {
              mold: 'toast',
              msg: data.msg
            })
          }
          return data
        }
      ],
      timeout: 20000
    })

    // 统一处理ajax网络错误
    _axios.catch(function () {
      if (config.showError) {
        store.dispatch('Alert/show', {
          mold: 'toast',
          msg: '抱歉，服务器开小差了'
        })
      }
    })
    return _axios
  },
  formPost: function (url, data) {
    // 增加登录信息
    let _data = Object.assign(data, {
      uuid: store.state.user.uuid,
      sign: store.state.user.sign,
      user_version: 'h5_1000',
      channel: 'h5',
      user_sys_version: window.navigator.userAgent,
      device_name: window.navigator.userAgent
    })
    if (store.state.data.lat) {
      _data = Object.assign(_data, {
        user_lat: store.state.data.lat,
        user_lng: store.state.data.lng
      })
    }
    if (store.state.data.city_id) {
      _data.city_id = store.state.data.city_id
    }
    if (store.state.data.city_name) {
      _data.city_name = store.state.data.city_name
    }
    // 增加本地时间
    let now = Math.floor(new Date().getTime() / 1000)
    let time_offset = store.state.data.time_offset
    _data.client_time = now + time_offset
    // 签名
    _data.verification = getVerification(_data)
    // 生成表单
    let temp = document.createElement('form')
    temp.action = url
    temp.method = 'post'
    temp.style.display = 'none'
    for (let x in _data) {
      let opt = document.createElement('textarea')
      opt.name = x
      opt.value = data[x]
      temp.appendChild(opt)
    }
    document.body.appendChild(temp)
    temp.submit()
  }
}

function encodeFormData (data) {
  if (!data) return ''
  var pairs = []
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue
    if (typeof data[name] === 'function') continue
    var value = String(data[name])
    name = encodeURIComponent(name.replace(' ', '+'))
    value = encodeURIComponent(value.replace(' ', '+'))
    pairs.push(name + '=' + value)
  }
  return pairs.join('&')
}

export default myaxios
