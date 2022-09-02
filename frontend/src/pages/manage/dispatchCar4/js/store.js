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
import {getAdminUrl} from "../../../../../other_modules/url-constructor/index";
import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
import Area2 from './area2.class'
import mapControl from './mapControl'

import control from './storeControl'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    control
  },

  state: {
    uuid: '',
    sign: '',
    city_list:[],
    currentCity:{},
    area:null,
    branches:[],

    currentRect:null
  },
  mutations: {
    setUuid (state, data) {
      state.uuid = data.uuid
      state.sign = data.sign
    },
    setBranches(state, branches){
      state.branches = branches
    },
    setCurrentRect (state, item){
      if(item){
        state.currentRect = item
      }else{
        state.currentRect = null
      }
    },
    setCityList(state,data){
      state.city_list = data
    },
    setCurrentCity(state,city){
      state.area = new Area2({
        lng:city.lng,
        lat:city.lat
      })
      state.currentCity = city
    },
    setArea(state,heatmap){
      heatmap.forEach(item=>{
        state.area.push(item)
      })

      state.area.loadSupply(state.branches)

      mapControl.drawArea(state.area,this.state.control.currentType)
    }
  },
  getters: {
    // 公共参数
    publicArguments (state) {
      let data = {}
      if (state.uuid) {
        data.uuid = state.uuid
        data.sign = state.sign
      }
      return data
    }
  },
  actions: {
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
        commit('setArea',res.data.heat_map.map(item=>{
          item.need = Math.round(item.need)
          return item
        }))
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