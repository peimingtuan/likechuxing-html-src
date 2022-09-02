/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/2-下午5:43
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import MainPage from './index.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import store from './js/store'

require('./css/common.less')
require('../../../css/buttons/button-v2.less')

Vue.use(ElementUI)

window.vue = new Vue({
  el:"#app",
  store,
  render: c => c(MainPage)
})