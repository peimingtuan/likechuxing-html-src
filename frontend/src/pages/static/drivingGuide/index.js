/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/3-下午1:41
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.less')

import Vue from 'vue'
import MainPage from './index.vue'
import router from './js/router'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/index.less')
require('../../../component/rem')

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  render: c => c(MainPage)
})