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
  Input,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Button,
  DatePicker,
  Loading,
  Message,
} from 'element-ui';

Vue.use(Card);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(DatePicker);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

require('./css/common.less')

window.vue = new Vue({
  el:"#app",
  render: c => c(MainPage)
})