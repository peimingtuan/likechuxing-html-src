/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carlist
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/24-上午11:43
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import MainPage from './pages/carList.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

import { Switch} from 'element-ui';
import 'element-ui/lib/theme-chalk/switch.css';

require('../manageOld/css/common.less')
require('../../../component/rem/index')
require('../../../css/buttons/button-v2.less')

Vue.use(Switch)
Vue.use(likeBase)

window.vue = new Vue({
  el:"#app",
  render: c => c(MainPage)
})