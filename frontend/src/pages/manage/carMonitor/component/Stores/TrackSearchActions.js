/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: TrackSearchActions
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/29-下午4:02
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'

export default Reflux.createActions([
    // 请求基础数据（城市list）
    'getCityList',
    // 切换搜索栏类型
    'changeSearchType',
    // 改变搜索条件
    'changeSearchString',
    // 变更轨迹监控模块车辆列表类型
    'switchCarListType',
    'setTrackTime',
    'changeState',
    // 存储单车轨迹
    'saveCarTrack',
])