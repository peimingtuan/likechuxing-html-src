/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/2-下午3:18
 Description:
 Demo:
 Others:
 *************************************************/
//require('../../../component/vconsole')
import Vue from 'vue'
import MainPage from './index.vue'

require('./css/style.less')
require('../../../component/rem')


new Vue({
  el:"#app",
  render: c => c(MainPage)
})