import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'
const module = {
    namespaced: true,
    state:{
        lat:'',
        lng:'',
        list:[],
        provice:'',
        city:'',
        currentBranchId:'',
        searchResList:[],
        searchHistory:JSON.parse(localStorage.getItem('searchHistory'))||[],
    },
    getters:{
        user_poi (state) {
            let lat = Number(state.lat)
            let lng = Number(state.lng)
            return [lng, lat]
        },
        currentBranch(state){
            let res = {}
            if(state.list.length==0){
                return {}
            }
            state.list.map(item=>{
                if(item.branch_id==state.currentBranchId){
                    res = item
                }
            })
            return res
        }
    },
    mutations:{
        setLngLat(state,data){
            state.lat = data.lat
            state.lng = data.lng
        },
        setList(state,data){
            state.list = data
        },
        setSearchres(state,data){
            state.searchResList = data
        },
        setSearchHistory(state,data){
            state.searchHistory = data
        },
        setCurrentBranchId(state,data){
            state.currentBranchId = data
        },
        emptyData(state){
            state.lat = ''
            state.lng = ''
            state.list = []
            state.provice = ''
            state.city = ''
            state.currentBranchId = ''
            state.searchResList = []
        }
    },
    actions:{
        getList({ commit, state, rootState }){
            let { mobile } = rootState
            let { provice, city, lat,lng, } = state
            let param = {
                province_name: provice,
                city_name: city,
                lng,
                lat,
                mobile
            }
            return http.post(api('/work-order/select-branch'),param).then(res=>{
                if(res.status==0){
                    commit('setList',res.data)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        searchDot({ commit, rootState },v){
            let { mobile } = rootState
            return http.post(api('/vehicle-problem/search'),{
                mobile,
                kw:v
            }).then(res=>{
                if(res.status==0){
                    if(res.data.hasOwnProperty('branch')){
                        let list = res.data.branch
                        console.log(list)
                        commit('setSearchres',list)
                    }else{
                        commit('setSearchres',[])
                    }
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