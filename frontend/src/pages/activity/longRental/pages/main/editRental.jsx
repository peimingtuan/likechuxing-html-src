import $ from "jquery";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: editRental
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/4-下午3:23
 Description:
 Param:
 Return:
 *************************************************/
require('./editRental.less')
import React from 'react'
import Reflux from 'reflux'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import format from '../../../../../js/function/format'
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import {Alert, Toast} from "../../component/LikeAlert/index";
import TimeSlider from '../../component/TimeSlider'
import Time from '../../../../../js/function/Time'
import MainBox from '../../component/MainBox'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import ContentBox from '../../component/ContentBox'

class TimeSelect extends Reflux.Component {
    constructor() {
        super()
        this.time = null
        this.store = IndexStore
        this.storeKeys = ['duration', 'startTime', 'endTime']
    }

    showTimePicker(index) {
        let that = this

        let startArray = [], endArray = []
        for (let i = this.state.duration[0][0]; i <= this.state.duration[0][1]; i += 86400) {
            startArray.push({
                time: i,
                text: getHumanDate(i) + ' <span class="limit_time">('+getHumanTime(i)+')</span>'
            })
        }
        for (let i = this.state.duration[1][0]; i <= this.state.duration[1][1]; i += 86400) {
            endArray.push({
                time: i,
                text: getHumanDate(i) + ' <span class="limit_time">('+getHumanTime(i)+')</span>'
            })
        }
        let startIndex = []
        if (this.state.startTime) {
            startIndex.push((this.state.startTime.time - this.state.duration[0][0]) / 86400)
            startIndex.push((this.state.endTime.time - this.state.duration[1][0]) / 86400)
        }
        this.time = new TimeSlider({
            group: [
                {
                    name: '取车时间',
                    data: startArray
                },
                {
                    name: '还车时间',
                    data: endArray
                }
            ],
            activeTab: index,
            startIndex,
            callback: function (data) {
                that.time = null
                IndexActions.changeState({
                    startTime: data[0].option,
                    endTime: data[1].option
                })
                IndexActions.getCost()
            },
            callbackCancel: function(){
                that.time = null
            }
        })
    }

    getTimeComponent() {
        let time = [
            <div key="start" className="empty_time" onClick={() => this.showTimePicker.call(this, 0)}>请选择取车时间</div>,
            <div key="end" className="empty_time" onClick={() => this.showTimePicker.call(this, 1)}>请选择还车时间</div>
        ]
        if (this.state.startTime && this.state.endTime) {
            let duration = Math.ceil((this.state.endTime.time - this.state.startTime.time) / 86400)
            time.push(<div key="dura" className="dura fs12">{duration} 天</div>)
        }

        if (this.state.startTime) {
            let str = getHumanDate(this.state.startTime.time) + ' ' + getHumanTime(this.state.startTime.time)
            let _data = str.split(' ')
            time[0] = <div key="start" className="time_con" onClick={() => this.showTimePicker.call(this, 0)}>
                <p>{_data[0] + ' ' + _data[1]}</p>
                <p className="fs13">{_data[2] + ' '+_data[3]}</p>
            </div>
        }
        if (this.state.endTime) {
            let str = getHumanDate(this.state.endTime.time) + ' ' + getHumanTime(this.state.endTime.time)
            let _data = str.split(' ')
            time[1] = <div key="end" className="time_con" onClick={() => this.showTimePicker.call(this, 1)}>
                <p>{_data[0] + ' ' + _data[1]}</p>
                <p className="fs13">{_data[2] + ' '+_data[3]}</p>
            </div>
        }

        return time
    }

    componentWillUnmount(){
        if(this.time){
            this.time.destroy()
        }
    }

    render() {
        let time = this.getTimeComponent.call(this)
        return (
            <div className="time_select">
                {time}
            </div>
        )
    }
}

