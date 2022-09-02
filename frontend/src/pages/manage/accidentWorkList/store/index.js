import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import workList from './store_workList'
import createWork from './store_createWork'
import workDetail from './store_workDetail'
import accountability from './store_accountability'
import loss from './store_loss'
import repair from './store_repair'


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
       accountability:accountability,
       loss:loss,
       repair:repair
    }
})
export default store;
