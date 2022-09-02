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
import Utils from '../../js/utils'

import myAjax from '../../../../../../other_modules/like-request/withAxiosV2'
import {getApiUrl} from "../../js/getApiUrl";
import arguAppend from '../../js/arguAppend'
import Gps2distance from '../../js/gps2distance'
import { Loading } from '../../../../../../other_modules/vue-plugins/like-base/'

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
    car_current_id:'',
    carInfo:{},

    // 地图中心经纬度
    mapCenter:null,
    // 还车网点页地图中心
    mapCenterEndBranch:null,

    //是否已经触发了提交预订订单的
    isPost:false,
    isOrder:false,
    isCancel:false,

    bookTime :'',
    //已预订的信息
    bookInfo:{},
    isArrived:false
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
        return  2 
      }else{
        return 0
      }
    },

    // 取还车网点数据
    majorBoxData(state){
      return {
        branch_start:state.branch_start,
        branch_end:state.branch_end,
        car_list:[1]
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

    setBookTime(state,bookTime){
        state.bookTime = bookTime
    },

    setBookInfo(state,bookInfo){
       state.bookInfo = bookInfo    
    },
    setIsArrived(state,isArrived){
      state.isArrived = isArrived
    },
    setCurrentCar(state,info){
        state.car_current_id = info.id
        state.carInfo = info
    },
    setIsPost(state,isPost){
      state.isPost = isPost
    },
    setIsOrder(state,isOrder){
      state.isOrder = isOrder
    },
    setIsCancel(state,isCancel){
      state.isCancel = isCancel
    }
  },
  actions:{
    getBranchesIn({commit}){
      return myAjax.post(getApiUrl('/branch/appoint-list'), arguAppend({
        area:1,
        direction:1
      })).then(res => {
        if (res.status === 0) {
          // 用自定义的model包一下branch
          let data = Utils.removeCarCnt(res.data);
          commit('setBranchesIn',data.map(item=>new Branch(item)))
        } else {
          throw res
        }
      })
    },
    getBranchesOut({commit}){
      return myAjax.post(getApiUrl('/branch/appoint-list'), arguAppend({
        area:2,
        direction:1
      })).then(res => {
        if (res.status === 0) {
          // 用自定义的model包一下branch
          let data = Utils.removeCarCnt(res.data,true);
          console.log(data)
          commit('setBranchesOut',data.map(item=>new Branch(item)))
        } else {
          throw res
        }
      })
    },
    orderCar({state,commit}){
        let { branch_start, branch_end, bookTime, isPost } = state
        let options = {
            begin_branch_id:branch_start.id,
            end_branch_id:branch_end.id,
            booking_time:bookTime,
            source:1,
            booking_type:2
        }
        if(isPost) return
        commit('setIsPost',true)
        const loading = Loading('预定中')
        return myAjax.post(getApiUrl('/rental-booking/create'), arguAppend(options))
          .then(res=>{
            loading.close()
            return res
          })
          .catch(err=>{
            loading.close()
          })
    },
    getBookInfo({commit}){
        return myAjax.post(getApiUrl('/rental-booking/info'), arguAppend()).then(res=>{
            if(res.status===0){
                let isArrived = res.data.car_list.length?true:false
                commit('setBookInfo',res.data)
                commit('setIsArrived',isArrived)
            }
        }).catch(err=>{
          console.log(err)
        })
    },
    order({state,commit},data){ 
      let { isOrder } = state;
      if(isOrder) return
      commit('setIsOrder',true)
      return myAjax.post(getApiUrl('/rental/create'), arguAppend({
        begin_branch_id:data.begin_branch_id,
        end_branch_id:data.end_branch_id,
        price_km:data.price_km,
        price_min:data.price_min,
        price_extra:data.price_extra,
        car_id:data.car_id,
        source:1,
        booking_type:2
      })).then(res => {
        if (res.status === 0) {
          return res
        } else {
          commit('setIsOrder',false)
          throw res
        }
      })
    },
    cancelBook({state,commit},data){ 
      let { isCancel } = state;
      if(isCancel) return
      commit('setIsCancel',true)
      return myAjax.post(getApiUrl('/rental-booking/cancel'), arguAppend()).then(res => {
        if (res.status === 0) {
          return res
        } else {
          throw res
        }
      })
    }
  }
})

export default store