export default class EditRental extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            show_tips: true
        }
        this.store = IndexStore
        this.storeKeys = [
            'modelList',
            'currentModelId',
            'startTime',
            'endTime',
            'startPoint',
            'endPoint',
            'rent_fee',
            'deposit',
            'save_fee',
            'actual_fee'
        ]
    }

    componentDidMount() {
        appMutual.sendUpdateTitle('日期及网点选择')
        IndexActions.initEditRental()
    }

    componentDidUpdate(){
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < (window_height - 10)){
            $('.btn_long').css('margin-top',window_height - height)
        }
    }

    chooseBranch(type) {
        history.push({
            pathname:'/chooseBranch/index',
            search:'?type='+type+'&from=edit'
        })
    }

    toPay() {
        if (this.getFinishBoolean.call(this)) {
            IndexActions.createRental()
        }
    }

    hideTips() {
        this.setState({
            show_tips: false
        })
    }

    getPointComponent() {
        let point = [
            <div className="point_name red">请选择取车网点</div>,
            <div className="point_name red">请选择还车网点</div>
        ]
        if (this.state.startPoint) {
            point[0] = <div className="point_name dark">{this.state.startPoint.branch_name}</div>
        }
        if (this.state.endPoint) {
            point[1] = <div className="point_name dark">{this.state.endPoint.branch_name}</div>
        }
        return point
    }

    getCostComponent() {
        let fee = {
            actual: '-',
            rent: '-',
            deposit: '-',
            save: '-'
        }
        if (this.state.actual_fee > 0) {
            fee = {
                actual: format.money(this.state.actual_fee),
                rent: format.money(this.state.rent_fee),
                deposit: format.money(this.state.deposit),
                save: '- ' + format.money(this.state.save_fee)
            }
        }
        return fee
    }

    getFinishBoolean() {
        let state = this.state
        return state.startTime && state.endTime && state.startPoint && state.endPoint && state.actual_fee
    }

    render() {
        let car = this.state.modelList.find(item => item.id === this.state.currentModelId)
        let point = this.getPointComponent.call(this)
        let fee = this.getCostComponent.call(this)
        let finish = this.getFinishBoolean.call(this)

        return <div className="EditRental">
            <div className={"tips fs12 red " + (this.state.show_tips ? '' : 'hidden')}>
                <span className="icon_suona"/>
                <span>租车日期超过(含) 15 天，减免一天费用</span>
                <span className="icon_close_red" onClick={this.hideTips.bind(this)}/>
            </div>
            <MainBox>
                <div className="editContent">
                    <ContentBox className="car_info no_paddingTop">
                        <div className="desc">
                            <div className="name fs20">{car.model_name}</div>
                            <div className="price fs14">日均: <span className="fs18 money">{car.day_price}</span> 元/天
                            </div>
                        </div>
                        <img className="img" src={car.car_img}/>
                    </ContentBox>
                    <ContentBox title="请选择长租日期" calssName="time_parent">
                        <TimeSelect/>
                    </ContentBox>
                    <ContentBox title="请选择长租网点">
                        <div className="branch_select">
                            <div className="start_point point fs14" onClick={() => this.chooseBranch.call(this, 0)}>
                                <div className="label">取车网点：</div>
                                {point[0]}
                            </div>
                            <div className="end_point point fs14" onClick={() => this.chooseBranch.call(this, 1)}>
                                <div className="label">还车网点：</div>
                                {point[1]}
                            </div>
                        </div>
                    </ContentBox>
                    <ContentBox title="收费标准" className="no_border">
                        <div className="cost">
                            <div className="total fs14">
                                需支付金额：{fee.actual} 元
                                <span className="qa" onClick={() => {
                                    history.push('/explains')
                                }}/>
                            </div>
                            <div className="item fs13">长租费用：{fee.rent} 元</div>
                            <div className="item fs13">保证金费用：{fee.deposit} 元</div>
                            <div className="item fs13">长租优惠：{fee.save} 元<span className={"icon_discount "+ (fee.save == '-'? 'hidden' : '')} /></div>
                            <a className={"toPay btn_long fs16 " + (finish ? '' : 'disabled')}
                               onClick={this.toPay.bind(this)}>支付长租费用</a>
                        </div>
                    </ContentBox>
                </div>
            </MainBox>
        </div>
    }
}

let Yinli = [
    {start: 1517788800, end: 1517875199, text: "腊月二十"},
    {start: 1517875200, end: 1517961599, text: "腊月廿一"},
    {start: 1517961600, end: 1518047999, text: "腊月廿二"},
    {start: 1518048000, end: 1518134399, text: "腊月廿三"},
    {start: 1518134400, end: 1518220799,text: "腊月廿四"},
    {start: 1518220800, end: 1518307199,text: "腊月廿五"},
    {start: 1518307200, end: 1518393599,text: "腊月廿六"},
    {start: 1518393600, end: 1518479999,text: "腊月廿七"},
    {start: 1518480000, end: 1518566399,text: "腊月廿八"},
    {start: 1518566400, end: 1518652799,text: "腊月廿九"},
    {start: 1518652800, end: 1518739199,text: "除夕"},
    {start: 1518739200, end: 1518825599,text: "大年初一"},
    {start: 1518825600, end: 1518911999,text: "大年初二"},
    {start: 1518912000, end: 1518998399,text: "大年初三"},
    {start: 1518998400, end: 1519084799,text: "大年初四"},
    {start: 1519084800, end: 1519171199,text: "大年初五"},
    {start: 1519171200, end: 1519257599,text: "大年初六"},
    {start: 1519257600, end: 1519343999,text: "大年初七"},
    {start: 1519344000, end: 1519430399,text: "大年初八"},
    {start: 1519430400, end: 1519516799,text: "大年初九"},
    {start: 1519516800, end: 1519603199,text: "大年初十"},
    {start: 1519603200, end: 1519689599,text: "正月十一"},
    {start: 1519689600, end: 1519775999,text: "正月十二"},
    {start: 1519776000, end: 1519862399,text: "正月十三"},
    {start: 1519862400, end: 1519948799,text: "正月十四"},
    {start: 1519948800, end: 1520035199,text: "正月十五"},
    {start: 1520035200, end: 1520121599,text: "正月十六"},
    {start: 1520121600, end: 1520207999,text: "正月十七"},
    {start: 1520208000, end: 1520294399, text: "正月十八"}
]

function getYinli(timeStamp) {
    let offset = 8*3600
    let currentDay = Yinli.find(item=>{
        return ((item.start - offset) <= timeStamp && (item.end - offset) >= timeStamp)
    })
    return currentDay ? currentDay.text : ''
}

function getHumanDate(timeStamp) {
    let time = new Time(timeStamp)
    return time.getTime('M月D日 周W') + ' ' + getYinli(timeStamp)
}

function getHumanTime(timeStamp){
    let min = new Date(timeStamp*1000).getMinutes()
    if(min < 10){
        min = '0' + min
    }
    return new Date(timeStamp*1000).getHours() + ':' + min
}


 