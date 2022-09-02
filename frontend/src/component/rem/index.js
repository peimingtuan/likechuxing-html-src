/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/25-下午3:55
 Description:
 Param:
 Return:
 *************************************************/
//require('./index.less')
let deviceWidth = document.documentElement.clientWidth;
if(deviceWidth > 640) deviceWidth = 640;
window.REM = deviceWidth / 3.75
document.documentElement.style.fontSize = REM + 'px';
