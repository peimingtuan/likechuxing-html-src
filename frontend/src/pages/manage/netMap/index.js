/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carlist
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/24-上午11:43
 Description:
 Param:
 Return:
 *************************************************/
require('./js/mock')
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import MainPage from './index.vue'
import store from './js/store'
import router from './js/router'

require('./css/common.less')

Vue.use(ElementUI)

window.vue = new Vue({
  el:"#app",
  store,
  router,
  render: c => c(MainPage)
})