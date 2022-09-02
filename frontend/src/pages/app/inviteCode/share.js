/**
 * Created by garvey on 2017/9/12.
 */
import Vue from 'vue'
import router from './js/router_share'
import MainPage from './share.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import wxShare from './js/thisWxShare'
import Umeng from '../../../../other_modules/like-tool/Umeng'

new Umeng(1275550086)
wxShare()
require('./css/index.less')
require('../../../component/rem')

Vue.use(likeBase)

new Vue({
  el:"#app",
  router,
  render: c => c(MainPage)
})
