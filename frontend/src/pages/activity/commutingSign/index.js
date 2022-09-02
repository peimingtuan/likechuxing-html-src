/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: point
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/28-下午7:46
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Page from './index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import Umeng from '../../../component/umeng'
new Umeng(1274174742)
require('./css/common.less')
require('../../../component/rem')
Vue.use(likeBase)

//require('../../../component/vconsole')

new Vue({
  el:"#app",
  render: c => c(Page)
})