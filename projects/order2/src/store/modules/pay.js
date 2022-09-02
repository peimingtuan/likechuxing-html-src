/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: pay
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/25-下午12:37
 Description:
 Param:
 Return:
 *************************************************/
import myAjax from '../../common/myAjax'
import API from '../../common/apiAddress'
import Order from '../../common/class/Order'

export default {
  namespaced: true,
  state: {
    rental_no: '',
    order: null,
    user_chosen_coupon_id: 0,
    user_chosen_coupon_value: '0.00'
  },
  mutations: {
    setRentalNo(state, no) {
      state.rental_no = no
    },
    setOrder(state, order) {
      state.order = order
    },
    setUserChosenCoupon(state, coupon) {
      state.user_chosen_coupon_id = coupon.id
      state.user_chosen_coupon_value = coupon.value
    }
  },
  actions: {
    setRentalNo(store, no) {
      store.commit('setRentalNo', no)
    },
    getRentalDetail(store) {
      return myAjax.postV2(API.user.rentalDetail, {
        rental_no: store.state.rental_no
      }).then(res => {
        if (res.status !== 0) {
          throw res
        } else {
          store.commit('setOrder', new Order(res.data))
        }
      })
    },
    /*    getCurrentExpense(store){
          return new Promise((resolve,reject)=>{
            myAjax.post(API.rental.currentExpense).then(res=>{
              store.commit('setOrder', new Order(res.data))
              resolve()
            })
          })
        },*/
    confirm(store, data) {
      return myAjax.postV2(API.rental.confirmOrder, data).then(res => {
          return res
      })
    }
  }
}
