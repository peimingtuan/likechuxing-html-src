//@xurr on 18/06/07 车辆问题记录单
require('./css/croReset.css')
require('./css/carProblemsList/proOrder.css')
import '../../../../other_modules/like-manageOrder/css/public.css'
import '../../../component/rem'
//require('../../../component/vconsole')

import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import router from './js/proOrderRouter.js'

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  render: c => c(App)
});
