/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: store.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/26-下午3:28
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'
import UserData from '../userData'

import user from './user'
import menu from './menu'
import carList from './carList'

import {getApiUrl} from "../../../../../../other_modules/url-constructor/index";
import myAjax from "../../../../../../other_modules/like-request/withAxiosV2";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    menu,
    carList
  },
  getters:{
    // 公共参数
    publicArguments(state){
      let data = {}
      if(state.user.uuid){
        data.uuid = state.user.uuid
        data.sign = state.user.sign
      }
      data.city_id = state.menu.city_id
      return data
    }
  },
  actions:{
    myAjax({state,getters},arg){
      return myAjax.post(arg.url,Object.assign(getters.publicArguments,arg.data)).then(res=>{
        if(res.status === 6001){
          // 登录过期
          window.vue.$_LIKE_toast('登录过期，请重新登录')
          window.vue.$router.push('/login')
          throw {status:6001}
        }else{
          return res
        }
      })
    }
  }
})

// 加载本地登录信息
let userData = new UserData()
if(userData.state.uuid && userData.state.sign)store.commit('user/login',userData.state)
if(userData.state.city_id)store.commit('menu/setCity',userData.state.city_id)

export default store