/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Toast.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/4-下午1:44
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue';
import Toast_vue from './Toast.vue'

const ToastConstructor = Vue.extend(Toast_vue);

let Toast = (options = {}) => {
  options = typeof options === 'string' ? {
    msg: options
  } : options

  let toast = new ToastConstructor({
    data:{
      msg:options.msg,
      duration:options.duration || 2500
    },
    el: document.createElement('div')
  });

  toast.$on('popDestroy', () => {
    document.body.removeChild(toast.$el);

    // 如果有，执行消失后的回调
    if (typeof options.toastCallback === 'function') {
      options.toastCallback()
    }
  })

  // 加载toast
  document.body.appendChild(toast.$el);
}

export default Toast;
