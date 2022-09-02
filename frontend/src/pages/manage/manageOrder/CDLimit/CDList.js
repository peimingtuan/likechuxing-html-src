//@xurr on 18/08/10  成都限行列表
require('../css/croReset.css')
require('../css/CDLimit/limitList.css')
//require('../../../../component/vconsole')
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import likeBase from '../../../../../other_modules/vue-plugins/like-base/index'
//import xurr from './xurr.vue'
import router from './CDListRouter.js'
import { Loadmore } from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
Vue.use(likeBase)
Vue.use(MintUI)
new Vue({
  el:"#app",
  router,
  render: c => c(App)
});