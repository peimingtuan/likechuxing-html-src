/**
 * Created by garvey on 2017/6/27.
 */
const coordtransform = require('coordtransform')
import axios from 'axios'
import API from '../../common/apiAddress'
/*
import {IsWeiXin} from '../../common/UserAgent'
const wx = window.wx
*/
export default {
  namespaced: true,
  state: {
    time_offset: 0,
    bd_lat: null,
    bd_lng: null,
    lat: null,
    lng: null,
    city_id: null,
    city_name: null,
    appId: null,
    timestamp: null,
    nonceStr: null,
    signature: null
  },
  getters: {},
  mutations: {
    set: (state, data) => {
      for (let key in data) {
        state[key] = data[key]
      }
    }
  },
  actions: {
    location (store, data) {
      /* eslint-disable */
      let config = Object.assign({
        callback: false
      },data)

      /*
      if (IsWeiXin()) {
        wx.ready(function () {
          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              store.commit('set', {
                lat: res.latitude,
                lng: res.longitude
              })

              if (typeof config.callback === 'function') { config.callback() }

              axios.post(API.describe.getCityId, 'user_lng=' + res.longitude + '&user_lat=' + res.latitude).then(function (res) {
                if (+res.data.status === 0) {
                  store.commit('set', {
                    city_id: res.data.data.city_id
                  })
                }
              })
            }
          });
        })
        return
      }
      */

      window.geolocation = new BMap.Geolocation()
      let geolocation = window.geolocation
      geolocation.getCurrentPosition(function (res) {
        if (geolocation.getStatus() === BMAP_STATUS_SUCCESS) {
          let point = coordtransform.bd09togcj02(res.point.lng, res.point.lat)
          store.commit('set', {
            bd_lat: res.point.lat,
            bd_lng: res.point.lng,
            lat: point[1],
            lng: point[0],
            city_name: res.address.city
          })

          if (typeof config.callback === 'function') { config.callback() }

          axios.post(API.describe.getCityId, 'user_lng=' + point[0] + '&user_lat=' + point[1]).then(function (res) {
            if (+res.data.status === 0) {
              store.commit('set', {
                city_id: res.data.data.city_id
              })
            }
          })
        }
      })
    },
    getTime (store) {
      axios.get(API.time.get).then(function (res) {
        if (+res.data.status === 0) {
          let now = Math.floor(new Date().getTime() / 1000)
          store.commit('set', {
            time_offset: +res.data.data.timestamp - now
          })
        }
      })
    }
  }
}
