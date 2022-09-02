/**
 * Created by garvey on 2017/6/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'

// 全局级store
import user from './modules/user.js'

// 组件级store
import YdAlert from '../components/YdAlert/store.js'
import YdLoading from '../components/YdLoading/store.js'

// 页面级store
import sideBar from './modules/sideBar.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,

    sideBar,

    YdAlert,
    YdLoading
  }
})

export default store
