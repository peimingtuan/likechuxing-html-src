import http from '../js/http'
import api from '../js/api'
import tools from '../js/tools'
import $store from './index'
import { Toast } from 'mint-ui'
const module = {
    namespaced: true,
    state:{
        'order_id':'',
        'remark':'',
        'response_mode':'',
        'response_belonging':'',
        'deal_mode':'',
        'detain':'',
        'accidentImg':[],
        'accidentImgUrl':[],
        'car_belonging':'',
        'info':{}
    },
    mutations:{
        setOrderId(state,data){
            state.order_id = data
        },
        setResponse_belonging(state,data){
            state.response_belonging = data
        },
        setEsponse_mode(state,data){
            state.response_mode = data
        },
        setRemark(state,data){
            state.remark = data
        },
        setDeal_mode(state,data){
            state.deal_mode = data
        },
        setDetain(state,data){
            state.detain = data
        },
        setAccidentImg(state,data){
            state.accidentImg = data
        },
        setAccidentImgUrl(state,data){
            state.accidentImgUrl = data
        },
        setCarBelong(state,data){
            state.car_belonging = data
        },
        setDetail(state,data){
            state.info = data
        },
        emptyData(state){
            state.order_id = ''
            state.remark = ''
            state.response_mode = ''
            state.response_belonging = ''
            state.deal_mode = ''
            state.detain = ''
            state.accidentImg = []
            state.accidentImgUrl = []
            state.car_belonging = ''
            state.info = {}
        }
    },
    actions:{
        getDCarBelong({ rootState, commit },car_id){
            let { mobile } = rootState
            http.post(api('/vehicle-accident/car-belong'),{
                mobile,
                car_id
            }).then(res=>{
                if(res.status===0){
                    commit('setCarBelong',res.data.supplier)
                }
            }).catch(err=>{
                console.log(err)
            })

        },
        async createAccident({ state, rootState },$router){
            let { mobile } = rootState
            let { 
                order_id,  
                accidentImgUrl, 
                response_mode, 
                response_belonging, 
                remark, 
                deal_mode, 
                detain,
                car_belonging
            } = state
            let params = {
                remark,
                response_mode, 
                response_belonging, 
                photo:accidentImgUrl.toString(),
                deal_mode, 
                detain,
                car_belonging:car_belonging
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
                item_id:2,
                params:params
            }).then(async res=>{
                if(res.status===0){
                    await $store.dispatch('workDetail/getDetail')
                    $router.go(-1)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        async updateAccident({ state, rootState },$router){
            let { mobile } = rootState
            let { 
                order_id,  
                accidentImgUrl, 
                response_mode, 
                response_belonging, 
                remark, 
                deal_mode, 
                detain,
                car_belonging
            } = state
            let params = {
                remark,
                response_mode, 
                response_belonging, 
                photo:accidentImgUrl.toString(),
                deal_mode, 
                detain,
                car_belonging:car_belonging
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
                item_id:2,
                params:params
            }).then(async res=>{
                if(res.status===0){
                    await $store.dispatch('workDetail/getDetail')
                    $router.go(-1)
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        getInfo({ rootState, commit, state },context){
            let { mobile } = rootState
            let { order_id } = state
            http.post(api('/vehicle-accident/item-result'),{
                mobile,
                order_id,
                item_id:2
            }).then(res=>{
                if(res.status===0){
                    commit('setDetail',res.data)
                    let info = res.data
                    commit('setResponse_belonging',info.response_belonging)
                    commit('setDeal_mode',info.deal_mode)
                    commit('setDetain',info.detain)
                    commit('setRemark',info.remark||'')
                    commit('setCarBelong',info.car_belonging)
                    commit('setEsponse_mode',info.response_mode)
                    commit('setAccidentImgUrl',info.photo)
                    commit('setAccidentImg',tools.initImg(info.photo))
                    context.$hideLoading('accountability')
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })

        },
    }
}
export default module;