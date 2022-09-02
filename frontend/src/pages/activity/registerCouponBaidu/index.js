/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/14-下午8:30
 Description:
 Param:
 Return:
 *************************************************/
import parseURL from '../../../js/parseURL'

const query = parseURL(window.location.search).query
const channel = query.hasOwnProperty('channel') ? query.channel : 'baidu_tuiguang'

window.location.href = 'https://activity.likechuxing.com/activity/registerCoupon2?channel='+channel