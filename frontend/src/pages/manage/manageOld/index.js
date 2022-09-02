/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index1.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/14-下午6:13
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import MainPage from './pages/index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import store from './js/store/'
import router from './js/router'
import { Switch, Pagination } from 'element-ui';
import 'element-ui/lib/theme-chalk/switch.css';
import 'element-ui/lib/theme-chalk/pagination.css';
import 'element-ui/lib/theme-chalk/icon.css';

require('./css/common.less')
require('../../../component/rem')
require('../../../css/buttons/button-v2.less')

Vue.use(Switch)
Vue.use(Pagination)
Vue.use(likeBase)

window.vue = new Vue({
  el:"#app",
  store,
  router,
  render: c => c(MainPage)
})