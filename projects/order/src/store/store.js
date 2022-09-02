/**
 * Created by garvey on 2017/6/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'

// 全局级store
import user from './modules/user.js'
import data from './modules/data.js'

// 组件级store
import Alert from '../components/Alert/store.js'
import Loading from '../components/Loading/store.js'
import PayWays from '../components/PayWays/store.js'

// 页面级store
import sideBar from './modules/sideBar.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    data,

    sideBar,

    Alert,
    Loading,
    PayWays
  }
})

export default store
