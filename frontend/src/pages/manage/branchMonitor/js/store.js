/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: store
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/2-下午6:27
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'

import appArguments from '../../../../../other_modules/app-arguments'
import {getAdminUrl} from "./getAdminUrl";
import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
import mapControl from './mapControl'


Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    uuid: '',
    sign: '',
    city_list:[],
    city_id:'',
    hotData:[],
    branches:[],

    current_time:0,

    show_slider:true,

    animating:false
  },
  mutations: {
    setUuid (state, data) {
      state.uuid = data.uuid
      state.sign = data.sign
    },
    setCityList(state,data){
      state.city_list = data
    },
    setCityId(state,id){
      state.city_id = id
    },
    setHotData(state,data){
      data.forEach(item=>{
        item.branch.forEach(branch=>{
          branch.count = branch.number
        })
      })
      state.hotData = data
    },
    setShowSlider(state,val){
      state.show_slider = val
    },
    setCurrentTime(state,time){
      state.current_time = time
    },




    setBranches(state, branches){
      state.branches = branches
    }
  },
  actions: {
    getCityList({state,commit}){
      return myAjax.get(getAdminUrl('/tbox/get-allow-city'), {
        uuid:state.uuid,
        sign:state.sign
      }).then(res => {
        if(res.status === 0){
          commit('setCityList',res.data)
        }else{
          throw res
        }
      })
    },

    getBranches({state,commit},city_id){
      return myAjax.get(getAdminUrl('/tbox/time-branch-list'), {
        uuid:state.uuid,
        sign:state.sign,
        city_id
      }).then(res => {
        if(res.status === 0){
          commit('setBranches',res.data)
        }else{
          throw res
        }
      })
    },

    getHotData({state,commit},date){
      return myAjax.get(getAdminUrl('/tbox/branch-free-car'), {
        s_time: date,
        city_id:state.city_id,
        uuid:state.uuid,
        sign:state.sign
      }).then(res=>{
        if(res.status === 0){
          commit('setHotData',res.data)
          return res.data
        }else{
          throw res
        }
      })
    },





    myAjax ({state, getters}, arg) {
      arg.url = arg.url.replace('https://admintest.likechuxing.com', 'https://admin.likechuxing.com')
      return myAjax.post(arg.url, Object.assign(getters.publicArguments, arg.data)).then(res => {
        if (res.status === 6001) {
          // 登录过期
          window.vue.$message('登录过期，请重新登录')
          throw {status: 6001}
        } else {
          return res
        }
      })
    },
    getCity({state, commit, dispatch}){
      return dispatch('myAjax', {
        url:getAdminUrl('/dispatch/demand-supply?type=city'),
        data:{}
      }).then(res=>{
        let list = res.data.filter(item=>item.id!=='1')
        commit('setCityList',list)
        //dispatch('setCurrentCity',res.data[res.data.length-1])
        dispatch('setCurrentCity',list[0])
      })
    },
    setCurrentCity({state, commit,dispatch},data){
      commit('setCurrentCity',data)
      dispatch('getCurrentData',data.id)
      mapControl.setCity([data.lng,data.lat])
    },
    getCurrentData ({state, commit, dispatch}, city_id) {
      return dispatch('myAjax', {
        url: getAdminUrl('/dispatch/demand-supply?type=data&city_id='+city_id),
        data: {}
      }).then(res => {
        if(res.data.data.length === 0){
          throw {status:1,msg:'车辆供应数据查询出错，请检查'}
        }
        if(res.data.heat_map.length === 0){
          throw {status:1,msg:'车辆需求预测查询出错，请检查'}
        }

        commit('setBranches',res.data.data)
        commit('setArea',res.data.heat_map)
        commit('control/setDataReady', true)

      })
    },
    getCurrentCars ({state, commit, dispatch}){
      return dispatch('myAjax', {
        url: getAdminUrl('/tbox/car-list'),
        data: {
          city_id: 197
        }
      }).then(res => {
        mapControl.drawHot(res.data)

      })
    }
  }
})

if (appArguments.uuid && appArguments.sign) store.commit('setUuid', appArguments)

export default store