/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: during
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/28-上午10:53
 Description:
 Param:
 Return:
 *************************************************/
 export default function duration2(time){
  let d = Math.floor(time/86400)
  let h = Math.floor(time%86400/3600)
  let m = Math.floor(time%3600/60)
  let str = ''
  if(d>0)
    str+=d+'天';
  if(h>0)
    str+=h+'小时';
  str+=m+'分钟';
  return str
}