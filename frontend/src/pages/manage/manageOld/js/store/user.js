/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: user
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/26-下午4:13
 Description:
 Param:
 Return:
 *************************************************/
import {getManageUrl} from "../../../../../../other_modules/url-constructor";
import myAjax from '../../../../../../other_modules/like-request/withAxiosV2'
import UserData from '../userData'

let userData = new UserData()

export default {
  namespaced: true,
  state: {
    uuid: null,
    sign: null
  },
  mutations: {
    login(state,data){
      state.uuid = data.uuid
      state.sign = data.sign
    }
  },
  actions: {
    getCode({dispatch},phone){
      return dispatch('myAjax', {
        url:getManageUrl('/login/get-code'),
        data:{
          phone
        }
      },{root:true})
    },

    login({state,commit,dispatch},data){
      return dispatch('myAjax', {
        url:getManageUrl('/login/verify-code'),
        data
      },{root:true}).then(res=>{
        if(res.status === 0){
          commit('login',{
            uuid: res.data.uuid,
            sign: res.data.sign
          })

          // 数据存本地
          userData.save({
            uuid:res.data.uuid,
            sign:res.data.sign
          })

          // 兼容旧版，直接存字段 todo 全部升级后删除
          window.localStorage.setItem('uuid', res.data.uuid);
          window.localStorage.setItem('sign', res.data.sign);
        }else{
          throw res
        }
      })
    },

    logout({state,commit}){
      commit('login',{
        uuid: null,
        sign: null
      })

      userData.clear()

      // 删除旧版的登录记录 todo 全部升级后删除
      window.localStorage.removeItem('uuid');
      window.localStorage.removeItem('sign');
    }
  }
}