/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: download
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/11-下午6:25
 Description:
 Param:
 Return:
 *************************************************/

require('./download.less')
import $ from 'jquery'
import downloadUrl from '../../../component/downloadUrl'
import {IsIos} from "../../../js/UserAgent";
import wx from './js/thisWxShare'
wx()
require('../../../component/rem')

$('.bg').height(window.innerHeight)

$('#download').click(function(){
    if(IsIos()){
        window.location.href = downloadUrl.appleStore
    }else{
        window.location.href = downloadUrl.yingyongbao
    }
})