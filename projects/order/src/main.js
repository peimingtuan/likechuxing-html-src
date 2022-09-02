// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/store.js'
require('./common/polyfills')

Vue.config.productionTip = false

Vue.use(require('vue-wechat-title'))

/* eslint-disable */
let vue = new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: {App}
})
window.vue = vue
