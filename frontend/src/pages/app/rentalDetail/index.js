//require('../../../component/vconsole')
import Vue from 'vue'
import MainPage from './index.vue'
import router from './js/router'
import store from './js/store'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/index.less')
require('../../../component/rem')

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  store,
  render: c => c(MainPage)
})