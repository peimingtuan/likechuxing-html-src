/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: store
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/20-下午2:49
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import {Toast} from '../../../../../other_modules/vue-plugins/like-base/index'
import wxShare from './thisWxShare'
import {getH5Url} from "../../../../../other_modules/url-constructor";
import {umeng} from "./umeng";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    shareKey: '',
    open_id: '',
    phone: '',
    list:[],
    coupon_list:[],
    msg:"",
    // uuid:"",
    inviteCode:'',
  },
  mutations: {
    // 存下红包id和open_id
    setBase (state, data) {
      state.shareKey = data.shareKey
      state.open_id = data.open_id
    },

    // 更新手机号
    setPhone (state, data){
      state.phone = String(data)
    },

    // 更新list
    setList (state, list){
      state.list = list
    },

    // setUser (state,uuid){
    //   state.uuid = uuid;
    // },

    setInviteCode (state,inviteCode){
      state.inviteCode = inviteCode;
    },

    // 我获得的优惠券
    setCouponList(state, data){
      let list = [
        {
          name:data.my_coupon.coupon_name,
          coupon_value:data.my_coupon.coupon_value,
          desc:[data.my_coupon.use_condition, data.my_coupon.valid_desc],
        }
      ]

      if(data.extra_coupon && Object.keys(data.extra_coupon).length>0) {
        list.push({
          name: data.extra_coupon.coupon_name,
          coupon_value: data.extra_coupon.coupon_value,
          desc: [data.extra_coupon.use_condition, data.extra_coupon.valid_desc],
        })
      }
      if(data.new_user_coupon && Object.keys(data.new_user_coupon).length>0) {
        list.push({
          name: data.new_user_coupon.coupon_name,
          coupon_value: data.new_user_coupon.coupon_value,
          desc: [data.new_user_coupon.use_condition, data.new_user_coupon.valid_desc],
        })
      }

      state.coupon_list = list
    },
  },
  actions: {
    handleGetCoupon({commit},res){      
      if(res.data.share_info)wxShare(res.data.share_info)

      if(res.data.phone_no)commit('setPhone',res.data.phone_no)

      // if(res.data.uuid) commit('setUser',res.data.uuid)

      if(res.data.share_code) commit('setInviteCode',res.data.share_code)

      if(res.data.my_coupon)commit('setCouponList',res.data)

      if(res.data.coupon_list)store.commit('setList',res.data.coupon_list)

      switch (Number(res.status)){

        case 1101:
          // 红包过期
          router.replace({
            path:'/fail',
            query:{
              type:1
            }
          })
          break;

        case 1100:
        case 1102:
          // 未登录
          router.replace({
            path:'/login'
          })
          break;

        case 1103:
          // 当前用户领取次数抵达上限
          router.replace({
            path:'/fail',
            query:{
              type:2
            }
          })
          break;

        case 1104:
          // 红包都领完了
          router.replace({
            path:'/fail',
            query:{
              type:3
            }
          })
          break;

        default:
          if(res.status === 0){
            router.replace({
              path:'/finish',
            })
            if(res.msg ==="您已经领取过该红包"){
              Toast(res.msg)
            }
          }else{
            Toast(res.msg)
          }
      }
    },

    toInviteCode(){
      umeng.addEvent(['finish','invite']).then(()=>{
        window.location.href = getH5Url('/app/inviteCode?channel=0_9138'+ '&code='+this.state.inviteCode +'&mobile='+this.state.phone)
      })
    }
  }
})

export default store