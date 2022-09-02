/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SDK
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/28-下午1:59
 Description:
 Param:
 Return:
 *************************************************/

import ENV from '../../../../../other_modules/like-env'

 window.SDK = {
   chooseImage:function(cb){
     wx.chooseImage({
       count: 1, // 默认9
       sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
       sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
       success: function (res) {
         console.log(res)
         let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
         if(ENV.isIos){
           wx.getLocalImgData({
             localId: localIds[0],
             success: function (res) {
               cb({
                 localId:localIds[0],
                 localShow:res.localData
               })
             }
           })
         }else{
           cb({
             localId:localIds[0],
             localShow:localIds[0]
           })
         }
       }
     });
   }
 }