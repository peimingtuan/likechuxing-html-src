//@xurr on 18/06/07 车辆问题记录单
require('../css/croReset.css')
require('../css/carProblemsList/proOrder.css')
//require('../../../../component/vconsole')
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import likeBase from '../../../../../other_modules/vue-plugins/like-base/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import xurr from './xurr.vue'
import router from './proOrderRouter.js'
Vue.use(likeBase)
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});

new Vue({
  el:"#app",
  router,
  render: c => c(App)
});