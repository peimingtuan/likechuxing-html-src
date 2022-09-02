/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: dispatchOutStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/18-下午2:52
 Description:
 Param:
 Return:
 *************************************************/
/**
 * Created by garvey on 2017/6/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import POI from '../../js/class/POI'
import Branch from '../../js/class/Branch'
import Car from '../../js/class/Car'

import myAjax from '../../../../../../other_modules/like-request/withAxiosV2'
import {getApiUrl} from "../../js/getApiUrl";
import arguAppend from '../../js/arguAppend'
import Gps2distance from '../../js/gps2distance'

const gps2distance = new Gps2distance()

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    uuid: '',
    sign: '',
    user_lng: '',
    user_lat: '',
    city_id:'',

    // 限行区内网点列表
    branches_in:[],
    // 限行区外网点列表
    branches_out:[],
    // 当前选中(放大)的网点
    branch_start:null,
    branch_end:null,

    cars:[],
    car_current:null,

    // 地图中心经纬度
    mapCenter:null,
    // 还车网点页地图中心
    mapCenterEndBranch:null,
    //防止按钮多次点击
    isPost:false
  },
  getters:{
    user_poi (state) {
      return new POI(state.user_lng, state.user_lat)
    },
    // 地图中心（大头针）附近5公里网点
    branch_in_list_nearby(state){
      return state.branches_in.filter(item => {
        return gps2distance.distance([[item.lng, item.lat], state.mapCenter.getLngLat()]) <= 5})
    },
    branch_out_list_nearby(state){
      return state.branches_out.filter(item => {
        return gps2distance.distance([[item.lng, item.lat], state.mapCenter.getLngLat()]) <= 5})
    },
    // 底部按钮状态值
    bottomBarType(state){
      if(state.branch_start){
        return Number(state.branch_start.car_cnt)>0 ? 2 : 1
      }else{
        return 0
      }
    },

    // 取还车网点数据
    majorBoxData(state){
      return {
        branch_start:state.branch_start,
        branch_end:state.branch_end,
        car_list:state.cars,
        car_current:state.car_current
      }
    }
  },
  mutations: {
    setBase(state,data){
      state.uuid = data.uuid
      state.sign = data.sign
      state.user_lng = data.user_lng
      state.user_lat = data.user_lat
      state.city_id = data.city_id
      state.mapCenter = data.mapCenter
    },

    setUserLngLat(state,data){
      state.user_lng = data.user_lng
      state.user_lat = data.user_lat
    },

    setBranchesIn(state,list){
      state.branches_in = list
    },
    setBranchesOut(state,list){
      state.branches_out = list
    },
    setBranchStart(state,branch){
      state.branch_start = branch
    },
    setBranchEnd(state,branch){
      state.branch_end = branch
    },

    setCars(state,list){
      state.cars = list
    },
    setCarCurrent(state,car){
      state.car_current = car
    },

    setMapCenter(state,poi){
      state.mapCenter=poi
    },

    setMapCenterEndBranch(state,poi){
      state.mapCenterEndBranch = poi
    },
    setIsPost(state,isPost){
      state.isPost = isPost
    },
  },
  actions:{
    getBranchesIn({commit}){
      return myAjax.post(getApiUrl('/branch/appoint-list'), arguAppend({
        area:1,
        direction:2
      })).then(res => {
        if (res.status === 0) {
          // 用自定义的model包一下branch
          commit('setBranchesIn',res.data.map(item=>new Branch(item)))
        } else {
          throw res
        }
      })
    },
    getBranchesOut({commit}){
      return myAjax.post(getApiUrl('/branch/appoint-list'), arguAppend({
        area:2,
        direction:2
      })).then(res => {
        if (res.status === 0) {
          // 用自定义的model包一下branch
          commit('setBranchesOut',res.data.map(item=>new Branch(item)))
        } else {
          throw res
        }
      })
    },
    getCars({commit},begin_branch_id){
      return myAjax.post(getApiUrl('/car/appoint-list'), arguAppend({
        begin_branch_id,
        transfer:1
      })).then(res => {
        if (res.status === 0) {
          // 用自定义的model包一下car
          commit('setCars',res.data.map(item=>new Car(item)))
        } else {
          throw res
        }
      })
    },
    orderCar({state,commit},data){
      let {isPost} = state;
      if(isPost) return
      commit('setIsPost',true)
      // 限行区内往限行区外调车下单
      return myAjax.post(getApiUrl('/rental/create'), arguAppend({
        begin_branch_id:data.begin_branch_id,
        end_branch_id:data.end_branch_id,
        price_km:data.price_km,
        price_min:data.price_min,
        price_extra:data.price_extra,
        car_id:data.car_id,
        source:1,
        booking_type:1
      })).then(res => {
        if (res.status === 0) {
          return res
        } else {
          commit('setIsPost',false)
          throw res
        }
      })
    }
  }
})

export default store
