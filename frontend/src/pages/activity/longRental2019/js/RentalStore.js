/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: CommonStore
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/3-下午6:40
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'
import myAjax from '../component/myAjax/withJq'
import getApiUrl from '../../../../js/getApiUrl'
import getEnv from '../../../../js/env'
import {Alert, Toast} from "../component/LikeAlert/index";
import loading from '../component/loading'
import createHistory from 'history/createHashHistory'
import {appMutual} from '../../../../../other_modules/app-mutual'
const history = createHistory()
let HOST = getEnv() === 'production' ? 'https://h5.likechuxing.com' : 'https://h5test.likechuxing.com'

const RentalActions = Reflux.createActions([
    'changeState',
    'cancel',
    'initChooseCar',
    'submitDamage',
    'changeEndBranch',
    'initWillFinish',
    'finishRental',
    'refund',
])

class RentalStore extends Reflux.Store{
    constructor(){
        super()
        this.listenables = RentalActions
        this.state={
            rental_id: 0,
            rental_city_id:0,
            fetch_car_time:0,
            server_time:1,
            begin_branch_name:'',
            end_branch_name:'',
            current_end_branch_id:0,
            current_end_branch_name:'',
            end_branch_lng:0,
            end_branch_lat:0,
            branch_walk_addr:'',
            car_list:[],
            plate_no:'',
            walk_overall_view:'',
            end_parking_floor:'',
            drive_lat:'',
            drive_lng:'',
            end_parking_no:'',
            has_change_car:0,
            peccancy: [],
            self_pay: 0,
            return_car_time:0,
            isShowAlet:true,
            chooseTime:0
        }
    }

    onChangeState(state){
        this.setState(state)
    }

    onCancel(){
        let user = Reflux.GlobalState.common
        myAjax.post(getApiUrl('long-rental/cancel'), {
            uuid: user.uuid,
            sign: user.sign,
            activity_id:1
        },function(res){
            if(res.status === 0){
                // history.replace('/main/index')
                appMutual.send.url({
                    url:HOST+`/activity/longRental2019`,
                    request_type:'get',
                    destroy_current:1
                })
            }else{
                new Toast(res.msg)
            }
        })
    }

    // chooseCar page
    onInitChooseCar(){
        let that = this
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/fetch-car'), {
            uuid: user.uuid,
            sign: user.sign,
            activity_id:1
        }, function(res){
            loading.hide()
            if(res.status === 0){
                that.setState({
                    fetch_car_time:res.data.fetch_car_time,
                    server_time:res.data.server_time,
                    model_img:res.data.car_img,
                    model_name:res.data.model_name,
                    begin_branch_name:res.data.branch_name,
                    branch_walk_addr:res.data.walk_addr,
                    branch_walk_remark:res.data.walk_remark,
                    car_list:res.data.car_list,
                    walk_overall_view:res.data.walk_overall_view,
                    drive_lat:res.data.drive_lat,
                    drive_lng:res.data.drive_lng,
                    return_car_time:res.data.return_car_time
                })
            }else{
                new Toast(res.msg)
            }
        })
    }

    onChangeEndBranch(branch){
        let that = this
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/modify-end-branch'), {
            uuid: user.uuid,
            sign: user.sign,
            end_branch_id: branch.branch_id,
            activity_id:1
        },function(res){
            loading.hide()
            if(res.status === 0){
                that.setState({
                    end_branch_name:branch.branch_name,
                    end_branch_lng: branch.lng,
                    end_branch_lat:branch.lat
                })
                history.replace('/rental/useCar')
            }else{
                new Toast(res.msg)
            }
        })
    }

    onSubmitDamage(type,parts){
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('upload/car-before-parts'), {
            uuid: user.uuid,
            sign: user.sign,
            rental_id:this.state.rental_id,
            car_id: Reflux.GlobalState.car.car_id,
            parts,
            type:'1',
            behavior:type,
            activity_id:1
        },function(res){
            loading.hide()
            if(res.status === 0){
                history.replace({
                    pathname:'/carDamage/takePhoto',
                    search:'?type='+type
                })
            }else{
                new Toast(res.msg)
            }
        })
    }

    onInitWillFinish(){
        let that = this
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/get-nearby-branch'), {
            uuid: user.uuid,
            sign: user.sign,
            user_lat: user.user_lat,
            user_lng:user.user_lng,
            activity_id:1
        },function(res){
            loading.hide()
            if(res.status === 0){
                if(res.data.current.hasOwnProperty('id')){
                    that.setState({
                        current_end_branch_id:res.data.current.id,
                        current_end_branch_name:res.data.current.name
                    })
                }else{
                    new Toast('没有检测到附近网点')
                }
                
            }else{
                new Toast(res.msg)
            }
        })
    }

    onFinishRental(){
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/finish'), {
            uuid: user.uuid,
            sign: user.sign,
            user_lat:user.user_lat,
            user_lng:user.user_lng,
            end_branch_id: this.state.current_end_branch_id,
            parking_floor:this.state.end_parking_floor,
            parking_no:this.state.end_parking_no,
            activity_id:1
        },function(res){            
            loading.hide()
            if(res.status === 0){
                appMutual.send.url({
                    url:HOST+`/activity/longRental2019`,
                    request_type:'get',
                    destroy_current:1
                })
                // history.replace({
                //     pathname:'/main/finish',
                //     search:'?type=0'
                // })
            }else{
                new Toast(res.msg)
            }
        })
    }

    onRefund(){
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/refund-money'), {
            uuid: user.uuid,
            sign: user.sign,
            activity_id:1
        },function(res){
            loading.hide()
            if(res.status === 0){
                new Toast('申请退款成功')
                setTimeout(function(){
                    history.replace({
                        pathname:'/main/index'
                    })
                },2000)
            }else{
                new Toast(res.msg)
            }
        })
    }
}

RentalStore.id = 'rental'

export {RentalActions, RentalStore}