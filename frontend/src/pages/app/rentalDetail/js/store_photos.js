/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: store_photos
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-02-11:02
 * Description:
 *
 *************************************************/
import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
import {getApiUrl} from '../../../../../other_modules/url-constructor/index';

function getFixName (key) {
  switch (key) {
    case 'fix_0':
      return '左前侧'
    case 'fix_1':
      return '右前侧'
    case 'fix_2':
      return '车内前排'
    case 'fix_3':
      return '车内后排'
    case 'fix_4':
      return '右后侧'
    case 'fix_5':
      return '左后侧'
    default:
      return ''
  }
}

export default {
  namespaced: true,
  state: {
    method_photo:1,

    tab_id: 1,

    dataReady: false,

    before_fix: [],
    before_parts: [],
    before_close: [],

    after_fix: [],
    after_parts: [],
    after_close: []

  },
  getters: {
    photo_fix (state) {
      if (!state.dataReady) return []

      return state.tab_id === 1 ? state.before_fix : state.after_fix
    },
    photo_close (state) {
      if (!state.dataReady) return []

      return state.tab_id === 1 ? state.before_close : state.after_close
    }
  },
  mutations: {
    setTabId (state, id) {
      state.tab_id = id
    },

    setPhotos (state, data) {
      state.method_photo = Number(data.method_photo)

      if (data.pre) {
        state.before_parts = data.pre.parts.split('^').filter(item => /\d+/.test(item))

        state.before_fix=[]
        // 如果为空，服务端回传[]而非{}
        if(data.pre.fix.length === undefined){
          let keys = ['fix_0','fix_1','fix_2','fix_3','fix_4','fix_5']
          keys.forEach(item=>{
            if(data.pre.fix[item]){
              state.before_fix.push({
                id: item,
                name: getFixName(item),
                url: data.pre.fix[item]
              })
            }
          })
        }

        state.before_close=[]
        if(data.pre.close.length === undefined){
          for (let k in data.pre.close) {
            state.before_close.push({
              id: k,
              url: data.pre.close[k]
            })
          }
        }
      }

      if (data.aft) {
        state.after_parts = data.aft.parts.split('^').filter(item => /\d+/.test(item))

        state.after_fix=[]
        if(data.aft.fix.length === undefined){
          let keys = ['fix_2','fix_3','fix_0','fix_1','fix_4','fix_5']
          keys.forEach(item=>{
            if(data.aft.fix[item]){
              state.after_fix.push({
                id: item,
                name: getFixName(item),
                url: data.aft.fix[item]
              })
            }
          })
        }


        state.after_close=[]
        if(data.aft.close.length === undefined){
          for (let k in data.aft.close) {
            state.after_close.push({
              id: k,
              url: data.aft.close[k]
            })
          }
        }

      }

      state.dataReady = true
    }
  },
  actions: {
    getPhotos ({rootGetters, commit},rental_id) {

      return myAjax.post(getApiUrl('/rental-history/car-photo'), Object.assign({
        rental_id:rental_id,
        // 0=短租 1=长租
        type: 0
      }, rootGetters['publicArguments'])).then(res => {
        if (res.status !== 0) throw res

        commit('setPhotos', res.data)
      })
    }
  }
}
