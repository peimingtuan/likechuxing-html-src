/**
 * Created by garvey on 2017/9/7.
 */
import env from '../../../../other_modules/like-env'
import WxShare from './js/thisWxShare'
require('./index.less')
require('../../../component/rem')

WxShare()

document.querySelector('.footer').addEventListener('click',function(){
  if(env.isInLike){
    window.location.replace(window.location.href.replace('/inviteFriends4_oct/index.html','/inviteFriends4'))
  }else{
    let host = env.isProduction ? 'https://activity.likechuxing.com' : 'https://h5test.likechuxing.com'
    window.location.replace(host +'/activity/inviteFriends4')
  }
})
