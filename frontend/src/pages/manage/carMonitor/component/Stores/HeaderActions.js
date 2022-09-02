/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: CommonActions
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/29-下午4:20
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'

export default Reflux.createActions([
    'printThis',
    'changePathname',
    // 更新自动刷新icon角度
    'updateClockPointDeg',
    // 显示Loading
    'loadingShow',
    // 隐藏Loading
    'loadingHide'
])