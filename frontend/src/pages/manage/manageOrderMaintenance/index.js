/**
 * Created by Administrator on 2018/8/13.
 */
//require('../../../../other_modules/like-tool/vconsole')
import Vue from 'vue'
import '../../../../other_modules/like-manageOrder/css/public.css'
import '../../../component/rem'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

import App from './index.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import router from './js/router.js'
import store from './js/store'

//import './js/mock.js'

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  store,
  render: c => c(App)
});
