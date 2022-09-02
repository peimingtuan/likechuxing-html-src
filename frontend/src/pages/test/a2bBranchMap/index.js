/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: index
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-27-19:58
 * Description:
 *
 *************************************************/
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MainPage from './index.vue'

require('./css/common.less')

Vue.use(ElementUI);

window.vue = new Vue({
  el:"#app",
  render: c => c(MainPage)
})