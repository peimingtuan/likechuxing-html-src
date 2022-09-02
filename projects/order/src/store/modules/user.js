/**
 * Created by garvey on 2017/6/27.
 */
import {LOCAL_STORAGE_NAME} from '../../common/CONST'
import router from '../../router/index'
import myaxios from '../../common/myaxios'
// import axios from 'axios'
import API from '../../common/apiAddress'

export default {
  namespaced: true,
  state: {
    is_login: false,
    uuid: 0,
    sign: '',
    remain_time: '5分钟',
    service_phone: '400-666-2333',
    login_time: 0,
    phone: '',
    // 0审核通过 1待审核 2未通过3未认证
    license: null,
    // 1.未支付 2.已支付 3.退款 4退款中
    deposit: null,
    deposit_city_tag: null
  },
  getters: {
    getUser: state => {
      if (!state.is_login) {
        return false
      }

      return {
        uuid: state.uuid,
        sign: state.sign
      }
    }
  },
  mutations: {
    login: (state, data) => {
      state.is_login = true
      state.login_time = Math.floor(new Date().getTime() / 1000)
      let keys = ['uuid', 'sign', 'remain_time', 'service_phone', 'phone']
      keys.forEach(item => {
        if (state.hasOwnProperty(item) && data[item]) {
          state[item] = data[item]
        }
      })
      state.license = data.license.status
    },
    logout: state => {
      state.is_login = false
      state.uuid = 0
      state.sign = ''
      state.phone = ''
    },
    saveUserToLocal: state => {
      let data = {
        is_login: state.is_login,
        uuid: state.uuid,
        sign: state.sign,
        phone: state.phone
      }
      window.localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data))
    },
    set: (state, data) => {
      for (let key in data) {
        state[key] = data[key]
      }
    }
  },
  actions: {
    login: (store, data) => {
      store.commit('login', data)
      store.commit('saveUserToLocal')
    },
    logout: (store) => {
      store.commit('logout')
      store.commit('saveUserToLocal')
      // store部分应该只负责数据部分逻辑，跳转逻辑放到页面组件中
      // router.push({name: 'login'})
    },
    readLocalUser: (store) => {
      if (window.localStorage.hasOwnProperty(LOCAL_STORAGE_NAME)) {
        let data = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME))
        if (data) {
          store.commit('set', data)
        }
      }
    },
    getMoreUserInfo: store => {
      myaxios.post(API.user.personalCenter, {
        uuid: store.rootState.user.uuid,
        sign: store.rootState.user.sign
      }).then(function (res) {
        if (+res.data.status === 0) {
          store.commit('set', {
            license: +res.data.data.license_status,
            deposit: +res.data.data.deposit_status
          })
          store.dispatch('check')
        }
      })
    },
    check: store => {
      // 验证是否认证，认证失败和未认证跳转到认证界面
      let license = +store.state.license
      if (license === 2 || license === 3) {
        router.push({name: 'license'})
      } else {
        // 验证押金状态，如果为未支付，则检查城市押金属性
        let deposit = +store.state.deposit
        if (deposit === 1) {
          store.dispatch('getDepositByCity')
        } else {
          router.push({name: 'main'})
        }
      }
    },
    getDepositByCity: store => {
      let data = {}
      let city_id = store.rootState.data.city_id
      let city_name = store.rootState.data.city_name
      let lat = store.rootState.data.lat
      let lng = store.rootState.data.lng

      // 依次获取经纬度、城市名、城市id
      if (!lat || !lng) {
        // 如果经纬度没有，请求重新定位，同时显示遮罩
        store.commit('Loading/show', {text: '定位中...', preventEvent: true}, {root: true})
        store.dispatch('data/location', {
          callback: function () {
            store.commit('Loading/hide', null, {root: true})
            store.dispatch('user/getDepositByCity', null, {root: true})
          }
        }, {root: true})
      } else {
        data.lat = lat
        data.lng = lng
        if (city_name) {
          data.city_name = city_name
        }
        if (city_id) {
          data.city_id = city_id
        }
        myaxios.post(API.deposit.query, Object.assign({
          uuid: store.rootState.user.uuid,
          sign: store.rootState.user.sign
        }, data)).then(function (res) {
          if (+res.data.status === 0) {
            if (+res.data.data.deposit_status === 1 && +res.data.data.tag === 1) {
              store.commit('set', {
                deposit_city_tag: +res.data.data.tag
              })
              router.push({name: 'deposit'})
            } else {
              router.push({name: 'main'})
            }
          }
        })
      }
    },
    getDepositQuery: store => {
      let data = {
        city_id: store.rootState.data.city_id,
        city_name: store.rootState.data.city_name,
        lat: store.rootState.data.lat,
        lng: store.rootState.data.lng
      }

      return myaxios.post(API.deposit.query, Object.assign({
        uuid: store.rootState.user.uuid,
        sign: store.rootState.user.sign
      }, data)).then(res => {
        return res.data
      })
    },
    getMenuInfo: (store, cb) => {
      myaxios.post(API.user.personalCenter, {
        uuid: store.rootState.user.uuid,
        sign: store.rootState.user.sign
      }, {showStatus1: false}).then(function (res) {
        if (+res.data.status === 0) {
          store.commit('set', {
            license: +res.data.data.license_status,
            deposit: +res.data.data.deposit_status
          })
          if (typeof cb === 'function') {
            cb()
          }
        }
      })
    }
  }
}
