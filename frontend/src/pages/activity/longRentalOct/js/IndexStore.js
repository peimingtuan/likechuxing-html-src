/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: IndexStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/4-下午3:24
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import myAjax from '../component/myAjax/withJq'
import getApiUrl from '../../../../js/getApiUrl'
import {Alert, Toast} from "../component/LikeAlert/index";
import loading from '../component/loading'
import createHistory from 'history/createHashHistory'
import {CommonActions} from "./CommonStore";
const history = createHistory()

// 2018-10-18
import tool from './tool'
const IndexActions = Reflux.createActions([
    'changeState',

    'initIndex',
    'updateModelList',

    'initEditRental',
    'getCost',
    'createRental',

    'initBranch',

    'pay',

    "isShowTime",

    "checkPermision"
])

class IndexStore extends Reflux.Store{
    constructor(){
        super()
        this.listenables = IndexActions
        this.state={
            empty:'',

            cityList:[],
            currentCityId:0,
            modelList:[],
            currentModelId:-1,
            discount:0,

            duration:[[1517875200,1518480000],[1519394400,1519826400]],
            startTime:tool.timeToTimestamp(tool.getDesignatedDay(3).time),
            endTime:tool.timeToTimestamp(tool.getDesignatedDay(33).time),
            startPoint:null,
            endPoint:null,
            rent_fee:0,
            deposit:0,
            save_fee:0,
            actual_fee:0,
            rent_insurance:0,

            // 网点列表
            branchList:[],
            // 网点列表由近及远
            branchListSort:[],
            search_lat:0,
            search_lng:0,
            isShowTime:0,
            noChangeCity: true,
            coupon:{},
            serverTime:0,
            timeHour:0,
            canCheckout:true
        }
    }

    onChangeState(state){
        this.setState(state)
    }
    // index page
    onInitIndex(){
        let that = this
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/model-list'), {
            uuid: user.uuid,
            sign: user.sign,
            city_id: this.state.currentCityId || user.city_id
        }, function(res){
            // console.log(res);
            
            if(res.status === 0){                
                let cityArray = []
                for(let k in res.data.cityArray){
                    cityArray.push({
                        id: k,
                        city:res.data.cityArray[k]
                    })
                }

                // let model_info = []
                // for(let k in res.data.model_info){
                //     res.data.model_info[k].id = k
                //     model_info.push(res.data.model_info[k])
                // }
                let current_city_id = res.data.selected_city_id                            
                if((user.user_lat==0 || user.user_lng == 0) && that.state.noChangeCity ){                    
                    current_city_id = 197
                }                
                that.setState({
                    cityList: cityArray,
                    currentCityId: current_city_id,
                    modelList: res.data.model_info,
                    actual_fee:0,
                    isShowTime:0,
                    startPoint:null,
                    endPoint:null,
                })
            }else{
                new Toast(res.msg)
            }
        })
    }
    onUpdateModelList() {
        let that = this
        loading.show()
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/model-list'), {
            uuid: user.uuid,
            sign: user.sign,
            city_id: this.state.currentCityId
        }, function (res) {                   
            loading.hide()
            if (res.status === 0) {
                // let model_info = []
                // for (let k in res.data.model_info) {
                //     res.data.model_info[k].id = k
                //     model_info.push(res.data.model_info[k])
                // }
                that.setState({
                    modelList:res.data.model_info,
                })
            } else {
                new Toast(res.msg)
            }
        })
    }

    // 车型是否可租
    onCheckPermision(carPirce){
        let that = this
        let user = Reflux.GlobalState.common  
        // console.log(this.state.discount);
                      
        myAjax.post(getApiUrl('/long-rental/check-permision'), {
            uuid: user.uuid,
            sign: user.sign,
            model_id: this.state.currentModelId,
            city_id:this.state.currentCityId,
            discount:this.state.discount,
            car_price:carPirce
        },function(res){       
            // console.log(res);
            that.setState({canCheckout:true})
            if(res.status === 2){                
                if(Number(res.data.cnt) == 0){
                    new Alert({
                        msg:'特惠车已被抢光，送你199元月租优惠券，立刻去选车',
                        confirmButtonCallback:function(){
                            // console.log(that.state.currentModelId,that.state.currentCityId,that.state.discount);
                            
                            myAjax.post(getApiUrl('/long-rental/take-coupon'),{
                                uuid: user.uuid,
                                sign: user.sign,
                                model_id: that.state.currentModelId,
                                city_id:that.state.currentCityId,
                                discount:that.state.discount
                            },function(res){
                                // console.log(res);
                                if(res.status !=0){
                                    new Toast(res.msg)
                                }
                            })
                        }
                    })
                }else if(Number(res.data.cnt) == -1){
                    new Toast(res.msg);
                }else{
                    new Alert({
                        msg:'199元月租优惠券已关联到你的账户，立刻选车',
                    })
                }
            }else if (res.status === 0){
                history.push('/main/editRental')
            }else if(/该车型已被抢光/.test(res.msg)){
                new Toast(res.msg) 
                
            }else{
                new Toast(res.msg) 
            }
        })
    }
