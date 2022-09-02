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
import appArguments from '../../../../other_modules/app-arguments'
import {appMutual} from '../../../../other_modules/app-mutual'

require('./css/index.less')

if(appArguments.in_app && appArguments.app_version >= 2109){

  appMutual.jump.recharge({
    destroy_current:1
  })
}else{
  document.querySelector('.loading').style.display = 'none'
  document.querySelector('.bg').style.display = 'block'
}


