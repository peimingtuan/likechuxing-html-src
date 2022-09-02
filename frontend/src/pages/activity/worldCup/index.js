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
import Umeng from '../../../component/umeng'
new Umeng(1274059481)
require('./css/common.less')
require('../../../component/rem')
Vue.use(likeBase)

//require('../../../component/vconsole')

new Vue({
  el:"#app",
  render: c => c(MainPage)
})


