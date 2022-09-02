/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: index.
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-05-17:15
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'
import {getOspApiUrl} from '../getApiUrl'
import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'

// 全局级store
import list from './list.js'
import history from './history'
import maintain from './maintain'
import remind from './remind'
import mine from './mine'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    list,
    history,
    maintain,
    remind,
    mine
  },
  state:{
    nickName:'',
    mobile:''
  },
  mutations: {
    setBase(state,data){
      state.nickName = data.nickName
      state.mobile = data.mobile
    }
  },
  actions:{
    openDoor({state},car_info){
      return myAjax.post(getOspApiUrl('/car/open-door'), {
        mobile:state.mobile,
        car_info
      })
    },
    lockDoor({state},car_info){
      return myAjax.post(getOspApiUrl('/car/close-door'), {
        mobile:state.mobile,
        car_info
      })
    }
  }
})

export default store