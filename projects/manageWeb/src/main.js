// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/store.js'
import VueResource from 'vue-resource'

import CONFIG from './config/main.js'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.http.options.emulateJSON = true
// 在调接口时，如果有登录，则加入uid和key辅助验证
Vue.http.interceptors.push(function (request, next) {
  let user = vue.$store.getters['user/getUser']
  if (user) {
    request.body.uid = user.uid
    request.body.key = user.key
  }

  next()
})

if (CONFIG.IS_DEV) {
  Vue.http.interceptors.push(function (request, next) {
    let data = request.body
    request.body = {
      url: request.url,
      data: data
    }
    request.url = CONFIG.XCROSS_FILE_URL
    next()
  })
}

/* eslint-disable no-new */
let vue = new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: {App}
})
