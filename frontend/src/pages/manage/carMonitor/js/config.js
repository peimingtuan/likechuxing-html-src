/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: config.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/27-下午2:15
 Description:
 Demo:
 Others:
 *************************************************/
// 车辆状态值
const AllCarStatus = require('../../../../js/database/carStatus.json')
const maskStatus = [20,24,26,27,28,29,33,40] //屏蔽的状态值
const CarStatus = AllCarStatus.filter(item => maskStatus.indexOf(item.status) === -1)

export {CarStatus}
 