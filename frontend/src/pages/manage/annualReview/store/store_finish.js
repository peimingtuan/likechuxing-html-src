import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'

const module = {
    namespaced: true,
    state:{
        order_id:'',
        branchName:'',
        branchId:'',
        branchFloor:'地面',
        branchNum:'',
        remark:'',
        carStatus:'',
        statusList:[],
        searchResList:[],
        searchHistory:JSON.parse(localStorage.getItem('searchHistory'))||[],
    },
    mutations:{
        setOrderId(state,data){
            state.order_id = data
        },
        setBranchName(state,data){
            state.branchName = data
        },
        setBranchId(state,data){
            state.branchId = data
        },
        setBranchFloor(state,data){
            state.branchFloor = data
        },
        setBranchNum(state,data){
            state.branchNum = data
        },
        setCarStatus(state,data){
            state.carStatus = data
        },
        setStatusList(state,data){
            state.statusList = data
        },
        setRemark(state,data){
            state.remark = data
        },
        setSearchres(state,data){
            state.searchResList = data
        },
        setSearchHistory(state,data){
            state.searchHistory = data
        }
    },
    actions:{
        getStatusList({state,rootState,commit}){
            let { mobile } = rootState
            http.post(api('/vehicle-examine/car-finish-status-list'),{
                mobile
            }).then(async res=>{
                if(res.status===0){
                    let arr = res.data
                    arr.map(item=>{
                        item.id = item.status
                    })
                    commit('setStatusList',arr)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        finishOrder({state,rootState},context){
            let { mobile } = rootState
            let { order_id,branchId,branchFloor,branchNum,carStatus,remark  } = state
            http.post(api('/vehicle-examine/finish'),{
                mobile,
                id:order_id,
                branch_id:branchId,
                parking_floor:branchFloor,
                parking_no:branchNum,
                car_status:carStatus,
                remark
            }).then(async res=>{
                if(res.status===0){
                    context.$router.replace({
                        path:'detailPreview',
                        query:{
                            order_id
                        }
                    })
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