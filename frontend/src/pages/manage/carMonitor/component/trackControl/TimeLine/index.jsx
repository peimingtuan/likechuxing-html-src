/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/6-下午1:32
 Description:
 Param:
 Return:
 *************************************************/
require('./index.less')
import React from 'react'
import Reflux from 'reflux'
import CarStore from '../../Stores/CarStore'
import CarActions from '../../Stores/CarActions'
import TrackSearchStore from '../../Stores/TrackSearchStore'
import $ from '../../../../../../../other_modules/jquery&ui/jquery&ui'
import Time from '../../../../../../js/function/Time'

function points2px(points){
    let start = Reflux.GlobalState.trackSearch.track_start_time
    let end = Reflux.GlobalState.trackSearch.track_end_time
    let step = (end - start)/700
    return {
        width: Math.floor((points[1].loc_time - points[0].loc_time)/step),
        left: Math.floor((points[0].loc_time - start)/step)
    }
}

export default class TimeLine extends Reflux.Component {
    constructor() {
        super()
        this.sliderBar= null
        this.state = {
            // 是否播放状态值
            isNavigatePlaying: false
        }
        this.stores = [TrackSearchStore, CarStore]
        this.storeKeys = [
            'search_type',
            'carListType',
            'track'
        ]
    }

    componentDidMount() {
        // 播放轨迹动画时反馈回来的时间参数
        CarActions.navigateMove.listen(this.listenNavigateMove.bind(this))
        $( "#navigate_speed" ).slider({
            create: function() {
                $( "#custom-handle" ).text('速度');
            },
            range: "min",
            max: 20000,
            min: 1000,
            slide: function(e, ui){
                window.mapControl.navigateSetSpeed(ui.value)
            }
        });

        let that = this
        $(this.refs.time_now).text(new Time(Reflux.GlobalState.trackSearch.track_start_time).getTime('D日 HH:mm'))
        this.sliderBar = $(this.refs.process_bar).slider({
            min: Reflux.GlobalState.trackSearch.track_start_time,
            max: Reflux.GlobalState.trackSearch.track_end_time,
            slide: function(e, ui){
                $(that.refs.time_now).text(new Time(ui.value).getTime('D日 HH:mm'))
                mapControl.moveNavigatePoint(ui.value)
            }
        })
    }

    // 将动画的反馈到slider上
    listenNavigateMove(time){
        $(this.refs.process_bar).slider("value", time)
        $(this.refs.time_now).text(new Time(time).getTime('D日 HH:mm'))
    }

    componentWillUpdate(e, newStore){
        if(this.state.track.points.length !== newStore.track.points.length){
            this.initComponent()
        }
    }

    // 播放、暂停按钮
    handlePlayPauseBtn(){
        if(this.state.isNavigatePlaying){
            window.mapControl.navigatePause()
            $(this.refs.process_bar).slider('enable')
        }else{
            window.mapControl.navigatePlay()
            $(this.refs.process_bar).slider('disable')
        }
        this.setState({
            isNavigatePlaying:!this.state.isNavigatePlaying
        })
    }

    // 重新初始化TimeLine
    initComponent(){
        this.setState({
            isNavigatePlaying: false
        })
        this.sliderBar.slider('option', {
            min: Reflux.GlobalState.trackSearch.track_start_time,
            max: Reflux.GlobalState.trackSearch.track_end_time,
        })
        $(this.refs.time_now).text(new Time(this.sliderBar.slider('value')).getTime('D日 HH:mm'))
    }

    render() {
        let isHidden = this.state.track.points.length === 0 || this.state.search_type === '1' || this.state.carListType === '0'
        return <div className={"TimeLine " + (isHidden ? 'hidden': '')}>
            <div className="controls">
                <div className={"play_pause pointer " + (this.state.isNavigatePlaying?'pause':'')} onClick={this.handlePlayPauseBtn.bind(this)} />
                <div className="speed">
                    播放速度
                    <div id="navigate_speed"/>
                </div>
            </div>
            <div className="line">
                <div className="bar_container">
                    <div className="background_bar" ref='process_bar' >
                        <span className="ui-slider-handle ui-corner-all ui-state-default" >
                            <div className="time_now" ref="time_now" />
                        </span>
                    </div>
                    <ul className="effect_con">
                        {this.state.track.continual.map(item => <li className="item activeBar bar" style={points2px(item)} key={item[0].loc_time}/>)}
                    </ul>
                </div>
            </div>
        </div>
    }
}