/**
 * Created by garvey on 2017/6/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'

// 全局级store
import user from './modules/user.js'
import branch from './modules/branch.js'
import rental from './modules/rental.js'
import pay from './modules/pay.js'

// 组件级store
import Widget from '../components/Widget/store.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    branch,
    rental,
    pay,

    Widget
  }
})

export default store
