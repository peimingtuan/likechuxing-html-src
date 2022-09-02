/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: store
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/20-下午2:49
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    uuid: '',
    sign: '',
    user_lat:0,
    user_lng:0,
    user_version:'h5_2202',
    version:2202
  },
  mutations: {
    setUuid (state, data) {
      state.uuid = data.uuid
      state.sign = data.sign
      if(data.user_lat){
        state.user_lat = data.user_lat
        state.user_lng = data.user_lng
      }
      if(data.user_version){
        state.version = Number(data.user_version.split('_')[1])
        state.user_version = 'h5_'+state.version
      }
    },

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
      return data
    }
  },
  actions: {

  }
})

export default store