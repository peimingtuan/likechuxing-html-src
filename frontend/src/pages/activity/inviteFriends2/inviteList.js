/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: inviteList
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/26-下午2:50
 Description:
 Param:
 Return:
 *************************************************/
require('./css/inviteList.less')
require('./js/common')
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getActivityapiUrl'
import $ from 'jquery'
import Loading from '../../../component/loading'
import footerText from './template/footer/footer'

import InviteFriends2Data from './js/InviteFriends2Data'
let inviteFriends2Data = new InviteFriends2Data();
let user = inviteFriends2Data.getUser()

let loading = new Loading()
myAjax.post(getApiUrl('/activity-invite/list'), {
  uuid: user.uuid,
  sign: user.sign
}, function(res){
  loading.destroy()
  if(res.status === 0){
    loadList(res.data)
  }
})

function loadList(list){
  let str = '<li class="empty fs14"><p>还没有好友加入，</p>赶紧邀请更多好友加入立刻吧</li>'
  if(list.length > 0){
    str = list.map(item=> {
      let str = '<li class="item fs14">'+item.phone_no

      let desc = '<span class="float-right">尚未用车</span>'
      if(item.status === '10') desc = '<span class="float-right suc">用车成功</span>'
      if(item.status === '11') desc = '<span class="float-right">用车成功（超额）</span>'
      str+=desc + '</li>'
      return str
    })
  }
  $('.list').append(str).show()
  footerText()
}