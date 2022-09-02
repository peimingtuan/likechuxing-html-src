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

const IndexActions = Reflux.createActions([
    'changeState',

    'initIndex',
    'updateModelList',

    'initEditRental',
    'getCost',
    'createRental',

    'initBranch',

    'pay'
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

            duration:[[1517875200,1518480000],[1519394400,1519826400]],
            startTime:null,
            endTime:null,
            startPoint:null,
            endPoint:null,
            rent_fee:0,
            deposit:0,
            save_fee:0,
            actual_fee:0,

            // 网点列表
            branchList:[],
            // 网点列表由近及远
            branchListSort:[],
            search_lat:0,
            search_lng:0
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
            if(res.status === 0){
                let cityArray = []
                for(let k in res.data.cityArray){
                    cityArray.push({
                        id: k,
                        city:res.data.cityArray[k]
                    })
                }

                let model_info = []
                for(let k in res.data.model_info){
                    res.data.model_info[k].id = k
                    model_info.push(res.data.model_info[k])
                }
                let current_city_id = res.data.selected_city_id
                if(user.user_lat==0 || user.user_lng == 0){
                    current_city_id = 197
                }
                that.setState({
                    cityList: cityArray,
                    currentCityId: current_city_id,
                    modelList: model_info
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
                let model_info = []
                for (let k in res.data.model_info) {
                    res.data.model_info[k].id = k
                    model_info.push(res.data.model_info[k])
                }
                that.setState({
                    modelList: model_info
                })
            } else {
                new Toast(res.msg)
            }
        })
    }

    // editRental page
    onInitEditRental(){
        let that = this
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/model-detail'), {
            uuid: user.uuid,
            sign: user.sign,
            model_id: this.state.currentModelId,
            city_id:this.state.currentCityId
        },function(res){
            if(res.status === 0){
                that.setState({
                    deposit:res.data.model_info.deposit,
                    duration:res.data.duration
                })
            }
        })
    }
    onGetCost(){
        let that = this
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/fee'), {
            uuid: user.uuid,
            sign: user.sign,
            model_id: this.state.currentModelId,
            city_id:this.state.currentCityId,
            begin_time:this.state.startTime.time,
            end_time:this.state.endTime.time
        },function(res){
            if(res.status === 0){
                that.setState({
                    rent_fee: res.data.rent_fee,
                    deposit:res.data.deposit,
                    save_fee: res.data.save_fee,
                    actual_fee:res.data.actual_fee
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
            begin_time:this.state.startTime.time,
            end_time:this.state.endTime.time,
            begin_branch_id:this.state.startPoint.branch_id,
            end_branch_id:this.state.endPoint.branch_id
        },function(res){
            loading.hide()
            if(res.status === 0){
                that.setState({
                    actual_fee:res.data.total_money
                })
                history.push('/main/pay')
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
                        history.push('/main/pay')
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