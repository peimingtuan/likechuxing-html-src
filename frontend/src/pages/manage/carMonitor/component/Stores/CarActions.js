/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: CarActions
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/1-下午3:08
 Description:
 Param:
 Return:
 *************************************************/
import Reflux from 'reflux'

export default Reflux.createActions([
    'getCars',
    'updateCars',
    'searchCars',
    'changeActiveCar',
    // 变更carList中的页码
    'changeCarListPage',
    'searchTrack',
    'saveCarTrack',
    'navigateMove'
])