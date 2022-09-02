/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: imgzip
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/6-上午10:28
 Description:
 Param:
 Return:
 *************************************************/
/**
 * 转base64
 */

export default function compressImage(url,callback) {
    const Img = new Image()
    let dataURL=''
    Img.src=url;
    Img.setAttribute('crossOrigin', 'anonymous');
    Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
        var canvas = document.createElement("canvas"), //创建canvas元素
        width=Img.width, //确保canvas的尺寸和图片一样
        height=Img.height;

        canvas.width=width/4;
        canvas.height=height/4;
        canvas.getContext("2d").drawImage(Img,0,0,width/4,height/4); //将图片绘制到canvas中
        dataURL=canvas.toDataURL('image/jpeg',0.7); //转换图片为dataURL
        console.log(dataURL)
        callback?callback(dataURL):null; //调用回调函数
    };
  }