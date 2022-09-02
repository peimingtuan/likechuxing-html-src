/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: maintain
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-11-14:19
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
import CarMaintain from '../model/carMaintain'
import {getOspApiUrl} from '../getApiUrl'
import myAjax from '../../../../../../other_modules/like-request/withAxiosV3'

export default {
  namespaced: true,
  state: {
    // 保养单
    car_maintain:{},
    // 保养地点列表
    maintain_branches:[],
    // 保养类型列表
    maintain_types:[],

    maintain_operate_history:[]
  },
  getters: {

  },
  mutations: {
    setCarMaintainInfo(state,car){
      state.car_maintain = new CarMaintain(car)
    },

    setBranches(state,data){
      state.maintain_branches = data
    },
    setTypes(state,data){
      data.forEach(type=>{
        type.child.forEach(item=>{
          item.chosen = false
        })
      })
      state.maintain_types = data
    },

    setMaintainOperateHistory(state,data){
      state.maintain_operate_history = data
    }
  },
  actions: {
    submit({state,rootState,commit},data){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/operate'),Object.assign({
        mobile:rootState.mobile,
        order_id:state.car_maintain.id
      },data)).then(res=>{
        if(res.status !== 0)throw res
      })
    },
    getCarMaintain({state,rootState,commit},order_id){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/order-detail'),{
        mobile:rootState.mobile,
        order_id:order_id,
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setCarMaintainInfo',res.data)
        return res.data
      })
    },
    create({state,rootState,commit},params){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/create-order'),{
        mobile:rootState.mobile,
        car_id:params.car_id,
        remark:params.desc,
        last_maintain_km:params.last_maintain_km
      }).then(res=>{
        if(res.status !== 0)throw res

        return res.data.id
      })
    },
    getCarMaintainInfo({state,rootState,commit},car_id){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/create-info'),{
        mobile:rootState.mobile,
        car_id
      }).then(res=>{
        if(res.status !== 0)throw res
        
        commit('setCarMaintainInfo',res.data)
      })
    },
    getMaintainBranches({state,rootState,commit}){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/maintain-branch'),{
        mobile:rootState.mobile
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setBranches',res.data)
      })
    },
    getMaintainTypes({state,rootState,commit}){
      return myAjax.post(getOspApiUrl('/vehicle-maintain/maintain-type'),{
        mobile:rootState.mobile
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setTypes',res.data)
      })
    },

    getMaintainOperateHistory({state,rootState,commit},order_id){
      commit('setMaintainOperateHistory',[])
      return myAjax.post(getOspApiUrl('/vehicle-maintain/operate-history'),{
        mobile:rootState.mobile,
        order_id
      }).then(res=>{
        if(res.status !== 0)throw res

        commit('setMaintainOperateHistory',res.data)
      })
    }
  }
}