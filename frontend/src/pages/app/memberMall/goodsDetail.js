/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: goodsDetail
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/19-上午10:26
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import GoodsDetail from './goodsDetail.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/common/reset.css')
require('../../../component/rem')

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(GoodsDetail)
})
 