/**
 * Created by xurr on 2018/10/16.
 */
//require('../../../component/vconsole')

import '../../../../other_modules/like-manageOrder/css/public.css'
import '../../../component/rem'

import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import router from './js/router.js'

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  render: c => c(App)
});
