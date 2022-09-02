/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mailAddress
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午6:01
 Description:
 Param:
 Return:
 *************************************************/
require('./css/mailAddress.less')
require('./js/common')
import $ from 'jquery'
const addressShow = require('./template/addressShow.pug')
import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData();
console.log(memberMallData.state.goodsDetail)
$('body').append(addressShow(memberMallData.state.goodsDetail))