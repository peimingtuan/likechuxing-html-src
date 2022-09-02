/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Vconsole
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-26-19:58
 * Description:
 *
 *************************************************/
import env from '../like-env'
const Vconsole = require('vconsole');

(function addStyle(){
  let style = document.createElement('style')
  style.rel='stylesheet'
  style.appendChild(document.createTextNode("#__vconsole .vc-switch{background-color: #111!important;}"));
  let head = document.getElementsByTagName("head")[0];
  head.appendChild(style)
})();

new Vconsole()
/*
if (env.isProduction){
  new Vconsole()
}*/
