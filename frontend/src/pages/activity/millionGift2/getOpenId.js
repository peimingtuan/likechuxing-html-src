/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: getOpenId
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/15-上午10:24
 Description:
 Param:
 Return:
 *************************************************/
import parseURL from '../../../js/parseURL'
import $ from 'jquery'

let query = parseURL(window.location.href).query
$('#openId').text(query.open_id)