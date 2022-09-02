/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: scoreExplain
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午5:55
 Description:
 Param:
 Return:
 *************************************************/
require('./css/scoreExplain.less')
require('./js/common')
import $ from 'jquery'

$('#what').click(function(){
    window.location.href = '/static/likeScore/introduce.html?footerColor=f2f2f2'
})

$('#useful').click(function(){
    window.location.href = '/static/likeScore/use.html?footerColor=f2f2f2'
})

$('#increase').click(function(){
    window.location.href = '/static/likeScore/increase.html?footerColor=f2f2f2'
})

$('#needKnow').click(function(){
    window.location.href = '/static/likeScore/mainPoint.html?footerColor=f2f2f2'
})