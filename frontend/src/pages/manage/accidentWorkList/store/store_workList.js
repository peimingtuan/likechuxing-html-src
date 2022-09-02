import http from '../js/http'
import api from '../js/api'
const module = {
    namespaced: true,
    state:{
        car_id:'',
        listData:[],
        page:1,
        status:'',
        isNoMoreData:false,
        filterList:[],
        searchRes:[]
    },
    mutations:{
        setCarId(state,data){
            state.car_id = data
        },
        setListData(state,data){
            state.listData = data.listData || state.listData
            state.page = data.page || state.page
            state.isNoMoreData = data.isNoMoreData || state.isNoMoreData
        },
        setStatus(state,data){
            state.status = data
            state.page = 1
            state.listData = []
        },
        setFilterList(state,data){
            state.filterList = data
        },
        setSearchres(state,data){
            state.searchRes = data
        }
    },
    actions:{
        getFilterList({commit}){
            let data = [
                {
                    id:0,
                    name:'全部进度'
                },
                {
                    id:1,
                    name:'已创建'
                },
                {
                    id:2,
                    name:'已定责',
                },
                {
                    id:3,
                    name:'已定损',
                },
                {
                    id:4,
                    name:'已维修',
                },
                {
                    id:5,
                    name:'已结算',
                },
                {
                    id:6,
                    name:'已结案',
                }
            ]
            let arr = data.map(item=>{
                item.isSelected = false;
                return item
            })
            arr[0].isSelected = true
            commit('setFilterList',arr)
        },
        getList({ commit, state, rootState }){
            
            let { mobile } = rootState
            let { page,listData,status,car_id } = state
            return http.post(api('/vehicle-accident/order-list'),{
                mobile,
                page,
                status,
                car_id
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