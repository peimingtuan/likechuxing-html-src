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
import {Alert, Toast, Loading} from '../../../../other_modules/vue-plugins/like-base/'
import myAjax from '../../../../other_modules/like-request/withAxiosV2'
import {getApiUrl} from "./js/getApiUrl";
import Time from '../../../js/function/Time'

const emptyBox = require('./component/EmptyList/index.pug')
const exchangeHistoryBox = require('./template/exchangeHistoryBox.pug')
const QRCodeBox = require('./template/QRCode.pug')
import PullUpDown from '../../../component/pullDonwRefresh'
import {appMutual} from '../../../../other_modules/app-mutual/'
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
let loading = Loading()

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
  myAjax.post(getApiUrl('point/order-list'), queryData).then(res=>{
    if (loading) {
      loading.close()
      loading = null
    }
    cb(res.data)
  })
}

function getExchangeBoxStr(data) {
  return data.map(item => {
    item.format_time = new Time(item.createtime).getTime('YYYY-MM-DD HH:mm')
    if (!item.extra_info) {
      item.extra_info = {}
    }
    switch (Number(item.status)){
      case 88:
        item.status_class = '';
        break;
      case 89:
        item.status_class = ''
        break;
      case 99:
        item.status_class = 'cancel';
        break;
      case 100:
        item.status_class = 'cancel';
        item.status_desc = '异常订单';
        break;
      default:
        item.status_class = 'during';
    }
    if(item.cate_id === 1 && item.is_used === '1'){
      item.status_desc = '已使用';
    }
    if(item.cate_id === 3 && /(话费|流量)/.test(item.extra_info.name)){
      item.status_desc = '已兑换'
    }
    
    return exchangeHistoryBox(item)
  }).join('')
}
function bindAction() {
	$('.list').on('click', '.copy', function (e) {
	  e.stopPropagation()
	    let code = $(this).attr('data-code')
	    appMutual.send.copy(code)
      Toast('复制成功')
	}).on('click', '.wuliu', function () {
	    let id = $(this).attr('data-id')
	    let goods = history.find(item => item.id == id)
	    memberMallData.save({
	      goodsDetail: goods
	    })
	    window.location.href = 'mailAddress.html'
	  }).on('click', '.qrcode', function(e){
    e.stopPropagation()
	    let code = $(this).attr('data-code')
	    showQRCode(code)
	    $('.mask .close').click(function(){
	      animateCss.add($('.mask')[0], 'fadeOut')
	      animateCss.add($('.mask .con')[0], 'zoomOut', function(){
	        $('.mask').remove()
	      })
	    })
	  }).on('click', '.ExchangeHistoryBox3', function(){
	  	//存储话费数据
	    let name = $(this).attr('data-name')
      if(/(话费|流量)/.test(name)){
        let id = $(this).attr('data-id');
        let goods = history.find(item => item.id == id)
        memberMallData.save({
          goodsDetail: goods
        })
        window.location.href = 'phoneDetail.html'
      }
	  })
}

function showQRCode(code){
  QRCode.toDataURL(code, { errorCorrectionLevel: 'H' }, function (err,url) {
    $('body').append(QRCodeBox())
    $('#qrcode').css({backgroundImage:'url('+url+')'})
  })
}
