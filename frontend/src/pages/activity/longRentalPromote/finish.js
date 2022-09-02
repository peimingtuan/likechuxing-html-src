/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: finish.js
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-16-13:59
 * Description:
 *
 *************************************************/
require('./css/finish.less')
require('../../../component/rem')
import env from '../../../../other_modules/like-env'
import Loading from '../../../component/loading'
import {openApp} from '../../../../other_modules/app-mutual'
import Umeng from '../../../component/umeng'
new Umeng(1275543998)

document.querySelector('.btn').addEventListener('click',function(){
  let loading = new Loading()
  openApp.mainIndex()
  setTimeout(function(){
    loading.destroy()
    if(env.isIos){
      window.location.href = 'https://itunes.apple.com/cn/app/id1245529926?mt=8'
    }else{
      window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
    }
  },3000)
})

