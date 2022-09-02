/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: swiperControl
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-02-18:18
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
import Swiper from 'swiper/dist/js/swiper.min'
import 'swiper/dist/css/swiper.min.css'

export default new class SwiperControl{
  constructor () {
    this.swiper = null
  }

  init(elem,opt){
    this.swiper = new Swiper(elem, opt)
  }

  on(event,fun){
    this.swiper.on(event,function(){
      fun(this.swiper)
    }.bind(this))
  }

}