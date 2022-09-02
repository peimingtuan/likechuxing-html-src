/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Track
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/7-上午10:34
 Description:
 Param:
 Return:
 *************************************************/
import React from 'react'
import Reflux from 'reflux'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import TrackSearchActions from '../../Stores/TrackSearchActions'

export default class Track extends Reflux.Component {
    constructor() {
        super()
        this.state = {
            menuList: [
                {key: 'setting_track_processed', name: '轨迹纠偏'},
                {key: 'setting_track_mapMatch', name: '去噪绑路', parent: 'setting_track_processed'},
                {key: 'setting_track_supplement', name: '里程补偿', parent: 'setting_track_processed'}
            ]
        }
        this.store = TrackSearchStore
    }

    switchTrack(item) {
        if(item.hasOwnProperty('parent') && !this.state[item.parent]){
            return
        }
        TrackSearchActions.changeSettings(item.key, !this.state[item.key])
    }

    render() {
        return <div className={"Settings Track" + (this.state.carListType === '0'? ' hidden':'')}>
          <i className="iconfont icon-guijitu setting_icon"/>
            <ul className="menu boxShadow">
                <li className="title">计算优化</li>
                {this.state.menuList.map(item => {
                    if(item.hasOwnProperty('parent')){
                        return (
                            <li className={"item" + (this.state[item.parent]?"":" disabled")} key={item.key}>
                                <label>
                                    <input type="checkbox"
                                           onChange={() => this.switchTrack.call(this,item)}
                                           checked={this.state[item.key]}/>
                                    {item.name}
                                </label>
                            </li>
                        )
                    }else{
                        return (
                            <li className='item' key={item.key}>
                                <label>
                                    <input type="checkbox"
                                           onChange={() => this.switchTrack.call(this,item)}
                                           checked={this.state[item.key]}/>
                                    {item.name}
                                </label>
                            </li>
                        )
                    }
                    }
                )}
            </ul>
        </div>
    }
}
 