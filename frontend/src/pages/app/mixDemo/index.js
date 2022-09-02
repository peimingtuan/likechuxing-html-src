/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index1.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/5-下午1:23
 Description:
 Param:
 Return:
 *************************************************/
require('../../../component/vconsole')
import Vue from 'vue'
import App from './index.vue'
import router from './router'

let vm = new Vue({
  el: '#app',
  router,
  //store,
  template: '<App/>',
  components: {App}
})