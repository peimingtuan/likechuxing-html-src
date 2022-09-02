import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'
const module = {
    namespaced: true,
    state:{
        car_id:'',
        listData:[],
        page:0,
        status:'',
        isNoMoreData:false,
        searchRes:[]
    },
    mutations:{
        setCarId(state,data){
            state.car_id = data
        },
        setListData(state,data){
          
            if(data.hasOwnProperty('listData')){
                state.listData =  data.listData
            }
            if(data.hasOwnProperty('page')){
                state.page = data.page
            }
            if(data.hasOwnProperty('isNoMoreData')){
                state.isNoMoreData =  data.isNoMoreData
            }
        },
        setStatus(state,data){
            state.status = data
            state.page = 0
            state.listData = []
        },
        setSearchres(state,data){
            state.searchRes = data
        }
    },
    actions:{
        getWorkList({ commit, state, rootState }){
            
            let { mobile } = rootState
            let { page,listData,status,car_id } = state
            return http.post(api('/vehicle-examine/car-order-list'),{
                mobile,
                car_id,
                page,
                status
            }).then(res=>{
                if(res.status==0){
                    let resData = {
                        listData:listData.concat(res.data),
                        page:page+1    
                    }
                    if(res.data.length<10){
                        resData.isNoMoreData = true
                    }else{
                        resData.isNoMoreData = false
                    }
                    commit('setListData',resData)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}
export default module;