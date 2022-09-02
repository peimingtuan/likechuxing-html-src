import $ from "jquery";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: willFinish
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/17-下午8:48
 Description:
 Param:
 Return:
 *************************************************/
require('./willFinish.less')
import React from 'react'
import Reflux from 'reflux'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import {Alert, Toast, Confirm} from "../../component/LikeAlert/index";
import BMapLocation from '../../js/BMapLocation'
import {appMutual} from '../../../../../../other_modules/app-mutual'

export default class willFinish extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            floor_placeholder: '请选择楼层（必填）',
            floor:'请选择楼层（必填）',
            no_placeholder:'请输入车位号',
            no:'请输入车位号'
        }
        this.store = RentalStore
        this.storeKeys = [
            'current_end_branch_id',
            'current_end_branch_name'
        ]
    }

    componentDidMount() {
        appMutual.send.updateTitle('还车检测')
        RentalActions.initWillFinish()
    }
    carDamage(){
        if(!this.state.current_end_branch_id){
            new Toast('未检测到附近网点');
            return
        }
        if(this.state.floor === this.state.floor_placeholder){
            new Toast('请输入楼层')
            return
        }
        RentalActions.changeState({
            end_parking_floor:this.state.floor,
            end_parking_no:this.state.no === this.state.no_placeholder ? '' : this.state.no
        })
        history.push({
            pathname:'/carDamage/chooseDamage',
            search:'?type=aft'
        })
    }

    changeFloor(e){
        this.setState({
            floor:e.target.value
        })
    }

    changeNo(e){
        this.setState({
            no:e.target.value
        })
    }

    focus(type){
        if(this.state[type] === this.state.floor_placeholder || this.state[type] === this.state.no_placeholder){
            this.setState({
                [type]:''
            })
        }
    }

    blur(type){
        if(type === 'floor'){
            if(this.state.floor.replace(/(^\s*)|(\s*$)/g, "") === ''){
                this.setState({
                    floor:this.state.floor_placeholder
                })
            }
        }else{
            if(this.state.no.replace(/(^\s*)|(\s*$)/g, "") === ''){
                this.setState({
                    no:this.state.no_placeholder
                })
            }
        }
    }

    refresh(){
        BMapLocation(function(){
            RentalActions.initWillFinish()
        })
    }

    render() {
        return <div className="WillFinish">
            <div className="willFinish">
                <div className="willFinishBox1">
                    <p className="branchTitle">系统检测</p>
                    <div className="branchName">
                        {this.state.current_end_branch_name}
                        <span className="red change_end_point" onClick={this.refresh.bind(this)}>刷新</span>
                    </div>
                </div>
                <div className="willFinishBox1">
                    <p>楼层</p>
                    <input type="text" maxLength="10" className={this.state.floor === this.state.floor_placeholder?'red':''} value={this.state.floor} onBlur={()=>this.blur.call(this,'floor')} onFocus={()=>this.focus.call(this,'floor')} onChange={this.changeFloor.bind(this)}/>
                </div>
                <div className="willFinishBox1">
                    <p>车位号</p>
                    <input type="text" maxLength="10" className={this.state.no === this.state.no_placeholder?'red':''} value={this.state.no} onBlur={()=>this.blur.call(this,'no')} onFocus={()=>this.focus.call(this,'no')} onChange={this.changeNo.bind(this)}/>
                </div>
                <div className="willFinBtn"><a className={"btn_long fs16 " + ((this.state.floor === this.state.floor_placeholder || this.state.floor === '')? 'disabled' : '')} onClick={this.carDamage.bind(this)}>添加还车验车单</a></div> 
            </div>
        </div>
    }
}


 