/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: exchangeSuccess
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午6:03
 Description:
 Param:
 Return:
 *************************************************/
require('./css/exchangeSuccess.less')
require('./js/common')
import $ from 'jquery'
import {Toast, Alert, Confirm} from "../../../component/LikeAlert/index";

const successBox = require('./template/successBox/successBox.pug')
const successBox5 = require('./template/successBox/type5.pug')
import getEnv from '../../../js/env'
import AppMutual from '../../../component/AppMutual'

const appMutual = new AppMutual()
import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData();
import QRCode from 'qrcode'

init(memberMallData.state.goodsExchange)

function init(goods) {
  let box_str = successBox(goods)
  if (goods.type === 5) {
    box_str = successBox5(goods)
  }

  $('.btn_con').before(box_str)

  if(goods.type === 5){
    QRCode.toDataURL(goods.coupon_val, { errorCorrectionLevel: 'H' }, function (err,url) {
      $('#qrcode').css({backgroundImage:'url('+url+')'})
    })
  }

  $('.toMall').click(function () {
    let url = 'https://'
    if (getEnv() === 'production') {
      url += 'h5.likechuxing.com'
    } else {
      url += 'h5test.likechuxing.com'
    }
    url += '/app/memberMall'
    appMutual.sendUrl(url)
  })

  $('.toIndex').click(function () {
    appMutual.jumpIndexAndCloseThisWebview()
  })

  $('#copy').click(function () {
    appMutual.sendCopy(goods.coupon_val)
    setTimeout(function () {
      new Toast('复制成功')
    }, 600)
  })
}