import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './js/macarons'

import App from './index.vue'
import router from './js/router'

Vue.use(MintUI)

let vm = new Vue({
	el: '#app',
	router,
	render: c => c(App)
})





