/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: editAccount
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午1:58
 Description:
 Param:
 Return:
 *************************************************/

require('./css/editAccount.less')
require('./js/common')
import $ from 'jquery'

import {Alert, Toast} from "./component/LikeAlert/index";
import footerText from './template/footer/footer'
import InviteFriends2Data from './js/InviteFriends2Data'

let inviteFriends2Data = new InviteFriends2Data();

footerText()
if (inviteFriends2Data.isEditAgain()) {
  $('#account').val(inviteFriends2Data.state.account)
  $('#realname').val(inviteFriends2Data.state.realname)
}

$('.main_color_btn').click(function () {
  if(checkInput()){
    window.location.href = 'confirmAccount.html'
  }
})

function checkInput() {
  let account_val = $('#account').val().replace(/(^\s*)|(\s*$)/g, ""),
    realname_val = $('#realname').val().replace(/(^\s*)|(\s*$)/g, "")
  if (account_val === '') {
    new Toast('请输入账号')
    return false
  }
  if (realname_val === '') {
    new Toast('请输入姓名')
    return false
  }

  inviteFriends2Data.save({
    account: account_val,
    realname: realname_val
  })
  return true
}

