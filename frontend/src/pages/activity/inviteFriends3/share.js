/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: share.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/9-上午10:33
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import SharePage from './share.vue'

require('./css/share.less')
require('./js/common')

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(SharePage)
})