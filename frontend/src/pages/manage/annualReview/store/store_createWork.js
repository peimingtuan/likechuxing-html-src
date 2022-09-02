import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui';
const module = {
    namespaced:true,
    state:{
        car_id:'',
        info:{},
        car_status:''
    },
    mutations:{
        setCarId(state,data){
            state.car_id = data
        },
        setInfo(state,data){
            state.info = data
        },
        setCarStatus(state,data){
            state.car_status = data
        }
    },
    actions:{
        createOrder({ state, rootState },context){
            
            let { 
                car_id,
                car_status
            } = state

            if(car_status===''){
                Toast('请选择状态')
                return 
            }
            
            let { mobile } = rootState

            let postData = {
                mobile,
                car_id,
                car_status,
            }
            http.post(api('/vehicle-examine/create'),postData)
            .then(res=>{
                if(res.status==0){
                    context.$router.replace({path:'workDetail',query:{order_id:res.data.id,car_id}})
                }else{
                    Toast(res.msg)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        },
        getInfo({ commit, state, rootState },id){

            let { mobile } = rootState
            let { car_id } = state
            
            return http.post(api('/car/info'),{
                mobile,
                car_id
            }).then(res=>{
                if(res.status==0){
                    commit('setInfo',res.data)
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