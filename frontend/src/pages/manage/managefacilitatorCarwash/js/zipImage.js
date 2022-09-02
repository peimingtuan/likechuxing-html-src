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
 * 图片压缩，默认同比例压缩
 * @param {String} src
 *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
 * @param {Object} obj
 *   obj 对象 有 width， height， quality(0-1)
 * @param {Function} cb
 *   回调函数有一个参数，base64的字符串数据
 */

export default function compressImage(src, obj, cb) {
  //console.log(src,obj)
  let cvs = document.createElement('canvas')
    cvs.width = 500;
    cvs.height = 600;
  let ctx = cvs.getContext('2d')
  let img = new window.Image()
  img.style.display = 'none'

  // 跨域图片不能通过canvas.toDataUrl输出
  img.setAttribute('crossOrigin', 'anonymous');

  img.onload = function () {
    let that = this
    // 默认按比例压缩
    let w = that.width,
      h = that.height,
      scale = w / h;
    w = obj.width || w;
    h = obj.height || (w / scale);
    let quality = 0.7;  // 默认图片质量为0.7
    ctx.drawImage(img, 0, 0, w, h)
    cb(cvs.toDataURL('image/jpeg', quality))
    setTimeout(() => {
      document.body.removeChild(img)
    }, 0)
  }
  document.body.appendChild(img)

  img.src = src

}