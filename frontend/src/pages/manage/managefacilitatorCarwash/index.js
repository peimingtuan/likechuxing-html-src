//require('../../../component/vconsole')
import './css/public.css'
import './js/rem'
import Vue from 'vue'
import router from './js/router'
import MintUI  from 'mint-ui'
require('mint-ui/lib/style.css')
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import App from './App.vue'
Vue.use(MintUI);
Vue.use(likeBase)
window.vue = new Vue({
  el: '#app',
  router,
  render: c => c(App)
})








