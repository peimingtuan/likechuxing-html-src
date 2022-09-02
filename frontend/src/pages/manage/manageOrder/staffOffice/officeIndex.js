//@xurr on 18/06/26 事故管理
require('../css/croReset.css')
require('../css/staffOffice/officeIndex.css')
//require('../../../../component/vconsole')
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import likeBase from '../../../../../other_modules/vue-plugins/like-base/index'
//import xurr from './xurr.vue'
import router from './officeIndexRouter.js'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
Vue.use(likeBase)
new Vue({
  el:"#app",
  router,
  render: c => c(App)
});