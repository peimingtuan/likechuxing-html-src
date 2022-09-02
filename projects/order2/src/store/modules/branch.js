/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: branch
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/17-下午4:54
 Description:
 Param:
 Return:
 *************************************************/
import myAjax from '../../common/myAjax'
import API from '../../common/apiAddress'
import Car from '../../common/class/Car'
import {Alert, Loading, Toast} from '../../../other_modules/vue-plugins/like-base'
import Gps2distance from '../../common/gps2distance'
import Err from '../../common/class/Err'

const gps2distance = new Gps2distance()

export default {
  namespaced: true,
  state: {
    city_icon: [],
    chose_city_id: 0,
    flag_poi: null,
    branch_list: [],
    active_branch: null,
    end_branch: null,
    car_list: [],
    active_car: null
  },
  getters: {
    branch_list_nearby: (state, getters, rootState, rootGetters) => {
      let target_poi = state.flag_poi === null ? rootGetters['user/user_poi'] : state.flag_poi
      return state.branch_list.filter(item => gps2distance.distance([[item.lng, item.lat], target_poi.getLngLat()]) <= 5)
    },
    parking_fee: state => {
      return state.active_car ? state.active_car.parking_fee : 0
    },
    balance_refund: state => {
      return state.active_car > 0 ? state.active_car.balance_refund : 0
    }
  },
  mutations: {
    branchChosenClear(state) {
      state.active_branch = null
      state.car_list = []
      state.active_car = null
    },
    setChoseCity(state, id) {
      state.chose_city_id = id
    },
    setCityIcon(state, data) {
      state.city_icon = data
    },
    setBranchList(state, list) {
      state.branch_list = list
    },
    setFlagLoc(state, poi) {
      state.flag_poi = poi
    },
    setStartBranch(state, branch) {
      state.active_branch = branch
    },
    setCarList(state, list) {
      state.car_list = list
    },
    setEndBranch(state, end_branch) {
      state.end_branch = end_branch
    },
    setActiveBranch(state, active_branch) {
      state.active_branch = active_branch
    },
    setActiveCar(state, active_car) {
      state.active_car = active_car
    },
    set: (state, data) => {
      for (let key in data) {
        state[key] = data[key]
      }
    }
  },
  actions: {
    getCityIcon(store) {
      return myAjax.postV2(API.city.icon).then(res => {
        if (res.status === 0) {
          store.commit('setCityIcon', res.data)
          return res.data
        } else {
          throw new Err(res)
        }
      })
    },
    getBranchList(store, data) {
      return myAjax.postV2(API.branch.list, data).then(res => {
        if (res.status === 0) {
          store.commit('setBranchList', res.data)
          return res.data
        } else {
          throw res
        }
      })
    },
    /* updateActiveBranch(store, branch) {
       return new Promise(resolve => {
         store.commit('set', {
           active_branch: branch
         })
         resolve()
       })
     },*/
    updateEndBranch(store, branch) {
      store.commit('set', {
        end_branch: branch
      })
    },
    getCarList(store) {
        return myAjax.postV2(API.car.list, {
          begin_branch_id: store.state.active_branch.id
        }).then(res => {
          if(res.status === 0){
            let car_list = res.data.map(item => new Car(item))
            store.commit('setCarList', car_list)
            store.commit('setActiveCar',car_list[0])
          }else if(res.status === 1012){
            store.commit('setCarList', [])
            store.commit('setActiveCar',null)
            Toast(res.msg)
          }else{
            throw res
          }
      })
    }
  }
}
