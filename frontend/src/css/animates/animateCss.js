/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: animateCss
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/12-下午6:13
 Description:
 Param:
 Return:
 *************************************************/
import opClass from '../../js/function/opClass'

const animationEnd = (function(el) {
  let animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (let t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement('div'));

const animate = {
  add: function(ele, animateName, callback){
    if(typeof  callback === 'function'){
      let cb = function(){
        callback()
        ele.removeEventListener(animationEnd, cb)
      }
      ele.addEventListener(animationEnd, cb);
    }

    opClass.addClass(ele, 'animated ' + animateName)
  },

  once: function(ele, animateName, callback){
    this.add(ele, animateName, function(){
      opClass.removeClass(ele, animateName)
      if(typeof callback === 'function'){
        callback()
      }
    })
  }
}

export default animate