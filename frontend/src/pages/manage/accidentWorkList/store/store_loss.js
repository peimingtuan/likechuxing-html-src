import http from '../js/http'
import api from '../js/api'
import tools from '../js/tools'
import $store from './index'
import { Toast } from 'mint-ui'
const module = {
    namespaced:true,
    state:{
        order_id:'',
        loss_person:'',
        company:'',
        loss_location:'',
        loss_money:'',
        remark:'',
        loss_time:'',
        loss_no:'',
        insured_person:'',
        third_money:'',
        accidentImg:[],
        accidentImgUrl:[],
        info:{}
    },
    mutations:{
        setOrderId(state,data){
            state.order_id = data
        },
        setLossPerson(state,data){
            state.loss_person = data
        },
        setRemark(state,data){
            state.remark = data
        },
        setCompany(state,data){
            state.company = data
        },
        setLossTime(state,data){
            state.loss_time = data
        },
        setLossLocation(state,data){
            state.loss_location = data
        },
        setLossMoney(state,data){
            state.loss_money = data
        },
        setLossNo(state,data){
            state.loss_no = data
        },
        setInsuredPerson(state,data){
            state.insured_person = data
        },
        setThird_money(state,data){
            state.third_money = data;
        },
        setAccidentImg(state,data){
            state.accidentImg = data
        },
        setAccidentImgUrl(state,data){
            state.accidentImgUrl = data
        },
        setDetail(state,data){
            state.info = data
        },
        emptyData(state){
            state.order_id = ''
            state.loss_person = ''
            state.company = ''
            state.loss_location = ''
            state.loss_money = ''
            state.remark = ''
            state.loss_time = ''
            state.loss_no = ''
            state.insured_person = ''
            state.third_money = ''
            state.accidentImg = []
            state.accidentImgUrl = []
            state.info = {}
        }
    },
    actions:{
        async createAccident({ state, rootState },$router){
            let { mobile } = rootState
            let { 
                order_id,  
                accidentImgUrl, 
                loss_person,
                company,
                loss_location,
                loss_money,
                remark,
                loss_time,
                loss_no,
                insured_person,
                third_money,
            } = state
            let params = {
                loss_person,
                company,
                loss_location,
                loss_money,
                remark,
                loss_time,
                loss_no,
                insured_person,
                third_money,
                photo:accidentImgUrl.toString(),
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
                item_id:3,
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
                loss_person,
                company,
                loss_location,
                loss_money,
                remark,
                loss_time,
                loss_no,
                insured_person,
                third_money,
            } = state
            let params = {
                loss_person,
                company,
                loss_location,
                loss_money,
                remark,
                loss_time,
                loss_no,
                insured_person,
                third_money,
                photo:accidentImgUrl.toString(),
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
                item_id:3,
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
                item_id:3
            }).then(res=>{
                if(res.status===0){
                    commit('setDetail',res.data)
                    let info = res.data
                    commit('setLossPerson',info.loss_person)
                    commit('setRemark',info.remark||'')
                    commit('setCompany',info.company)
                    commit('setLossTime',info.loss_time)
                    commit('setLossLocation',info.loss_location)
                    commit('setLossNo',info.loss_no)
                    commit('setInsuredPerson',info.insured_person)
                    commit('setLossMoney',info.loss_money)
                    commit('setAccidentImg',tools.initImg(info.photo))
                    commit('setAccidentImgUrl',info.photo)
                    context.$hideLoading('loss')
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