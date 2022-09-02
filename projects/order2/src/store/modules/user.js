/**
 * Created by garvey on 2017/6/27.
 */
import router from '../../router/index'
import myAjax from '../../common/myAjax'
import POI from '../../common/class/POI'
import API from '../../common/apiAddress'
import userData from '../../common/webStorage/User'
import {Toast, Confirm} from '../../../other_modules/vue-plugins/like-base'

export default {
  namespaced: true,
  state: {
    // 11位电话
    phone: '',
    // 脱敏后的电话
    username: '',
    // 头像src
    profile_photo: '',

    is_login: false,
    uuid: 0,
    sign: '',

    is_3001: false,
    reason_3001: '',

    lat: null,
    lng: null,
    city_id: null,
    city_name: null,

    remain_time: '5分钟',
    service_phone: '400-666-2333',

    // 0审核通过 1待审核 2未通过3未认证
    license_status: 3,
    license_desc: '',
    license_reason: '',

    // 押金
    deposit: null,
    // 1.未支付 2.已支付 3.退款 4退款中
    deposit_status: null,
    deposit_desc: '',
    // 该城市是否需要押金，1需要，其它不需要
    deposit_city_tag: null,
    // 是否可以退押金
    deposit_can_refund: 0,
    // 退押金原因
    deposit_ressons: [],

    // 余额
    money: null,
    // 优惠券数量
    coupon_num: 0,

    activity_img_url: '',
    activity_url: ''

  },
  getters: {
    userLoginInfo: state => {
      let str = [
        ['uuid', state.uuid],
        ['sign', state.sign]
      ].map(item => item[0] + '=' + item[1]).join('&')
      return '?' + str
    },
    userLoginInfoLike: state => {
      let str = [
        ['like_uuid', state.uuid],
        ['like_sign', state.sign]
      ].map(item => item[0] + '=' + item[1]).join('&')
      return '?' + str
    },
    user_poi: state => {
      return (state.lat && state.lng) ? new POI(state.lng, state.lat) : new POI(0, 0)
    },
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
    login(state, data) {
      state.is_login = true
      state.login_time = Math.floor(new Date().getTime() / 1000)

      state.uuid = data.uuid
      state.sign = data.sign
      state.remain_time = data.remain_time
      state.service_phone = data.service_phone
      state.phone = data.phone
      state.license_status = Number(data.license.status)
    },
    logout(state) {
      state.is_login = false
      state.uuid = 0
      state.sign = ''
      state.phone = ''
    },
    setUserCenter(state, data) {
      state.profile_photo = data.profile_photo;
      state.money = Number(data.money);
      state.coupon_num = data.coupon_num;
      state.license_status = Number(data.license_status);
      state.license_desc = data.license_desc;
      state.deposit_status = Number(data.deposit_status);
      state.deposit_desc = data.deposit_desc;
      state.username = data.mobile.substr(0, 3) + ' **** ' + data.mobile.substr(7, 4);
      state.activity_img_url = data.activity_img_url;
      state.activity_url = data.activity_url
    },
    setDeposit(state, data) {
      state.deposit_city_tag = data.tag
      state.deposit = data.deposit
      state.deposit_status = Number(data.deposit_status)
      state.deposit_can_refund = data.can_refund
    },
    setUserInformation(state, res) {
      state.license_status = Number(res.data.license.status)
      state.license_reason = res.data.license.reason
      if (res.status === 3001) {
        state.is_3001 = true
        state.reason_3001 = res.data.reason
      }
    },
    setDepositReasons(state, data) {
      state.deposit_reasons = data
    },
    setCityId(state, data) {
      state.city_id = data.city_id
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
      // 本地存储登录信息
      userData.save({
        is_login: store.state.is_login,
        uuid: store.state.uuid,
        sign: store.state.sign,
        phone: store.state.phone
      })
    },
    logout: (store) => {
      store.commit('logout')
      // 清除本地登录信息
      userData.clear()
    },
    readLocalUser: (store) => {
      if (userData.state.is_login) {
        store.commit('set', userData.state)
      }
    },
    getUserInformation: (store,auth) => {
      return myAjax.postV2(API.user.information, {
        auth:auth?auth:1
      }).then(res => {
        if ([0, 1002, 1001, 1013, 3001].includes(res.status)) {
          store.commit('setUserInformation', res)
          return res
        } else {
          throw res
        }
      })
    },
    getUserCenter: (store) => {
      return myAjax.postV2(API.user.personalCenter).then(res => {
        if (res.status === 0) {
          store.commit('setUserCenter', res.data)
          return res.data
        } else {
          throw res
        }
      })
    },
    getDeposit: store => {
      return myAjax.postV2(API.deposit.query).then(res => {
        if (res.status === 0) {
          store.commit('setDeposit', res.data)
          return res
        }else{
          throw res
        }
      })
    },
    location(store) {
      return SDK.getLocation().then(poi => {
        store.commit('set', {
          lat: poi.lat,
          lng: poi.lng
        })

        if (!store.state.city_id) {
          // 取城市id
          return myAjax.postV2(API.describe.getCityId, {
            user_lng: poi.lng,
            user_lat: poi.lat
          }).then(res => {
            store.commit('setCityId', {
              city_id: res.data.city_id
            })
          })
        }
      })
    },

    checkUserStatus(store) {
      // 2018-4需求，顺序变为先押金后认证
      // 验证押金状态，如果为未支付，则检查城市押金属性
      if (store.state.deposit_status === 1) {
        if (store.state.deposit_city_tag === null) {
          store.dispatch.getDeposit().then(() => {
            router.push('/user/deposit')
          })
        } else {
          router.push('/user/deposit')
        }
        throw {status: 1, msg: ''}
      } else if ([2, 3].includes(store.state.license_status)) {
        // 验证是否认证，认证失败和未认证跳转到认证界面
        router.push('/user/license')
        throw {status: 1, msg: ''}
      } else {
        return store.dispatch('checkUserRental')
      }
    },

    checkUserRental(store) {
      return store.dispatch('getUserInformation').then(res => {
        if (res.status === 1002) {
          // 未完成订单
          store.dispatch('rental/getCurrentInfo', null, {root: true}).then(() => {
            router.replace('/rental')
          })
          throw {status:1,msg:''}
        } else if ([1001, 1013].includes(res.status)) {
          store.commit("pay/setRentalNo", res.data.rental.uuid, {root: true})

          if ([15, 16].includes(Number(res.data.rental.status))) {
            // 待确认订单
            Confirm({
              title: '提示',
              msg: '您有一个待确认订单',
              confirmButtonText: '去处理',
              confirmButtonCallback: function () {
                router.push('/pay/confirm')
              }
            })
          } else if ([21, 22, 23, 24, 25, 26, 27, 28, 29].includes(Number(res.data.rental.status))) {
            // 待支付订单
            Confirm({
              title: '提示',
              msg: '您有一个未支付订单',
              confirmButtonText: '去支付',
              confirmButtonCallback: function () {
                router.push('/pay/pay')
              }
            })
          }
          throw {status:1,msg:''}
        }
      })
    },

    check: store => {
      console.warn('some where call user/check,need change to user/checkUserStatus')
    },
  }
}
