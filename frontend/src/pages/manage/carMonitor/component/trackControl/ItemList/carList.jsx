/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carList
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/2-上午10:19
 Description:
 Param:
 Return:
 *************************************************/
require('./carList.less')
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import CarStore from '../../Stores/CarStore'
import CarActions from '../../Stores/CarActions'
import Pagination from '../../base/Pagination'
import TrackTab from './trackTab'
import TrackDatePicker from '../TrackDatePicker'
import Time from '../../../../../../js/function/Time'
import {translateStatus} from '../../../../../../js/function/translateStatus'

export default class carList extends Reflux.Component {
    constructor() {
        super()
        this.stores = [TrackSearchStore, CarStore]
        this.storeKeys = [
            'search_type',
            'itemListShowRow',
            'carListType',

            'carList',
            'carListPage',
            'activeCar'
        ]
    }

    changePage(page){
        CarActions.changeCarListPage(page)
    }

    clickItem(car){
        if(car.equal(this.state.activeCar)){
            CarActions.changeActiveCar({})
            if(this.state.carListType === '0'){
                // 实时位置
                mapControl.hideActiveCarInfoWindow()
            }else{
                // 轨迹

            }
        }else{
            CarActions.changeActiveCar(car)
            if(this.state.carListType === '0'){
                // 实时位置
                mapControl.showActiveCarInfoWindow(car)
                mapControl.panTo(car.getGPSArray())
            }else{
                // 轨迹
                CarActions.searchTrack()
            }

        }
        mapControl.carsLayer.renderLater()
    }

    render() {
        return <div className={"CarList "+(this.state.search_type !== '0'?'hidden':'')}>
            <TrackTab/>
            <TrackDatePicker/>
            <ul className="list">
                {this.state.carList.slice((this.state.carListPage-1)*this.state.itemListShowRow, this.state.carListPage*this.state.itemListShowRow).map(item => (
                    <li key={item.id} className={"row "+ ((this.state.activeCar && item.id === this.state.activeCar.id) ? 'active': '')} onClick={() => this.clickItem.call(this,item) }>
                        <span className="name" >{item.plate_no}</span>
                        <span className="status">-{translateStatus.status2desc('car', item.status)}</span>
                        <span className="time" >{new Time(item.tbox_time).fromNow()}</span>
                    </li>
                ))}
            </ul>
            <Pagination page_index={this.state.carListPage} page_total={Math.ceil(this.state.carList.length/this.state.itemListShowRow)} changePage={this.changePage.bind(this)}/>
        </div>
    }
}
 