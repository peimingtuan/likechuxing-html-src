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
//require('../../../component/vconsole')
require('./css/style.less')
import env from '../../../../other_modules/like-env'
import Umeng from '../../../component/umeng'
import appArguments from '../../../../other_modules/app-arguments'
import {appMutual} from '../../../../other_modules/app-mutual'
import {getH5Url,getApiUrl} from "../../../../other_modules/url-constructor";
import myAjax from '../../../../other_modules/like-request/withAxiosV3'

if(env.isDev){
  new Umeng(1275259068)
}else{
  new Umeng(1275259086)
}

const addTextToLoading = function(text){
  if(!text)text = '跳转中...'

  document.querySelector('#loading').appendChild(document.createTextNode(text))
}

const getLocalFlag = function(){
  const LOCAL_NAME = 'like_activity_userAwoke'

  let local_flag = window.localStorage.getItem(LOCAL_NAME)

  if(local_flag){
    return local_flag
  }else{
    let type = appArguments.type
    if(['a','b'].indexOf(type)>-1){
      window.localStorage.setItem(LOCAL_NAME,type)
      return type
    }else{
      return false
    }
  }
}

const callApp = function(type){
  const delay = 600

  if(type === 'login'){
    setTimeout(function(){
      appMutual.jump.loginAndCloseThisWebview({
        destroy_current:1
      })
    },delay)
  }else{
    setTimeout(function(){
      appMutual.send.url({
        destroy_current:1,
        url:getH5Url('/app/coupons')
      })
    })
  }
}

const jump = function(){
  const step = appArguments.step

  if(Number(step) === 1){
    const type = getLocalFlag()

    if(['a','b'].indexOf(type)>-1){
      window._czc.push(["_trackEvent",'login',appArguments.user_version,type]);
    }
    callApp('login')
  }else{
    window._czc.push(["_trackEvent",'expired',appArguments.user_version]);
    callApp('coupon')
  }
}

const postMsg = function(){
  myAjax.post(getApiUrl('/activity/banner-reg-remind'),{
    activity_id:1099,
    channel_id:9139,
    device_name:appArguments.device_name,
    device_id:appArguments.device_id,
    city_id:appArguments.city_id,
    user_sys_version:appArguments.user_sys_version,
    user_lat:appArguments.user_lat,
    user_lng:appArguments.user_lng
  }).then(res=>{
    jump()
  }).catch(err=>{
    jump()
  })
}

addTextToLoading()

postMsg()











