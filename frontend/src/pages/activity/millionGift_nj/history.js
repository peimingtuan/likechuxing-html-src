/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: history
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:54
 Description:
 Param:
 Return:
 *************************************************/
require('./css/history.less')
require('./template/moneyBox.less')
require('./js/common')
import $ from 'jquery'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getApiUrl'
import Loading from '../../../component/loading'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'
import footerText from './template/footer/footer'
import MillionGiftData from './js/MillionGiftData'
import parseUrl from '../../../js/parseURL'
import format from '../../../js/function/format'
import wxShare from './js/thisWxShare'
wxShare()

const historyBox = require('./template/historyBox.pug')
const whiteBox = require('./template/whiteBox.pug')
const appMutual = new AppMutual()
let millionGiftData = new MillionGiftData();
let user = millionGiftData.getUser()
let loading = new Loading()

myAjax.post(getApiUrl('cash/log'), {
  uuid: user.uuid,
  sign: user.sign
}, function (res) {
  loading.destroy()
  if (res.status === 0) {
    loadBox(res.data)
  } else if (res.status === 6001) {
    new Alert({
      title: '登录信息已过期',
      confirmButtonCallback: appMutual.jumpIndexAndCloseThisWebview
    })
  } else {
    new Alert({
      title: res.msg,
      confirmButtonCallback: appMutual.jumpIndexAndCloseThisWebview
    })
  }
})

function loadBox(data) {
  let money = '0.00'
  let nether = `<div class="emptyHistory">
    <p class="fs13">快去开车，赚取更多的奖励吧！</p>
    <div class="key"></div>
</div>`

  if (data.length > 0) {
    let _money = 0
    nether = historyBox({
      list: data.map(item => {
        if(item.sign_type !== '0'){
          _money += item.change_value
        }
        return {
          time: format.time(item.time, 'YYYY.MM.DD HH:mm'),
          remain: item.remain_value,
          desc: item.type_des,
          change: (item.sign_type === '0' ? '+' : '-') + " " + item.change_value,
          sign_type: item.sign_type
        }
      })
    })
    money = format.money(_money)
  }

  let upper = `<div class="moneyBox">
    <div class="desc fs14">您已成功提取</div>
    <div class="money">
        <span class="num fs42">${money}</span>
    </div>
</div>`



  $('.history').append(whiteBox({
    upper,
    nether
  }))

  let cash = $('#cash')
  if (!millionGiftData.state.money) {
    cash.addClass('disabled')
  } else {
    cash.click(function () {
      if (millionGiftData.hasLastAccount()) {
        window.location.href = 'confirmAccount.html'
      } else {
        window.location.href = 'editAccount.html'
      }
    })
  }

  footerText()
}





