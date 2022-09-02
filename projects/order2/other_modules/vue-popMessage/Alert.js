/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Alert
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-下午4:54
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue';
import Alert_vue from './Alert.vue'

const AlertConstructor = Vue.extend(Alert_vue);

let Alert = (options = {})=>{

  let _alert = new AlertConstructor({
    el: document.createElement('div'),
    data:{
      title:options.title || '',
      icon:options.icon || '',
      msg:typeof options.msg === 'string' ? [options.msg] : options.msg,
      confirmButtonText:options.confirmButtonText || '确定'
    }
  });

  _alert.$on('popDestroy',()=>{
    document.body.removeChild(_alert.$el);
  })
  if(typeof options.confirmButtonCallback === 'function'){
    _alert.$on('popConfirm',()=>{
      options.confirmButtonCallback()
    })
  }
  document.body.appendChild(_alert.$el);

}

export default Alert;
