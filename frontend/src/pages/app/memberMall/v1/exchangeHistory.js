/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: exchangeHistory
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午5:59
 Description:
 Param:
 Return:
 @xurr on 2018/06/06  添加话费劵兑换逻辑
 *************************************************/
require('./css/exchangeHistory.less')
require('./js/common')
import Loading from '../../../component/loading'
import myAjax from '../../../component/myAjax/withJq'
import Time from '../../../js/function/Time'
import getApiUrl from "./js/getApiUrl"

const emptyBox = require('./component/EmptyList/index.pug')
const exchangeHistoryBox = require('./template/exchangeHistoryBox.pug')
const QRCodeBox = require('./template/QRCode.pug')
import PullUpDown from '../../../component/pullDonwRefresh'
import AppMutual from '../../../component/AppMutual'

const appMutual = new AppMutual()
import {Toast, Alert, Confirm} from "../../../component/LikeAlert/index";
import QRCode from 'qrcode'
import $ from 'jquery'
import animateCss from '../../../css/animates/animateCss.js'

import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData();
const user = memberMallData.getUser()
let queryData = {
  uuid: user.uuid,
  sign: user.sign,
  page: 1
}
let pullUpDown = null
let history = []
let loading = new Loading()

if (user) {
  bindAction()
  getData(function (data) {
    if (data.length === 0) {
      $('body').append(emptyBox({type: 'gift', text: '当前暂无兑换'}))
    } else {
      $('.list').height($(window).height())
      history = data

      pullUpDown = new PullUpDown({
        listClassName: 'exchangeList',
        parent: document.querySelector('.list'),
        pullDownRefresh: function (cb) {
          queryData.page = 1
          getData(function (data) {
            history = data
            cb()
            pullUpDown.changeContent(getExchangeBoxStr(data))
          })
        },
        pullUpLoad: function (cb) {
          queryData.page++
          getData(function (data) {
            if (data.length === 0) {
              cb(false)
              return
            }
            history = history.concat(data)
            pullUpDown.appendContent(getExchangeBoxStr(data))
            cb(true)
          })
        }
      })
      pullUpDown.changeContent(getExchangeBoxStr(data))
    }
  })
}

function getData(cb) {
  myAjax.post(getApiUrl('point/order-list'), queryData, function (res) {
    if (loading) {
      loading.destroy()
      loading = null
    }
    cb(res.data)
  })
}


function getExchangeBoxStr(data) {
	//xurr 假数据
	var dataName={
			"id":"3359",
			"car_id":"0",
			"create_at":"1520850712",
			"extra_info":{"coupon_val":"ada1dad1",
							"name":"100 元话费","small_image":"https://imagestest.likechuxing.com/activity/huafei_30.png"},
			"format_time":"2018-03-02 17:39",
			"good_id":"8",
			"is_used":"0",
			"point":"300",
			"status":"1",
			"status_class":"during",
			"status_desc":"待充值",
			"type":"7",
			"uid":"708",
			"update_at":"1520850712",
			"uuid":"SP33231526950151",
	}
	data.push(dataName);
	//假数据结束
  return data.map(item => {
    item.format_time = new Time(item.create_at).getTime('YYYY-MM-DD HH:mm')
    if (!item.extra_info) {
      item.extra_info = {}
    }
    switch (item.status){
      case '88':
        item.status_class = '';
        break;
      case '99':
        item.status_class = 'cancel';
        break;
      case '100':
        item.status_class = 'cancel';
        item.status_desc = '异常订单';
        break;
      default:
        item.status_class = 'during';
    }
    if(item.type === '0' && item.is_used === '1'){
      item.status_desc = '已使用';
    }
    
    return exchangeHistoryBox(item)
  }).join('')
}
function bindAction() {
	$('.list').on('click', '.copy', function () {
	    let code = $(this).attr('data-code')
	    appMutual.sendCopy(code)
	    new Toast('复制成功')
	}).on('click', '.copy', function () {
	    let code = $(this).attr('data-code')
	    appMutual.sendCopy(code)
	    new Toast('复制成功')
	}).on('click', '.wuliu', function () {
	    let id = $(this).attr('data-id')
	    let goods = history.find(item => item.id == id)
	    memberMallData.save({
	      goodsDetail: goods
	    })
	    window.location.href = 'mailAddress.html'
	  }).on('click', '.qrcode', function(){
	    let code = $(this).attr('data-code')
	    showQRCode(code)
	    $('.mask .close').click(function(){
	      animateCss.add($('.mask')[0], 'fadeOut')
	      animateCss.add($('.mask .con')[0], 'zoomOut', function(){
	        $('.mask').remove()
	      })
	    })
	  }).on('click', '.ExchangeHistoryBox7', function(){
	  	//存储话费数据
	    let id = $(this).attr('data-id');
	    let goods = history.find(item => item.id == id)
	    memberMallData.save({
	      goodsDetail: goods
	    })
	    window.location.href = 'phoneDetail.html'
	  })
}

function showQRCode(code){
  QRCode.toDataURL(code, { errorCorrectionLevel: 'H' }, function (err,url) {
    $('body').append(QRCodeBox())
    $('#qrcode').css({backgroundImage:'url('+url+')'})
  })
}
