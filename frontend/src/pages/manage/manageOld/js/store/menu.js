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
import UserData from '../userData'

let userData = new UserData()

export default {
  namespaced: true,
  state: {
    cityList:[],
    menu:[],
    city_id: userData.state.city_id || 0,
    city_name: '全国',
  },
  getters: {

  },
  mutations: {
    setList(state,data){
      state.cityList = data.city
      state.menu = data.list
    },
    setCity(state,city_id){
      state.city_id = city_id

      // 存本地
      userData.save({
        city_id
      })

      // 兼容旧版 todo 全部升级后删除
      window.localStorage.setItem('city_id', city_id);
    }
  },
  actions: {
    getList({dispatch,commit}){
      return dispatch('myAjax', {
        url:getManageUrl('/menu/list'),
        data:{}
      },{root:true}).then(res=>{
        if(res.status === 0){
          commit('setList',res.data)
        }else{
          throw res
        }
      })
    },
    getCarInfo({dispatch,rootGetters}, car_info){
      return dispatch('myAjax', {
        url:getManageUrl('/car/search'),
        data:{
          car_info
        }
      },{root:true})
    },
    carAlarm({dispatch}, car_info){
      return dispatch('myAjax', {
        url:getManageUrl('/car/whistle'),
        data:{
          car_info
        }
      },{root:true})
    },
    carFlash({dispatch}, car_info){
      return dispatch('myAjax', {
        url:getManageUrl('/car/flash-light'),
        data:{
          car_info
        }
      },{root:true})
    },
    carOpen({dispatch}, car_info){
      return dispatch('myAjax', {
        url:getManageUrl('/car/open-door'),
        data:{
          car_info
        }
      },{root:true})
    },
    carLock({dispatch}, car_info){
      return dispatch('myAjax', {
        url:getManageUrl('/car/close-door'),
        data:{
          car_info
        }
      },{root:true})
    },
    carSynSoc({dispatch}, car_info){
      return dispatch('myAjax', {
        url:getManageUrl('/car/syn-soc'),
        data:{
          car_info
        }
      },{root:true})
    }
  }
}