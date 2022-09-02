require('./css/index.less');
require('../../../css/reset.css');
require('../../../css/common.less')
import Vue from 'vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'
import IndexPage from './index.vue'

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(IndexPage)
})





