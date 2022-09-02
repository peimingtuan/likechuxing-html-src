import './js/rem'

import Vue from 'vue'
import './css/reset.css'
import App from './app.vue'

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI)

import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});

new Vue({
  el:"#app",
  render: c => c(App)
});
