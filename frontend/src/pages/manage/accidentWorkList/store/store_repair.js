import http from '../js/http'
import api from '../js/api'
import $store from './index'
import { Toast } from 'mint-ui'
const module = {
    namespaced: true,
    state:{
        'order_id':'',
        'remark':'',
        'info':{}
    },
    mutations:{
        setOrderId(state,data){
            state.order_id = data
        },
        setRemark(state,data){
            state.remark = data
        },
        setInfo(state,data){
            state.info = data
        },
        emptyData(state){
            state.order_id = ''
            state.remark = ''
            state.info = {}
        },
        beforeRouteLeave(to,from,next){
            if(to.path==='/workListDetail'){
                this.$store.commit('repair/emptyData')
            }
            next()
        },
    },
    actions:{
        getInfo({ state, rootState, commit },context){
            let { mobile } = rootState
            let { order_id } = state
            http.post(api('/vehicle-accident/repair-car'),{
                mobile,
                order_id
            }).then(res=>{
                if(res.status===0){
                    commit('setInfo',res.data)
                    context.$hideLoading()
                }
            }).catch(err=>{
                console.log(err)
            })

        },
        async createRepair({ state, rootState },context){
            // context.$showLoading()
            let { mobile } = rootState
            let { 
                order_id,  
                remark, 
            } = state
            let { id, car_id, deal_mode } = state.info
            let params = {
                mobile,
                car_id,
                deal_mode,
                remark,
                order_id:id,
                source:2
            }
            Object.keys(params).map(key=>{
                if(params.hasOwnProperty(key)){
                    if(params[key]===''){
                        delete params[key]
                    }
                }
            })

            http.post(api('/vehicle-repair/create-order'),params).then(async res=>{
                if(res.status===0){
                    context.$router.go(-1)
                    // context.$hideLoading()
                    // window.location.href = './../manageOrderService/index.html#/orderDetail?order_id='+order_id
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