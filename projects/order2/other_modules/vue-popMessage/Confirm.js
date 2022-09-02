/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Confirm
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/10-下午5:33
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue';
import Confirm_vue from './Confirm.vue'

const ConfirmConstructor = Vue.extend(Confirm_vue);

let Confirm = (options = {})=>{

  let confirm = new ConfirmConstructor({
    el: document.createElement('div'),
    data:{
      title:options.title || '',
      icon:options.icon || '',
      msg:typeof options.msg === 'string' ? [options.msg] : options.msg,
      confirmButtonText:options.confirmButtonText || '确定',
      cancelButtonText:options.cancelButtonText || '取消'
    }
  });

  confirm.$on('popDestroy',()=>{
    document.body.removeChild(confirm.$el);
  })

  if(typeof options.confirmButtonCallback === 'function'){
    confirm.$on('popConfirm',()=>{
      options.confirmButtonCallback()
    })
  }

  if(typeof options.cancelButtonCallback === 'function'){
    confirm.$on('popCancel',()=>{
      options.cancelButtonCallback()
    })
  }

  document.body.appendChild(confirm.$el);

}

export default Confirm;