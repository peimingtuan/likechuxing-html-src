/**
 * Created by garvey on 2017/9/12.
 */
import Vue from 'vue'
import MainPage from './exchange.vue'
import likeBase from '../../../../other_modules/vue-plugins/like-base/index'

require('./css/exchange.less')
require('../../../component/rem')

Vue.use(likeBase)

new Vue({
  el:"#app",
  render: c => c(MainPage)
})
