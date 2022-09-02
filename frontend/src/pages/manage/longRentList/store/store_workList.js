import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'
const module = {
    namespaced: true,
    state:{
        user_poi:[],//用户经纬度
        tabCurrentIndex:1,
        listData:[],
        listStat:{},
        tipListData:[],
        longRentDate:'',//new------
        longRentCity:'',
        longRentCityName:'',
        longRentSort:'',
        tipSort:'',
        page:0,
        tipPage:0,
        tipStatus:'',
        isNoMoreData:false,
        isNoMoreTipData:false,
        carStatusList:[]
    },
    mutations:{
        setTabCurrentIndex(state,data){
            state.tabCurrentIndex = data
        },
        setCarStatusList(state,data){
            state.carStatusList = data
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
        setListStat(state,data){
            state.listStat = data
        },
        setUserPIO(state,data){
            state.user_poi = data
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
        setLongRentDate(state,data){//new------
            state.longRentDate = data
            state.page = 0
            state.listData = []
        },
        setLongRentCity(state,data){
            state.longRentCity = data
            state.page = 0
            state.listData = []
        },
        setLongRentCityName(state,data){
            state.longRentCityName = data
        },
        setLongRentSort(state,data){
            state.longRentSort = data
            state.page = 0
            state.listData = []
        },
        setTipSort(state,data){
            state.tipSort = data
            state.tipPage = 0
            state.tipListData = []
        },
        setTipStatus(state,data){
            state.tipStatus = data
            state.tipPage = 0
            state.tipListData = []
        }
    },
    actions:{
        getSelectList({ commit, state, rootState }){
            let data = {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem('city_id'),//权限城市id
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
            }
            http.post(api('/work-order/car-select-config'),data).then(res=>{
                if(res.status==0){
                    let arr = res.data.car_status
                    arr.map(item=>{
                        item.isSelected = false
                    })
                    arr[0].isSelected = true
                    commit('setCarStatusList',arr)
                }
            }).then(err=>{
                console.log(err)
            })
            
        },
        getList({ commit, state, rootState }){
            
            let { mobile } = rootState
            let { page, listData, longRentDate, longRentCity, longRentSort } = state
            let data = {
                mobile,
                page,
                date:longRentDate,
                city_id:longRentCity,
                sort:longRentSort
            }
            return http.post(api('/long-rental/index'),data).then(res=>{
                if(res.status==0){
                    let resData = {
                        listData:listData.concat(res.data.list),
                        page:page+1    
                    }
                    if(res.data.list.length<10){
                        resData.isNoMoreData = true
                    }else{
                        resData.isNoMoreData = false
                    }
                    commit('setListData',resData)
                    commit('setListStat',res.data.stat)
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
            if(tipStatus==-1){
                tipStatus = ''
            }
            return http.post(api('/long-rental-car-prepare/index'),{
                mobile,
                page:tipPage,
                status:tipStatus,
                sort:tipSort
            }).then(res=>{
                if(res.status==0){
                    if(Object.prototype.toString.call(res.data)==='[object Array]'){
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
                        let resData = {}
                        resData.isNoMoreTipData = true
                        commit('setTipListData',resData)
                    }
                    
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        deleteListItem({ commit, rootState, dispatch },id){
            let { mobile } = rootState
            return http.post(api('/long-rental-car-prepare/delete'),{
                mobile,
                id
            }).then(res=>{
                if(res.status==0){
                    commit('setTipListData',{ tipPage:0,tipListData:[],isNoMoreTipData:false })
                    dispatch('getTipList')
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