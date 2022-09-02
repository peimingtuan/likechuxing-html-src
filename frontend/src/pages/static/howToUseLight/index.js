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
import Vue from 'vue'
import MainPage from './index.vue'
//import '../../../component/vconsole'

require('../../../component/rem')

new Vue({
  el:"#app",
  render: c => c(MainPage)
})
