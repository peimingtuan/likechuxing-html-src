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

import appArguments from '../../../../../other_modules/app-arguments'
import {getApiUrl} from "./getApiUrl";
import myAjax from "../../../../../other_modules/like-request/withAxiosV2";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    uuid: '',
    sign: '',
    user_lat:0,
    user_lng:0,
    user_version:'',
    phone:'',
    new_user:'',
    serverTime:0
  },
  mutations: {
    setUuid (state, data) {
      state.uuid = data.uuid
      state.sign = data.sign
      if(data.user_lat && data.user_version){
        state.user_lat = data.user_lat
        state.user_lng = data.user_lng
        state.user_version = data.user_version
      }
    },
    setUserInfo(state,data){
      state.phone = data.phone;
      state.new_user = data.new_user
    },
    setServerTime(state,time){
      state.serverTime = time;
    }
  },
  getters: {
    // 公共参数
    publicArguments (state) {
      let data = {
        activity_id:1050
      }
      if (state.uuid) {
        data.uuid = state.uuid
        data.sign = state.sign
      }
      if(state.lat){
        data.lat = state.lat
        data.lng = state.lng
      }
      return data
    }
  },
  actions: {

  }
})

if (appArguments.uuid && appArguments.sign) store.commit('setUuid', appArguments)

export default store