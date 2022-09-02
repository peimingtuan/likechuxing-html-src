/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-上午10:35
 Description:
 Param:
 Return:
 *************************************************/

require('./css/index.less')
require('./template/whiteBox.less')
require('./js/common')
import $ from 'jquery'
const activityExplain = require('./template/explain.pug')
import footerText from './template/footer/footer'
import myAjax from './js/myAjax'
import getApiUrl from '../../../js/getActivityapiUrl'
import {Alert, Toast} from "./component/LikeAlert/index";
import AppMutual from '../../../component/AppMutual'

const appMutual = new AppMutual()
import Loading from '../../../component/loading'
import InviteFriends2Data from './js/InviteFriends2Data'
let inviteFriends2Data = new InviteFriends2Data();

$('.details').append(activityExplain())
let loading = new Loading()
let user = inviteFriends2Data.getUser()
myAjax.post(getApiUrl('/user/get-status'), {
  uuid: user.uuid,
  sign: user.sign
}, function(res){
  if(res.status === 0){
    if(res.data.auth_status !== '0'){
      loading.destroy()
      new Alert({
        msg:'请先到个人中心完成身份认证，再来参加活动',
        confirmButtonText:'去认证',
        confirmButtonCallback: function(){
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
      return
    }

    if(res.data.deposit_status !== '2'){
      loading.destroy()
      new Alert({
        msg:'请先到个人中心缴纳保证金，再来参加活动',
        confirmButtonText:'去缴保证金',
        confirmButtonCallback: function(){
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
      return
    }

    init()
  }
})


function init(){
  myAjax.post(getApiUrl('/activity-invite/info'), {
    uuid: user.uuid,
    sign: user.sign,
    transfer_type: 1
  }, function (res) {
    loading.destroy()
    if (res.status === 0) {
      if(res.data.is_limit !== 0){
        loading.destroy()
        new Alert({
          title:'抱歉',
          msg:'您的账号无法参加此次活动。',
          confirmButtonText:'确定',
          confirmButtonCallback: function(){
            appMutual.jumpIndexAndCloseThisWebview()
          }
        })
        return
      }

      inviteFriends2Data.save({
        money: res.data.cash,
        invite_cnt: res.data.invite_cnt || 0,
        last_realname:res.data.realname,
        last_account:res.data.account
      })
      loadBox(res.data)
    } else if (res.status === 6001) {
      new Alert({
        title: '请前往个人中心登录',
        confirmButtonCallback: function () {
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
    } else {
      new Alert({
        title: res.msg+'\n请重试',
        confirmButtonCallback: function () {
          appMutual.jumpIndexAndCloseThisWebview()
        }
      })
    }
  })
}

function loadBox(data) {
  let money = String(data.cash).replace('.00','')
  $('#money').text(money)
  $('#invite-num').text(data.invite_cnt)

  const cash = $('#cash')
  if (Number(money) === 0) {
    cash.addClass('disabled')
  } else {
    cash.removeClass('disabled')
    cash.click(function () {
      if(inviteFriends2Data.hasLastAccount()){
        window.location.href = 'confirmAccount.html'
      }else{
        window.location.href = 'editAccount.html'
      }
    })
  }

  footerText()

  $('.invite').click(function(){
    window.location.href = 'inviteList.html'
  })

  $('#toHistory').click(function () {
    window.location.href = 'history.html'
  })
}

