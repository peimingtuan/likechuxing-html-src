/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: registerFinish
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/26-下午2:18
 Description:
 Param:
 Return:
 *************************************************/
require('./css/registerFinish.less')
 import parseURL from '../../../js/parseURL'
import $ from 'jquery'
import downloadUrl from "../../../component/downloadUrl";
import {IsIos} from "../../../js/UserAgent";
import wxShare from './js/thisWxShare'
import footerText from './template/footer/footer'

const query = parseURL(window.location.href).query
wxShare(query.inviter_uuid)

if(String(query.n) === '1'){
  $('.n').show()
}else{
  $('.o').show()
}
footerText('立刻出行24小时客服电话：4006662333')
$('.download').click(function(){
  if (IsIos()) {
    window.location.href = downloadUrl.appleStore
  } else {
    window.location.href = downloadUrl.yingyongbao
  }
})