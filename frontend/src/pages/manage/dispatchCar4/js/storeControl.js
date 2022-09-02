/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: storeControl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/8-上午11:34
 Description:
 Param:
 Return:
 *************************************************/
export default {
  namespaced: true,
  state: {
    currentType:0,
    dataReady:false
  },
  mutations: {
    setCurrentType(state,type){
      state.currentType = type
    },
    setDataReady(state,able){
      state.dataReady = able
    }
  },
  actions: {

  }
}