/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/11/14-5:10 PM
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.less')
require('../../../component/rem')
import $ from 'jquery'
import {getApiUrl} from "../../../../other_modules/url-constructor";
import myAjax from "../../../../other_modules/like-request/withAxiosV2";
import toast from '../../../component/toast'
import Loading from '../../../component/loading'
import Umeng from '../../../component/umeng'
// 打开app
new Umeng(1275543998)

//$('#code').parents().show()
let time_flag = null

function countDown(count){
  if(count === 0){
    $('.count').text('重新获取')
  }else {
    if(count < 60){
      $('.count').text(count+'s')
    }

    time_flag = setTimeout(function(){
      countDown(--count)
    },1000)
  }
}

let is_getCode = false

$('#phone').on('input',function(){
  if($(this).val()===''){
    $('#phone_clear').hide()
  }else{
    $('#phone_clear').show()
  }
})
$('#code').on('input',function(){
  if($(this).val()===''){
    $('#code_clear').hide()
  }else{
    $('#code_clear').show()
  }
})
$('#phone_clear').on('click',function(){
  $(this).hide()
  $('#phone').val('')
  $('#code').val('').parent().hide()
  if(time_flag){
    clearTimeout(time_flag)
    $('.count').text('已发送')
  }

  is_getCode = false
})
$('#code_clear').on('click',function(){
  $(this).hide()
  $('#code').val('')
})

$('.count').click(function(){
  if($(this).text()!=='重新获取'){
    return
  }

  let phone = $('#phone').val()
  if(!/^1[3456789]\d{9}$/.test(phone)){
    toast('请输入正确的电话号码')
    return
  }

  let loading = new Loading()
  myAjax.post(getApiUrl('/login/get-code'),{
    phone
  }).then(res=>{
    loading.destroy()
    if(res.status === 0 || res.status === 3016){
      is_getCode = true
      $('#code').parent().show()
      countDown(60)
    }else{
      toast(res.msg)
    }
  })
})

$('.btn').click(function(){
  let phone = $('#phone').val()

  if(!is_getCode){

    if(!/^1[3456789]\d{9}$/.test(phone)){
      toast('请输入正确的电话号码')
      return
    }

    let loading = new Loading()
    myAjax.post(getApiUrl('/login/get-code'),{
      phone
    }).then(res=>{
      loading.destroy()
      if(res.status === 0 || res.status === 3016){
        is_getCode = true
        $('#code').parent().show()
        countDown(60)
      }else{
        toast(res.msg)
      }
    })
  }else{
    let code = $('#code').val()
    if(!/^1[3456789]\d{9}$/.test(phone)){
      toast('请输入正确的电话号码')
      return
    }

    if(!/^\d{4}$/.test(code)){
      toast('请输入正确格式的验证码')
      return
    }

    let loading = new Loading()
    myAjax.post(getApiUrl('/web/verify-code'),{
      phone,
      code,
      channel:'0_9141'
    }).then(res=>{
      loading.destroy()
      if(res.status === 0){
        window.location.replace('/activity/longRentalPromote/finish.html')
      }else{
        toast(res.msg)
      }
    })

  }

})
