import './js/rem'
import '../../../../other_modules/like-manageOrder/css/public.css'
import Vue from 'vue'
import './css/reset.css'
import App from './app.vue'
import router from './router'
import store from './store/index.js'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

import Loading from './components/loading/index.js'
Vue.use(Loading)

import { DDBase,DD } from '../../../../other_modules/like-manageOrder/ddSDK'
Vue.prototype.$DDBase = DDBase
Vue.prototype.$DD = DD

// require('../../../component/vconsole')

import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});

new Vue({
  el:"#app",
  router,
  store,
  render: c => c(App)
});
