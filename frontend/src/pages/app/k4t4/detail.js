/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: detail
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/27-下午4:43
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import MainPage from './pages/dispatchDetail.vue'
import Umeng from '../../../component/umeng'
new Umeng(1274288625)

require('./css/common.less')
require('../../../component/rem')

new Vue({
  el:"#app",
  render: c => c(MainPage)
})