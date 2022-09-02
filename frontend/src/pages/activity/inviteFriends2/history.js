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
require('./js/common')
import $ from 'jquery'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getActivityapiUrl'
import Loading from '../../../component/loading'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'
import footerText from './template/footer/footer'
import InviteFriends2Data from './js/InviteFriends2Data'
import format from '../../../js/function/format'
import Desensitized from '../../../js/function/Desensitized'

const historyBox = require('./template/historyBox.pug')
const appMutual = new AppMutual()
let inviteFriends2Data = new InviteFriends2Data();
let user = inviteFriends2Data.getUser()
let loading = new Loading()

myAjax.post(getApiUrl('/activity-invite/cash-list'), {
  uuid: user.uuid,
  sign: user.sign
}, function (res) {
  console.log(res)
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
  let nether = ''
  let _money = 0
  if (data.length > 0) {
    nether = historyBox({
      list: data.map(item => {
        if (item.type === '51') {
          _money += Number(item.change_value)
        }
        return {
          type: String(item.type),
          phone_no: Desensitized.mobilePhone(String(item.phone_no)),
          time: format.time(item.time, 'YYYY.MM.DD HH:mm'),
          remain: item.remain_value,
          change_value: (item.type === '1' ? '+' : '-') + item.change_value,
        }
      })
    })
    $('#money').text(_money)
  } else {
    nether = `<li class="empty">
    <p class="fs13">赶紧邀请更多好友加入立刻吧</p>
    <div class="key"></div>
</li>`
  }

  $('.list').append(nether).show()
  footerText()
}





