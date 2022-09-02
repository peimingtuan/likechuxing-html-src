/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: history
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-11-10:11
 * Description:
 *
 *************************************************/
import CarMaintain from '../model/carMaintain'
import {getOspApiUrl} from '../getApiUrl'
import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'
import CarRemind from "../model/carRemind";

export default {
  namespaced: true,
  state: {
    list_history:[],
    filter_status:[1,2,3],
    page:1,
    limit:100
  },
  getters: {

  },
  mutations: {
    setListHistory(state,list){
      state.list_history = list.map(item=>new CarMaintain(item))
    },
    appendListHistory(state,list){
      state.list_history = state.list_history.concat(list.map(item=>new CarMaintain(item)))
    },
    setPage(state,append){
      if(append){
        state.page = state.page+1
      }else{
        state.page = 1
      }
    },

    setFilter(state,data){
      if(data.filter_status)state.filter_status = data.filter_status
    }

  },
  actions: {
    getListHistory({state,rootState,commit},data){
      commit('setPage',data.append)
      return myAjax.post(getOspApiUrl('/vehicle-maintain/order-list'),{
        mobile:rootState.mobile,
        limit:state.limit,
        page:state.page,
        status:state.filter_status.join(','),
        is_mine:1
      }).then(res=>{
        if(res.status !== 0)throw res

        if(!data.append){
          commit('setListHistory',res.data)
        }else{
          commit('appendListHistory',res.data)
        }

      })
    },
  }
}