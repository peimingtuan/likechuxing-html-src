import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'

const module = {
    namespaced: true,
    state:{
        order_id:'',
        info:{},
        like_user_mobile:'',
        plate_no:'',
        otherMobile:'',
        remark:'',
        injuredDesc:'',
        type:'',
        isAnyoneInjured :'',
        accidentImg:{},
        accidentImgUrl:[],
        historyDetail:[]
    },
    mutations:{
        setOrderId(state,data){
            state.order_id = data
        },
        setInfo(state,data){
            state.info = data
        },
        setLike_user_mobile(state,data){
            state.like_user_mobile = data
        },
        setPlate_no(state,data){
            state.plate_no = data
        },
        setOtherMobile(state,data){
            state.otherMobile = data
        },
        setRemark(state,data){
            state.remark = data
        },
        setInjuredDesc(state,data){
            state.injuredDesc = data
        },
        setType(state,data){
            state.type = data
        },
        setIsAnyoneInjured(state,data){
            state.isAnyoneInjured = data
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
            state.like_user_mobile = ''
            state.plate_no = ''
            state.otherMobile = ''
            state.remark = ''
            state.injuredDesc = ''
            state.type = ''
            state.isAnyoneInjured  = ''
            state.accidentImg = {}
            state.accidentImgUrl = []
            state.historyDetail = []
        }
    },
    actions:{
        getDetail({ state, rootState, commit },context){
            let { mobile } = rootState
            let { order_id, info } = state
            return http.post(api('/vehicle-accident/order-detail'),{
                mobile,
                order_id
            }).then(res=>{
                if(res.status===0){ 
                    commit('setInfo',res.data)
                    commit('setLike_user_mobile',res.data.like_user_mobile)
                    commit('setType',res.data.type)
                    commit('setIsAnyoneInjured',res.data.is_person_injured)
                    context.$hideLoading('workDetail')
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        async updateAccident({ state, rootState, dispatch },$router){
            let { mobile } = rootState
            let { 
                order_id,  
                accidentImgUrl, 
                type, 
                isAnyoneInjured, 
                remark, 
                plate_no, 
                otherMobile,
                injuredDesc
            } = state
            let params = {
                type,
                remark,
                car_part:injuredDesc,
                car_photo:accidentImgUrl.toString(),
                is_person_injured:isAnyoneInjured
            }
            if(type==2){
                params.third_plate_no = plate_no
                params.third_mobile = otherMobile
            }
            Object.keys(params).map(key=>{
                if(params.hasOwnProperty(key)){
                    if(params[key]===''){
                        delete params[key]
                    }
                }
            })
            http.post(api('/vehicle-accident/operate'),{
                mobile,
                order_id,
                item_id:1,
                params:params
            }).then(async res=>{
                if(res.status===0){
                    await dispatch('getDetail')
                    $router.go(-1)
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
            http.post(api('/vehicle-accident/operate-history'),{
                mobile,
                order_id
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