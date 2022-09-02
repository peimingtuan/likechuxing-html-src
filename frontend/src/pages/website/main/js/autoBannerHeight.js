/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: autoBannerHeight
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/19-下午2:44
 Description:
 Param:
 Return:
 *************************************************/
 import $ from 'jquery'

export default function(){
  let width = window.innerWidth
  $('.banner').height(width/2)
}

