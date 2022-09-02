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
require('./css/index.css')
require('../../../component/rem')
import $ from 'jquery'
import Umeng from '../../../component/umeng'

new Umeng(1274517068)
import appArguments from '../../../../other_modules/app-arguments'
import {appMutual} from '../../../../other_modules/app-mutual'

$('#img').attr('src', require('./images/oldApp2.jpg'))
$('#btn').remove()
if (appArguments.app_version >= 2109) {
  if (appArguments.login) {
    appMutual.jump.recharge({
      destroy_current: 1
    })
  } else {
    appMutual.jump.loginAndCloseThisWebview({
      destroy_current: 1
    })
  }
}