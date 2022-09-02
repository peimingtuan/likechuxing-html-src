/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/18-下午10:00
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue';
import Loading_vue from './Loading.vue'

const LoadingConstructor = Vue.extend(Loading_vue);

let Loading = (options = {}) => {
  options = typeof options === 'string' ? {
    title: options
  } : options

  let loading = new LoadingConstructor({
    el: document.createElement('div'),
    data: {
      text: options.title || '加载中...'
    }
  });

  loading.$on('popDestroy', () => {
    document.body.removeChild(loading.$el);
  })

  document.body.appendChild(loading.$el);

  return loading

}

export default Loading;