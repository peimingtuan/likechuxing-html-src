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
import {Alert, Toast} from "../component/LikeAlert/index";
import {RentalActions} from "./RentalStore";
import loading from '../component/loading'
import createHistory from 'history/createHashHistory'
import {IndexStore} from "./IndexStore";
const history = createHistory()

const CarActions = Reflux.createActions([
    'changeState',
    'initCarDetails',
    'openDoor',
    'lockDoor',
    'getPeccancy'
])

class CarStore extends Reflux.Store{
    constructor(){
        super()
        this.listenables = CarActions
        this.state={
            car_id: 0,
            car_img: '',
            car_model_name: '',
            car_plate_no: '',
            car_panorama: '',
            car_lng: 0,
            car_lat: 0,
            car_parking_floor:'',
            car_parking_no: '',
            p_id:0,
            p_create_time: "0",
            p_happen_time: "0",
            p_handle_des: "",
            p_happen_addr: "",
            p_happen_behavior: "",
            p_score: "",
            p_fee: "",
            p_plate_no:"",
            p_engine_no:"",
            endTime:0,
            forbid:[]
        }
    }

    onChangeState(state){
        this.setState(state)
    }

    onInitCarDetails(){
        let that = this
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/car-detail'), {
            uuid: user.uuid,
            sign: user.sign,
            car_id: this.state.car_id
        }, function(res){
            // console.log(res);
            
            loading.hide()
            if(res.status === 0){
                that.setState({
                    car_id: res.data.car_id,
                    car_img: res.data.car_img,
                    car_model_name: res.data.model_name,
                    car_plate_no: res.data.plate_no,
                    car_panorama: res.data.car_panorama,
                    car_lng: res.data.car_lng,
                    car_lat: res.data.car_lat,
                    car_parking_floor:res.data.current_parking_floor,
                    car_parking_no: res.data.current_parking_no,
                    endTime:res.data.end_time,
                    forbid:res.data.forbid

                })
                RentalActions.changeState({
                    begin_branch_name:res.data.begin_branch_name,
                    end_branch_name: res.data.end_branch_name
                })
            }else{
                new Toast(res.msg)
            }
        })
    }

    onOpenDoor(cb,fail){
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/open-door'), {
            uuid: user.uuid,
            sign: user.sign,
            car_id: this.state.car_id
        }, function(res){
            loading.hide()
            if(res.status === 0){
                new Toast('开门成功')
                if(typeof cb === 'function'){
                    cb()
                }
            }else{
                new Toast(res.msg)
                fail()
            }
        })
    }

    onLockDoor(){
        let user = Reflux.GlobalState.common
        loading.show()
        myAjax.post(getApiUrl('long-rental/close-door'), {
            uuid: user.uuid,
            sign: user.sign,
            car_id: this.state.car_id
        }, function(res){
            loading.hide()
            if(res.status === 0){
                new Toast('锁门成功')
            }else{
                new Toast(res.msg)
            }
        })
    }

    onGetPeccancy(id){
        let user = Reflux.GlobalState.common
        let that = this
        loading.show()
        myAjax.post(getApiUrl('peccancy/detail'), {
            uuid: user.uuid,
            sign: user.sign,
            id: id
        }, function(res){
            loading.hide()
            if(res.status === 0){
                that.setState({
                    p_create_time: res.data.create_time,
                    p_happen_time: res.data.happen_time,
                    p_handle_des: res.data.handle_des,
                    p_happen_addr: res.data.happen_addr,
                    p_happen_behavior: res.data.happen_behavior,
                    p_score: res.data.score,
                    p_fee: res.data.fee,
                    p_plate_no:res.data.plate_no,
                    p_engine_no:res.data.engine_no
                })
                history.push({
                    pathname:'/main/peccancy'
                })
            }else{
                new Toast(res.msg)
            }
        })
    }
}

CarStore.id = 'car'

export {CarActions, CarStore}