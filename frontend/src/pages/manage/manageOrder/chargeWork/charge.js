//require('../../../../component/vconsole')
require('../css/public.css')
require('../css/chargeWork/charge.css')
import Vue from 'vue'
import App from './App.vue'
import router from './chargeRouter.js'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
new Vue({
  el:"#app",
  router,
  render: c => c(App)
});