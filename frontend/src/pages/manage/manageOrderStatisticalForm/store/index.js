import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex) 

import picker from '../js/picker'

const store = new Vuex.Store({
    state:{
        selectArray:[0],
        datePickerData:picker.initData(),
        selectHourArray:[8],
        hourData:picker.initHourData()
    },
    mutations:{
        setSelectArray(state,data){
            state.selectArray = data
        },
        setSelectHourArray(state,data){
            state.selectHourArray = data
        },
        setPickerData(state,data){
            state.datePickerData = data
        }
    }
})
export default store