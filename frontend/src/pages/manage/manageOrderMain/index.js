//require('../../../../other_modules/like-tool/vconsole')
import Vue from 'vue'
import router from './js/router'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import MainPage from './index.vue'
import '../../../../other_modules/like-manageOrder/css/public.css'
import '../../../component/rem'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

import Loading from './components/loading/index.js'
Vue.use(Loading)

Vue.use(likeBase)

window.vue = new Vue({
  el: '#app',
  router,
  render: c => c(MainPage)
})

















