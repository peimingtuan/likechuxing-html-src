//require('../../../component/vconsole')
import Vue from 'vue'
import MainPage from './index.vue'
import router from './js/router'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/index.less')
require('../../../component/rem')
require('./js/umeng')

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  render: c => c(MainPage)
})
