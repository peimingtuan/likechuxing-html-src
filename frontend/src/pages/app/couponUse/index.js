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
import MainPage from './index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/style.less')
require('../../../component/rem')
require('../../../component/vconsole')

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(MainPage)
})