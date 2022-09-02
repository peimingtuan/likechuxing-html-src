/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: license
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/28-下午1:49
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import LicensePage from './license.vue'

require('./css/license.less')
require('./js/common')

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(LicensePage)
})