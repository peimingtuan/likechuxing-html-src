import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from 'vuex-along'
Vue.use(Vuex)

import workList from './store_workList'


vuexAlong.watchSession(['workList/page'],false);
vuexAlong.onlySession(true);

const store = new Vuex.Store({
    state:{
        mobile:''
    },
    mutations:{
        setMobile(state,data){
            state.mobile = data
        }
    },
    modules:{
       workList: workList
    },
    plugins: [vuexAlong]
})
export default store;
