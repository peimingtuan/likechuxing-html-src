/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: index
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-27-19:58
 * Description:
 *
 *************************************************/
import Vue from 'vue'
import MainPage from './index.vue'
import {
  Card,
  Checkbox,
  CheckboxGroup
} from 'element-ui';

Vue.use(Card);

Vue.use(Checkbox);
Vue.use(CheckboxGroup);


require('./css/common.less')

window.vue = new Vue({
  el:"#app",
  render: c => c(MainPage)
})