/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: menu
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/26-下午5:26
 Description:
 Param:
 Return:
 *************************************************/
import {getManageUrl} from "../../../../../../other_modules/url-constructor/index";
import myAjax from "../../../../../../other_modules/like-request/withAxiosV2";

export default {
  namespaced: true,
  state: {
    statusList:[],
    carList:[],
    total:0
  },
  getters:{
    statusListEnable(state){
      return state.statusList.filter(item => {
        let disabled_ids = [0,1,2]
        return !disabled_ids.includes(item.status)
      })
    }
  },
  mutations: {
    setStatusList(state,data){
      state.statusList = data
    },
    setCarList(state,data){
      state.carList = data
    },
    setTotal(state,data){
      state.total = Number(data) || 0
    },
    deleteCarItem(state,_index){
      state.carList = state.carList.filter((item,index)=>_index!==index)
      state.total = state.total - 1
    },
    destroy(state){
      state.statusList = []
      state.carList = []
      state.total = 0
    }
  },
  actions: {
    getStatusList({dispatch,commit}){
      return dispatch('myAjax',{
        url:getManageUrl('/car/status-list'),
        data:{}
      },{root:true}).then(res=>{
        if(res.status === 0){
          commit('setStatusList',res.data)
        }else{
          throw res
        }
      })
    },

    getCarList({commit,dispatch},data){
      return dispatch('myAjax',{
        url:getManageUrl('/car/list'),
        data
      },{root:true}).then(res=>{
        if(res.status === 0){

          let list = res.data.data
          commit('setTotal',res.data.total)
          commit('setCarList',list)
          return res
        }else{
          throw res
        }
      })
    },

    deal306({state, commit,dispatch},id) {
      return dispatch('myAjax',{
        url:getManageUrl('/evaluate/handle-cannot-find-car'),
        data:{car_cancel_id: id}
      },{root:true}).then(res=>{
        if(res.status === 0){
          let index = state.carList.findIndex(item=>item.id===id)
          commit('deleteCarItem',index)
        }else{
          throw res
        }
      })
    },
    evaluateAdd({commit,dispatch},data){
      return dispatch('myAjax', {
        url:getManageUrl('/evaluate/add'),
        data
      },{root:true}).then(res=>{
        if(res.status!==0) throw res
      })
    },
    evaluateOk({commit,dispatch},data){
      return dispatch('myAjax', {
        url:getManageUrl('/evaluate/handle-ok'),
        data
      },{root:true}).then(res=>{
        if(res.status!==0) throw res
      })
    }
  }
}