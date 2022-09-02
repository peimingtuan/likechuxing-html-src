import Vue from 'vue'
import App from './index.vue'
import Umeng from '../../../component/umeng'
new Umeng(1274794205)
require('../../../component/rem')
new Vue({
    el:'#app',
    render:c=>c(App)
})
