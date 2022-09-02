/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/3-下午1:41
 Description:
 Param:
 Return:
 *************************************************/
 import './index.less'

const IMG = [
  require('./helpCenter/step_01.jpg'),
  require('./helpCenter/step_02.jpg'),
  require('./helpCenter/step_03.jpg'),
  require('./helpCenter/step_04.jpg'),
  require('./helpCenter/step_05.jpg')
]

let container = document.querySelector('#step')

const loadImg = function(index){
  let img = document.createElement('img')
  img.src= IMG[index]
  if(index < IMG.length-1){
    img.onload = function(){
      loadImg(index+1)
    }
  }


  container.appendChild(img)
}

loadImg(0)