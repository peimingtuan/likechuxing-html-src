/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: carPrice
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-29-13:32
 * Description:
 *
 *************************************************/
import format from '../../like-function/format'

export default class CarPrice {
  constructor (data){
    this.price_order = []

    if(data.car_price_text){
      let text = data.car_price_text

      if(/%3c/i.test(text))text = decodeURIComponent(text.replace(/\+/g,' '))

      text.replace(/(\d\.\d{2}|元\/分钟|元\/公里)/g,match=> {
        this.price_order.push(match)
      })

    }else{
      this.price_order.push(format.money(data.price_km))
      this.price_order.push('元/公里')
      this.price_order.push(format.money(data.price_min))
      this.price_order.push('元/分钟')
    }
  }

  getPrice(){
    return this.price_order.concat()
  }

  getPricePureText(){
    return this.price_order[0]+this.price_order[1]+' + '+this.price_order[2]+this.price_order[3]
  }


}