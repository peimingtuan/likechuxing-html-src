/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/12-下午12:04
 Description:
 Param:
 Return:
 *************************************************/
require('./css/share.less')
require('./js/common')
import $ from 'jquery'
import Regular from '../../../js/Regular'
import footerText from './template/footer/footer'
import parseURL from '../../../js/parseURL'
import Loading from '../../../component/loading'
const query = parseURL(window.location.href).query
import wxShare from './js/thisWxShare'

wxShare(query.inviter_uuid)
import Login from '../../../component/login'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getActivityapiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";

footerText('立刻出行24小时客服电话：4006662333')

const INVITE_END = 1523116800
const ACTIVITY_END = 1523635200
let step = 0

$.get(getApiUrl('/time/get'), function (res) {
  let server_time = JSON.parse(res).data.timestamp
  if(server_time > ACTIVITY_END){
    step = 2
    new Alert({msg:'活动已结束，感谢您的关注'})
    return
  }

  if(server_time > INVITE_END){
    step = 1
    new Alert({msg:'邀请阶段已结束，您将无法助力好友'})
  }
})

$('#verify').click(function(){
  if(step>0){
    new Toast(['','邀请阶段已结束，已无法助力好友','活动已结束，感谢您的关注'][step])
    return
  }

  let phone = $('#phone').val()
  if(!Regular.phone.test(phone)){
    new Toast('请输入正确的手机号')
    return
  }

  let loading = new Loading()
  let data = {
    inviter_uuid : query.inviter_uuid,
    phone
  }
  myAjax.post(getApiUrl('/web/invite-user'), data, function (res) {
    loading.destroy()
    if (res.status === 0) {
      window.location.href = 'registerFinish.html?inviter_uuid='+query.inviter_uuid+'&n='+res.data.new_user
    } else {
      new Toast(res.msg)
    }
  })

})

/*
let login = new Login({
  phone: document.querySelector('#phone'),
  getCodeBtn: document.querySelector('#getCode'),
  code: document.querySelector('#code'),
  verifyBtn: document.querySelector('#verify'),
  getCode: function (phone, cb) {
    // send ajax request to get verifyCode,execute cb() when succeed
    myAjax.post(getApiUrl('/login/get-code'), {
      phone: phone
    }, function (res) {
      if (res.status === 0) {
        new Toast('发送成功')
        cb()
      } else {
        $('#getCode').removeClass('disabled')
        new Toast(res.msg)
      }
    })
  },
  verify: function (data) {
    data.inviter_uuid = query.inviter_uuid
    data.channel =  query.hasOwnProperty('channel') ? query.channel : 'inviteFriends2WxShare'
    myAjax.post(getApiUrl('/web/verify-code'), data, function (res) {
      if (res.status === 0) {
        $('#getCode').addClass('disabled')
        window.location.href = 'registerFinish.html?inviter_uuid='+query.inviter_uuid+'&n='+res.data.new_user
      } else {
        new Toast(res.msg)
      }
    })
  }
})
*/

