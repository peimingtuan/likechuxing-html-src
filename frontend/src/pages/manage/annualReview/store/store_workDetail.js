import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'

const module = {
    namespaced: true,
    state:{
        order_id:'',
        car_id:'',
        info:{
            branch:{}
        },
        accidentImg:{},
        accidentImgUrl:[],
        historyDetail:[]
    },
    mutations:{
        setOrderId(state,data){
            state.order_id = data
        },
        setCarId(state,data){
            state.car_id = data
        },
        setInfo(state,data){
            state.info = data
        },
        setAccidentImg(state,data){
            state.accidentImg = data
        },
        setAccidentImgUrl(state,data){
            state.accidentImgUrl = data
        },
        setHistory(state,data){
            state.historyDetail = data
        },
        emptyData(state){
            state.order_id = ''
            state.info = {}
            state.accidentImg = {}
            state.accidentImgUrl = []
            state.historyDetail = []
        }
    },
    actions:{
        getDetail({ state, rootState, commit },context){
            let { mobile } = rootState
            let { order_id } = state
            
            return http.post(api('/vehicle-examine/detail'),{
                mobile,
                id:order_id
            }).then(res=>{
                if(res.status==0){
                    commit('setInfo',res.data)
                    context.$hideLoading('workDetail')
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                context.$hideLoading('workDetail')
                console.log(err)
            })
        },
        async updateImg({ state, rootState, dispatch },context){
            let { mobile } = rootState
            let { 
                order_id,  
                accidentImgUrl, 
            } = state
  
            http.post(api('/vehicle-examine/add-pictures'),{
                mobile,
                id:order_id,
                pictures:accidentImgUrl.toString()
            }).then(async res=>{
                if(res.status===0){
                    // await dispatch('getDetail')
                    context.$router.go(-1)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        getHistory({ state, rootState, commit }){

            let { mobile } = rootState
            let { order_id } = state
            http.post(api('/vehicle-examine/record'),{
                mobile,
                id:order_id
            }).then(res=>{
                if(res.status===0){
                    commit('setHistory',res.data)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        finishOrder({state,rootState,dispatch}){
            let { mobile } = rootState
            let { order_id,info } = state
            http.post(api('/vehicle-accident/operate'),{
                mobile,
                order_id,
                item_id:4
            }).then(async res=>{
                if(res.status===0){
                    dispatch('getDetail')
                    window.location.href = '../manageOrder/carProblemsList/proOrder.html#/proCheck?car_id='+info.car_id
                    
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        openDoor({state,rootState}){
            let { mobile } = rootState
            let { plate_no } = state.info
            http.post(api('/car/open-door'),{
                mobile,
                car_info:plate_no
            }).then(async res=>{
                if(res.status===0){
                    Toast(res.msg)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        closeDoor({state,rootState}){
            let { mobile } = rootState
            let { plate_no } = state.info
            http.post(api('/car/close-door'),{
                mobile,
                car_info:plate_no
            }).then(async res=>{
                if(res.status===0){
                    Toast(res.msg)
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