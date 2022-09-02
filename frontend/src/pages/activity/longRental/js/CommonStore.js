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

const CommonActions = Reflux.createActions([
    'changeState',
    'save',
    'load'
])

class CommonStore extends Reflux.Store{
    constructor(){
        super()
        this.listenables = CommonActions
        this.state={
            isLogin: false,
            uuid: '',
            sign: '',
            user_lat: 0,
            user_lng: 0,
            user_version: null,
            user_sys: '',
            user_sys_version: null,
            city_id: null,
            city_name: null,
            app_version: 0
        }
    }

    onChangeState(state){
        this.setState(state)
    }

    onSave(){
        localStorage.setItem('like_longRental',JSON.stringify(this.state))
    }

    onLoad(){
        let state_str = localStorage.getItem('like_longRental')
        let state
        if(state_str){
            state = JSON.parse(state_str)
        }
        if(state){
            //localStorage.removeItem('like_longRental')
            this.setState(state)
        }
    }
}

CommonStore.id = 'common'

export {CommonActions, CommonStore}