dasd
    // editRental page
    onInitEditRental(){
        let that = this
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/model-detail'), {
            uuid: user.uuid,
            sign: user.sign,
            model_id: this.state.currentModelId,
            city_id:this.state.currentCityId,
            discount:this.state.discount
        },function(res){
            if(res.status === 0){
                // console.log(res.data.coupon);
                
                that.setState({
                    deposit:res.data.model_info.deposit,
                    duration:res.data.duration,
                    coupon: res.data.coupon,
                    serverTime:res.data.server_time
                })
            }
        })
    }
    onGetCost(){
        // console.log(this)
        let that = this
        let user = Reflux.GlobalState.common
        // console.log(this.state.currentModelId);
        
        myAjax.post(getApiUrl('long-rental/fee'), {
            uuid: user.uuid,
            sign: user.sign,
            model_id: this.state.currentModelId,
            city_id:this.state.currentCityId,
            begin_time:this.state.startTime,
            end_time:this.state.endTime,
            discount:this.state.discount
        },function(res){
            if(res.status === 0){
                // console.log(res.data);
                that.setState({
                    rent_fee: res.data.rent_fee,
                    deposit:res.data.deposit,
                    save_fee: res.data.save_fee,
                    actual_fee: res.data.actual_fee,
                    rent_insurance:res.data.rent_insurance
                })
            }
        })
    }
    onCreateRental(){
        loading.show()
        let that = this
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/create'), {
            uuid: user.uuid,
            sign: user.sign,
            model_id: this.state.currentModelId,
            city_id:this.state.currentCityId,
            begin_time:this.state.startTime,
            end_time:this.state.endTime,
            begin_branch_id:this.state.startPoint.branch_id,
            end_branch_id:this.state.endPoint.branch_id,
            discount:Number(this.state.discount),
            coupon_id:this.state.coupon.id
        },function(res){
            // console.log(res);
            
            loading.hide()
            if(res.status === 0){
                that.setState({
                    actual_fee:res.data.total_money
                })
                history.replace('/main/pay')
            }else if(/该车型已被抢光/.test(res.msg)){
                new Toast(res.msg)
                history.replace('/main/index')
            }else if(/已有未支付订单/.test(res.msg)){
                new Alert({
                    title:'已有未支付订单',
                    msg:'点击确定支付该订单',
                    confirmButtonCallback:function(){
                        that.setState({
                            actual_fee:res.data.total_money
                        })
                        history.replace('/main/pay')
                    }
                })
            }else{
                new Toast(res.msg)
            }
        })
    }

    // chooseBranch Index page
    onInitBranch(){
        let that = this
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/branch-list'), {
            uuid: user.uuid,
            sign: user.sign,
            city_id: this.state.currentCityId
        },function(res){
            if(res.status === 0){
                that.setState({
                    branchList: res.data.branch
                })
            }
        })
    }

    // pay page
    onPay(){
        loading.show()
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/pre-pay'),{
            uuid: user.uuid,
            sign: user.sign
        },function(res){
            if(res.status === 0){
                CommonActions.save()
                myAjax.postJump(getApiUrl('long-rental/pay'),{
                    uuid: user.uuid,
                    sign: user.sign
                })
            }else{
                loading.hide()
                new Toast(res.msg)
            }
        })
    }

}

export {IndexActions, IndexStore}