/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-上午10:35
 Description:
 Param:
 Return:
 *************************************************/
//require('../../../component/vconsole')
//require('./js/mock.js')
import Vue from 'vue'
import router from './js/router'
import store from './js/store'
import MainPage from './index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('../../../component/rem')
require('./css/index.less')

Vue.use(likeBase)

new Vue({
  el: '#app',
  router,
  store,
  render: c => c(MainPage)
})
