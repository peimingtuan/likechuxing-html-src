import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'
const module = {
    namespaced: true,
    state:{
        tabCurrentIndex:1,
        listData:[],
        tipListData:[],
        tipSort:'',
        page:0,
        tipPage:0,
        status:'',
        tipStatus:'',
        isNoMoreData:false,
        isNoMoreTipData:false,
        searchRes:[]
    },
    mutations:{
        setTabCurrentIndex(state,data){
            state.tabCurrentIndex = data
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
        setTipListData(state,data){
            if(data.hasOwnProperty('tipListData')){
                state.tipListData = data.tipListData
            }
            if(data.hasOwnProperty('tipPage')){
                state.tipPage = data.tipPage
            }
            if(data.hasOwnProperty('isNoMoreTipData')){
                state.isNoMoreTipData = data.isNoMoreTipData
            }  
        },
        setStatus(state,data){
            state.status = data
            state.page = 0
            state.listData = []
        },
        setTipStatus(state,data){
            state.tipStatus = data
            state.tipPage = 0
            state.tipListData = []
        },
        setTipSort(state,data){
            state.tipSort = data
            state.tipPage = 0
            state.tipListData = []
        },
        setSearchres(state,data){
            state.searchRes = data
        }
    },
    actions:{
        getWorkList({ commit, state, rootState }){
            
            let { mobile } = rootState
            let { page,listData,status } = state
            return http.post(api('/vehicle-examine/user-list'),{
                mobile,
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
        },
        getTipList({ commit, state, rootState }){
            
            let { mobile } = rootState
            let { tipPage,tipListData,tipStatus,tipSort } = state
            return http.post(api('/vehicle-examine/list'),{
                mobile,
                page:tipPage,
                status:tipStatus,
                sort:tipSort
            }).then(res=>{
                if(res.status==0){
                    let resData = {
                        tipListData:tipListData.concat(res.data),
                        tipPage:tipPage+1    
                    }
                    if(res.data.length<10){
                        resData.isNoMoreTipData = true
                    }else{
                        resData.isNoMoreTipData = false
                    }
                    commit('setTipListData',resData)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        search({ commit, rootState },v){

            let { mobile } = rootState
            return http.post(api('/vehicle-accident/search'),{
                mobile,
                kw:v
            }).then(res=>{
                if(res.status==0){
                    commit('setSearchres',res.data)
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }
}
export default module;