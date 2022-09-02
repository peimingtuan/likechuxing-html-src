/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: ReportActions
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午2:59
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'

export default Reflux.createActions([
    // 变更激活菜单栏目
    'changeMenuIndex',
    // 切换菜单打开/折叠状态
    'switchMenuFold',
    // 改变停留点查询字段
    'changeTrackStopQueryString',
    // 改变停留点查询时间
    'changeTrackStopDate',
    // 搜索停留点
    'searchTrackStop'
])