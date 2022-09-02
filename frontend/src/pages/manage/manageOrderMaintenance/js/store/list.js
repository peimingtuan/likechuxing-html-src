/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: list
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-05-17:16
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
import CarRemind from '../model/carRemind'
import CarMaintain from '../model/carMaintain'
import {getOspApiUrl} from '../getApiUrl'
import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'

export default {
  namespaced: true,
  state: {
    active_tab:1,

    list_remind:[],
    page_remind:1,
    limit_remind:10,

    list_maintain:[],
    page_maintain:1,
    limit_maintain:10
  },
  getters: {

  },
  mutations: {
    setActiveTab(state,id){
      state.active_tab = id
    },

    setListRemind(state,list){
      state.list_remind = list.map(item=>new CarRemind(item))
    },
    appendListRemind(state,list){
      state.list_remind = state.list_remind.concat(list.map(item=>new CarRemind(item)))
    },
    setPageRemind(state,append){
      if(append){
        state.page_remind = state.page_remind+1
      }else{
        state.page_remind = 1
      }
    },

    setListMaintain(state,list){
      state.list_maintain = list.map(item=>new CarMaintain(item))
    },
    appendListMaintain(state,list){
      state.list_maintain = state.list_maintain.concat(list.map(item=>new CarMaintain(item)))
    },
    setPageMaintain(state,append){
      if(append){
        state.page_maintain = state.page_maintain+1
      }else{
        state.page_maintain = 1
      }
    },
  },
  actions: {
    getListRemind({state,rootState,commit},data){
      commit('setPageRemind',data.append)
      return myAjax.post(getOspApiUrl('/vehicle-maintain/warning-list'),Object.assign({
        mobile:rootState.mobile,
        page:state.page_remind,
        limit:state.limit_remind
      },data)).then(res=>{
        if(res.status !== 0)throw res

        if(data.append){
          commit('appendListRemind',res.data)
        }else{
          commit('setListRemind',res.data)
        }

      })
    },

    getListMaintain({state,rootState,commit},data){
      commit('setPageMaintain',data.append)
      return myAjax.post(getOspApiUrl('/vehicle-maintain/order-list'),Object.assign({
        mobile:rootState.mobile,
        page:state.page_maintain,
        limit:state.limit_maintain
      },data)).then(res=>{
        if(res.status !== 0)throw res

        if(data.append){
          commit('appendListMaintain',res.data)
        }else{
          commit('setListMaintain',res.data)
        }

      })
    }
  }
}
