// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/store.js'
import LIKEBase from '../other_modules/vue-plugins/like-base'
import env from './common/env'
require('./assets/css/rem/index.js')
require('./common/mapControl/index')
require('./common/SDKPolyfill')
require('../other_modules/polyfills')

Vue.config.productionTip = false

Vue.use(LIKEBase)

// 从本地取出user的信息
store.dispatch('user/readLocalUser')


// 单页应用换title插件
//Vue.use(require('vue-wechat-title'))

let vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

if(env.isProduction && !env.isAliPay){
  vue.$router.replace('/error/openInAlipay')
}

//暴露给全局，供自定义的插件调用
window.vue = vue

/*
window.console._log = window.console.log
var socket = io('ws://192.168.0.123:3000/client');

socket.on('connect',()=>{
  console.info('connect success')
})

socket.on('message',(msg)=>{
  console.info('message:',msg)
})

socket.on('sendMsg',(msg)=>{
  console.info('Msg:',msg)
})

window.console.log = function (data) {
  socket.emit('log message', data);
  window.console._log(data)
}*/







