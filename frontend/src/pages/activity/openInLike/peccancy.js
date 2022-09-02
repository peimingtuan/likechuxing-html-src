/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/2-下午3:18
 Description:
 Demo:
 Others:
 *************************************************/
//require('../../../component/vconsole')
require('./css/style.less')
require('../../../component/rem')
import env from '../../../../other_modules/like-env'
import {openApp} from '../../../../other_modules/app-mutual'

const toDownload = function(){
  if(env.isIos){
    window.location.href = 'https://itunes.apple.com/cn/app/id1245529926?mt=8'
  }else{
    window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
  }
}

openApp.rentalPeccancy()
setTimeout(toDownload,3000)




