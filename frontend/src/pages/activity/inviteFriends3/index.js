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
import Vue from 'vue'
import MainPage from './index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/index.less')
require('./js/common')

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(MainPage)
})


