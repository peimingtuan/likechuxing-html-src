/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/11-下午6:23
 Description:
 Param:
 Return:
 *************************************************/
//require('../../../component/vconsole')
require('./css/index.less')
require('../../../component/rem')
import Umeng from '../../../../other_modules/like-tool/Umeng'
import appArguments from '../../../../other_modules/app-arguments'
import {appMutual} from '../../../../other_modules/app-mutual'
import $ from 'jquery'
import toast from '../../../component/toast'
import {getApiUrl,getActivityUrl} from "../../../../other_modules/url-constructor";
import myAjax from "../../../../other_modules/like-request/withAxiosV2";
import Loading from '../../../component/loading'

$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

const umeng = new Umeng(1275901736)

const gift_data = [
  {value: 300, gift: 150, stage: 6, monthly: 25},
  {value: 600, gift: 600, stage: 6, monthly: 100},
  {value: 1200, gift: 1200, stage: 6, monthly: 200}
]

let sign = appArguments.like_sign || appArguments.sign

console.log(sign,appArguments)

function delay(time,fun){
  setTimeout(fun,time)
}

function loadPreData () {
  let btns = $('.btns')
  gift_data.forEach((item, index) => {
    let btn = `<div class="btn faster" data-id="${index}"><div class="name">充${item.value}送${item.gift}</div><div class="desc">赠送余额分${item.stage}月返还<br/>每月返${item.monthly}</div></div>`
    btns.append(btn)

    delay(600*(index+1),function () {
      $('.btn').eq(index).animateCss('pulse')
    })
  })

}

function selectValue(value){
  myAjax.postPage(getApiUrl('/charge/pay'),{
    uuid:appArguments.uuid,
    sign:sign,
    city_id:appArguments.city_id,
    money:value,
    return_url:getActivityUrl('/activity/recharge2?city_id='+appArguments.city_id+'&uuid='+appArguments.uuid+'&like_sign='+sign)
  })
}

loadPreData(gift_data)

$('.btns').on('click','.btn',function(){
  let btn = $(this)
  btn.addClass('active')
  setTimeout(function(){
    btn.removeClass('active')
  },100)

  let index = this.dataset.id
  let gift = gift_data[index]
  umeng.addEvent(['click','value',gift.value])

  setTimeout(function(){
    let loading = new Loading()
    selectValue(gift.value)
  },100)
})

if(!appArguments.uuid || !sign){
  appMutual.jump.loginAndCloseThisWebview({
    destroy_current:1
  })
}else{
  myAjax.post(getApiUrl('/web/check-login'),{
    uuid:appArguments.uuid,
    sign:sign
  }).then(res=>{
    if(res.status === 6001){
      appMutual.jump.loginAndCloseThisWebview({
        destroy_current:1
      })
    }else if(res.status !== 0){
      toast(res.msg)
    }
  })
}

if(appArguments.toast)toast(appArguments.toast)





