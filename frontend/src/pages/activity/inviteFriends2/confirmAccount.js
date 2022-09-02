import API from "../../../../../projects/order/src/common/apiAddress";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: confirmAccount
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:57
 Description:
 Param:
 Return:
 *************************************************/
require('./css/confirmAccount.less')
require('./js/common')
require('./template/whiteBox.less')
import $ from 'jquery'

import footerText from './template/footer/footer'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getActivityapiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import Loading from '../../../component/loading'
import Desensitized from '../../../js/function/Desensitized'
import InviteFriends2Data from './js/InviteFriends2Data'

let inviteFriends2Data = new InviteFriends2Data();
let user = inviteFriends2Data.getUser()

let money = inviteFriends2Data.state.money
let account = inviteFriends2Data.state.account || inviteFriends2Data.state.last_account, account_mask = ''
let realname = inviteFriends2Data.state.realname || inviteFriends2Data.state.last_realname, realname_mask = ''

if (account.length > 1) {
  if (/@/.test(account)) {
    account_mask = Desensitized.email(account)
  } else if (/^\d{15,16}$/.test(account)) {
    account_mask = Desensitized.bankAccount(account)

  } else {
    account_mask = Desensitized.mobilePhone(account)
  }
}
if (realname.length > 0) {
  realname_mask = Desensitized.chineseName2(realname)
}

$('#money').text(Number(money))
$('#realname').text(realname_mask)
$('#account').text(account_mask)

if (!inviteFriends2Data.state.account) {
  $('.edit_btn').remove()
} else {
  $('.edit_btn').click(function () {
    window.location.href = 'editAccount.html'
  })
}

$('#transfer').click(function () {
  let loading = new Loading()
  let data = {
    uuid: user.uuid,
    sign: user.sign
  }

  data.realname = realname
  data.account = account
  data.transfer_type = 1
  myAjax.post(getApiUrl('cash/transfer'), data, function (res) {
    loading.destroy()
    if (res.status === 0) {
      new Alert({
        title: '提现成功，点击确定返回首页',
        confirmButtonCallback: function () {
          window.location.href = 'index.html?uuid=' + inviteFriends2Data.state.uuid + '&sign=' + inviteFriends2Data.state.sign + '&user_version=ios_2013'
        }
      })
    } else {
      new Toast(res.msg)
    }
  })

})

footerText()


