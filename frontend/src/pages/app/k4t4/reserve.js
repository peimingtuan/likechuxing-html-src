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
import { Picker } from 'mint-ui'
import 'mint-ui/lib/style.css'
import router from './js/router/reserveRouter'
import MainPage from './reserve.vue'
import store from './js/store/reserveStore'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import Umeng from '../../../component/umeng'
new Umeng(1274288625)
require('./css/common.less')
require('../../../component/rem')
require('../../../css/buttons/button-v2.less')

Vue.use(likeBase)
Vue.component(Picker.name, Picker);

new Vue({
  el:"#app",
  router,
  store,
  render: c => c(MainPage)
})