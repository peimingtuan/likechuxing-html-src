import Vue from 'vue'
import Vuex from 'vuex'
import vuexAlong from 'vuex-along'
Vue.use(Vuex)

import workList from './store_workList'
import createWork from './store_createWork'
import workDetail from './store_workDetail'
import finish from './store_finish'
import dotMap from './store_dotMap'
import search from './store_search'
import myList from './store_myList'
import carWorkList from './store_carWorkList'

vuexAlong.watchSession(['workList'],false);
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
       workList: workList,
       createWork:createWork,
       workDetail:workDetail,
       finish:finish,
       dotMap:dotMap,
       search:search,
       myList:myList,
       carWorkList:carWorkList
    },
    // plugins: [vuexAlong]
})
export default store;
