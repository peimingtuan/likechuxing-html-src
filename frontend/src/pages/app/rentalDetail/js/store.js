/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: store
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018/11/19-4:22 PM
 * Description:
 *
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'
import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
import {getApiUrl} from '../../../../../other_modules/url-constructor/index';

import photos from './store_photos'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    photos
  },

  state: {
    uuid: '',
    sign: '',
    user_lat:0,
    user_lng:0,
    user_version:'h5_2202',
    version:2202,

    rental_no:'',

    detail:null,
    fee_detail:null
  },
  mutations: {
    setUuid (state, data) {
      state.uuid = data.uuid
      state.sign = data.sign
      if (data.user_lat) {
        state.user_lat = data.user_lat
        state.user_lng = data.user_lng
      }
      if (data.user_version) {
        state.version = Number(data.user_version.split('_')[1])
        state.user_version = 'h5_' + state.version
      }
      if (data.rental_no) state.rental_no = data.rental_no
    },

    setDetail(state,data){
      state.detail = data
    },

    setFeeDetail(state,data){
      state.fee_detail = data
    },

    comment(state,data){
      state.detail.comment.type = data.type
      state.detail.comment.has_commented = 1
      state.detail.comment.commented_list = data.chosen
    }
  },
  getters: {
    // 公共参数
    publicArguments (state) {
      let data = {}

      if (state.uuid) {
        data.uuid = state.uuid
        data.sign = state.sign
      }
      if(state.lat){
        data.lat = state.lat
        data.lng = state.lng
      }
      if(/h5_\d{4}/.test(state.user_version)){
        data.user_version = state.user_version
      }
      if(state.rental_no)data.rental_no = state.rental_no
      return data
    }
  },
  actions:{
    getHistoryDetail({commit,getters}){
      return myAjax.post(getApiUrl('/rental-history/detail'), getters['publicArguments']).then(res=>{
        if(res.status === 0){
          commit('setDetail',res.data)
        }else{
          throw res
        }
      })
    },

    getFeeDetail({commit,getters}){
      return myAjax.post(getApiUrl('/rental-history/fee-detail'), getters['publicArguments']).then(res => {
        if (res.status === 0) {
          commit('setFeeDetail', res.data)
        } else {
          throw res
        }
      })
    }
  }
})

export default store