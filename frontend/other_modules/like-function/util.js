/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: util
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/6-下午2:17
 Description:
 Param:
 Return:
 *************************************************/
 const getTimestamp = function (date) {
   if(date){
     return Math.floor(new Date(date).getTime() / 1000)
   }else{
     return Math.floor(new Date().getTime() / 1000)
   }
}

export {
   getTimestamp
}