//@xurr on 18/09/04  统计报表
require('./css/croReset.css')
require('./css/formIndex.css')
//require('../../../../component/vconsole')
import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import router from './js/router.js'
import { Loadmore } from 'mint-ui';
import ChartPreview from './js/chartPreview/index.js'
//引入图表主题
import './js/macarons'
Vue.component(Loadmore.name, Loadmore);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});

import store from './store/index'

Vue.use(likeBase)
Vue.use(MintUI)
Vue.use(ChartPreview)
new Vue({
  el:"#app",
  router,
  store,
  render: c => c(App)
});








