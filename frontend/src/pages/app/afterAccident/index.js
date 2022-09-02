/**
 * Created by garvey on 2017/9/7.
 */
import $ from 'jquery'
import myAjax from '../../../component/myAjax/withJq'
import {getApiUrl} from "../../../../other_modules/url-constructor";
import {Alert,Loading,Toast} from '../../../../other_modules/vue-plugins/like-base/index'
import appArguments from '../../../../other_modules/app-arguments'

require('../../../css/reset.css')
require('../../../component/rem')
require('./index.less')

setCss()
$('.btn').click(function(){
  if($(this).hasClass('disabled')) return;

  let that = this
  let loading = Loading()

  myAjax.post(getApiUrl("/ivr/trouble-call"),{
    uuid:appArguments.uuid,
    sign:appArguments.sign,
    city_name:appArguments.city_name,
    city_id:appArguments.city_id,
    user_lat:appArguments.user_lat,
    user_lng:appArguments.user_lng
  },function(res){
    loading.close()
    if(res.status === 0){
      $(that).addClass('disabled')
      countDown(60)
      Alert({
        title:'提交成功',
        msg:res.msg,
        confirmButtonText:'知道了'
      })
    }else{
      Toast(res.msg)
    }
  })
})

function countDown(time){
  if(time<1){
    $('.btn').text('联系事故处理专员').removeClass('disabled')
  }else{
    $('.btn').text('联系事故处理专员 '+time+'s')
    setTimeout(function(){
      countDown(time-1)
    },1000)
  }
}



function setCss() {
  let btn = document.querySelector('.footer')
  let height = window.innerHeight
  btn.style.marginTop = height - document.body.offsetHeight - 0 * REM + 'px'
}