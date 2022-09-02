import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui';
const module = {
    namespaced:true,
    state:{
        plate_no:'',
        type:'',
        is_like_staff:'',
        rental_id:'',
        remark:'',
        like_user:'',
        like_user_mobile:'',
        rentalList:[],
        selectIndex:'',
        activeIndex:'',
        car_id:''
    },
    mutations:{
        setCarId(state,data){
            state.car_id = data
        },
        setLike_user(state,data){
            state.like_user = data 
        },
        setLike_user_mobile(state,data){
            state.like_user_mobile = data
        },
        setIs_like_staff(state,data){
            state.is_like_staff = data
        },
        setType(state,data){
            state.type = data
        },
        setRemark(state,data){
            state.remark = data
        },
        setRentalList(state,data){
            state.rentalList = data
        },
        selectRentalList(state,index){
            let arr = state.rentalList.slice()
            arr.map(item=>{
                item.isSelected = false;
            })
            arr[index].isSelected = true
            state.rentalList = arr
        },
        setSelectIndex(state,index){
            state.selectIndex = index
            state.plate_no = state.rentalList[index].plate_no
            state.rental_id = state.rentalList[index].id
        },
        setActiveIndex(state,index){
            state.activeIndex = index
        }
    },
    actions:{
        createOrder({ state, rootState },$router){
    
            let { 
                plate_no, 
                type, 
                is_like_staff, 
                rental_id, 
                remark, 
                like_user, 
                like_user_mobile,
                car_id 
            } = state

            if(is_like_staff===''){
                Toast('请选择是否为员工出险')
                return 
            }
            if(is_like_staff==0 && like_user===''){
                Toast('请输入立刻账户')
                return 
            }
            if(is_like_staff==0 && rental_id===''){
                Toast('请关联订单')
                return 
            }
            if(type===''){
                Toast('请选择事故类型')
                return 
            }
            
            let { mobile } = rootState

            let postData = {
                plate_no, 
                mobile,
                type, 
                is_like_staff, 
                rental_id, 
                remark, 
                like_user, 
                like_user_mobile,
                car_id
            }
            http.post(api('/vehicle-accident/create-order'),postData)
            .then(res=>{
                if(res.status==0){
                    $router.replace({path:'workListDetail',query:{order_id:res.data.id}})
                }else{
                    Toast(res.msg)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        },
        getList({ commit, state, rootState },id){

            let { mobile } = rootState
            let { like_user,car_id } = state
            let rental_id = id || ''
            const _this = this
            return http.post(api('/vehicle-accident/rental-list'),{
                mobile,
                name:like_user,
                rental_id,
                car_id
            }).then(res=>{
                if(res.status==0){
                    commit('setRentalList',res.data)
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