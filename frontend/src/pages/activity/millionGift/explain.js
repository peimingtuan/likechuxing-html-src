/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: explain
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午2:03
 Description:
 Param:
 Return:
 *************************************************/
 require('./css/explain.less')
require('./js/common')
import $ from 'jquery'
import parseURL from '../../../js/parseURL'
const activityExplain =require('./template/explain.pug')
import footerText from './template/footer'
import wxShare from './js/thisWxShare'
wxShare()


$('.details').append(activityExplain({
    channel:parseURL(window.location.href).query.channel
}))
footerText()
