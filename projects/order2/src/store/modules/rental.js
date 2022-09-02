/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: rental
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/23-下午8:21
 Description:
 Param:
 Return:
 *************************************************/
import Rental from '../../common/class/Rental'
import myAjax from '../../common/myAjax'
import API from '../../common/apiAddress'
import format from '../../common/Format'
import Alert3001 from '../../../other_modules/vue-popMessage/Alert3001'
import {Alert, Loading, Toast} from '../../../other_modules/vue-plugins/like-base'

export default {
  namespaced: true,
  state: {
    // 0未下单，1：已下单，2：已计费，3：已开门
    step: 0,
    rental: null,
    coupon_cnt: 0,
    count: 0,
    fee: 0,
    reasons: [],

    autoRefresh: false,
    next_refresh_trick: null,

    detail: null,

    check_end_branch_id: 0,
    check_end_branch_name: '',
    check_end_branch_address: '',
  },
  getters: {
    total_time_during(state) {
      return state.rental ? format.during(state.rental.total_time) : '0 分钟'
    }
  },
  mutations: {
    clear(state){
      state.step = 0
      state.rental = null
    },
    setCheckEndBranch(state, endBranch) {
      state.check_end_branch_id = endBranch.branch_id
      state.check_end_branch_name = endBranch.branch_name
      state.check_end_branch_address = endBranch.branch_address
    },
    updateRentalStep(state, step) {
      state.step = step
    },
    updateRental(state, rental) {
      state.rental = rental
    },
    setDetail(state, data) {
      state.detail = data
    },
    remainCancel(state, data) {
      state.coupon_cnt = data.coupon_cnt
      state.count = data.count
      state.fee = data.fee
      // 过滤掉'其它'
      state.reasons = data.reasons.filter(item => item.id !== 100)
    },
    startAuto(state, trick) {
      state.autoRefresh = true
      state.next_refresh_trick = trick
    },
    stopAuto(state) {
      state.autoRefresh = false
      clearTimeout(state.next_refresh_trick)
      state.next_refresh_trick = null
    }
  },
  actions: {
    // 创建新订单
    create(store) {
      let data = {
        begin_branch_id: store.rootState.branch.active_branch.id,
        price_km: store.rootState.branch.active_car.price_km,
        price_min: store.rootState.branch.active_car.price_min,
        price_extra: store.rootState.branch.active_car.price_extra,
        car_id: store.rootState.branch.active_car.id,
        // 下单来源：h5
        source: 1,
        agent: navigator.userAgent.replace(/\s/g, '')
      }
      store.rootState.branch.end_branch && (data.end_branch_id = store.rootState.branch.end_branch.id)

      return new Promise((resolve, reject) => {
        myAjax.postV2(API.rental.create, data).then((res) => {
          if (res.status === 0) {
            store.dispatch('getCurrentInfo').then(() => {
              resolve()
            })
          } else {
            switch (res.status) {
              case 3001:
                Alert3001({
                  msg: '因您有<span class="warn">' + res.data.reason + '</span>行为，当前账号无权进行该操作'
                })
                break;
              case 1007:
                Alert({
                  title: '提示',
                  msg: '您有' + res.data.cnt + '条违章，请下载APP进行处理'
                })
                break;
              case 1008:
                Alert({
                  title: '提示',
                  msg: '您有' + res.data.cnt + '条缴费单，请下载APP进行处理'
                })
                break;
              default:
                Toast(res.msg)
            }
            reject()
          }
        })
      })
    },

    // 获取当前订单详情
    getCurrentInfo(store) {
      return myAjax.postV2(API.rental.currentInfo).then(res => {
        if (res.status === 0) {
          let rental = new Rental(res.data)
          store.commit('updateRental', rental)
          store.commit('updateRentalStep', rental.getStep())
          if (rental.getStep() > 2) {
            SDK.setWindowTitle('当前行程')
          }

          store.commit('branch/setActiveCar', rental.car, {root: true})
          store.commit('branch/setActiveBranch', rental.begin_branch, {root: true})
          store.commit('branch/setEndBranch', rental.end_branch, {root: true})
        } else {
          throw res
        }
      })
    },

    startAuto(store) {
      return new Promise(resolve => {
        if (store.state.next_refresh_trick) {
          store.commit('stopAuto')
        }
        store.dispatch('user/location', null, {root: true}).then(() => {
          resolve()
          rentalMap.drawUserLoc(store.rootGetters['user/user_poi'])
        })
        store.dispatch('getCurrentInfo')

        store.commit('startAuto', setTimeout(function () {
          store.dispatch('startAuto')
        }, 60000))
      })

    },

    stopAuto(store) {
      store.commit('stopAuto')
    },

    // 获取当前可取消状态
    getRemainCancel(store) {
      return myAjax.postV2(API.rental.remainCancelTime).then(res => {
        if (res.status !== 0) {
          throw res
        } else {
          store.commit('remainCancel', res.data)
        }
      })
    },

    // 修改还车网点
    modifyEndBranch(store, end_branch) {
      return myAjax.postV2(API.branch.modifyEndBranch, {
        end_branch_id: end_branch.id
      }).then(res => {
        if (res.status !== 0) throw res
      })
    },

    findCar() {
      let loading = Loading({title: '寻车中...'})
      return myAjax.postV2(API.rental.findCar).then(res => {
        if (res.status === 0) {
          Toast('寻车成功请注意寻找')
        } else {
          Toast('寻车失败')
        }
        loading.close()
      }).catch(err => {
        loading.close()
      })
    },

    openDoor() {

      return myAjax.postV2(API.rental.openDoor).then(res => {
        if (res.status === 0) {
          Toast('开门成功')
        } else {
          Toast('开门失败')
        }
      })
    },

    lockDoor() {
      return myAjax.postV2(API.rental.lockDoor).then(res => {
        if(res.status === 0){
          Toast('锁门成功')
        }else{
          throw res
        }
      })
    },

    getDetail({dispatch, commit, state}, data) {
      return new Promise(resolve => {
        myAjax.postV2(API.rentalHistory.detail, {
          rental_no: data.rental_no
        }).then(res => {
          if (res.status === 0) {
            commit('setDetail', res.data)
            resolve()
          } else {
            Toast(res.msg)
          }
        })
      })
    }
  }
}
