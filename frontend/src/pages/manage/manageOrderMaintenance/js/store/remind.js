/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: remind
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-11-16:14
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
import CarRemind from '../model/carRemind'
import {getOspApiUrl} from '../getApiUrl'
import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'

export default {
  namespaced: true,
  state: {
    car_remind:{},

    updateHistory:[],

    order_history:[]
  },
  mutations: {
    setCarRemind(state,data){
      state.car_remind = new CarRemind(data)
    },

    setRemindUpdateHistory(state,data){
      state.updateHistory = data
    },

    setOrderHistory(state,data){
      state.order_history = data
    }
  },
  actions: {
    getCarRemind({state,rootState,commit},id){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/warning-detail'),{
        mobile:rootState.mobile,
        record_id:id
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setCarRemind',res.data)
      })
    },

    getRemindUpdateHistory({state,rootState,commit},id){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/update-history'),{
        mobile:rootState.mobile,
        record_id:id
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setRemindUpdateHistory',res.data)
      })
    },

    getOrderHistory({state,rootState,commit},car_id){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/order-list'),{
        mobile:rootState.mobile,
        car_id:car_id,
        status:3,
        sort:1,
        page:1,
        limit:100
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setOrderHistory',res.data)
      })
    }
  }
}