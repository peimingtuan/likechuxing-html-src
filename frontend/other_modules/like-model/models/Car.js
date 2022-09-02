/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Car
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-05-17:07
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/

export default class Car {
  constructor (car) {

    this.id = Number(car.id)
    this.plate_no = car.plate_no
    this.vin = car.vin
    this.vin_h =car.vin ? car.vin.substr(-6,6) : ''
    this.status = car.status
    this.status_name = car.status_name || car.car_status
    // 车型
    this.model_name = car.model_name
    // 续航
    this.remain_km = car.remain_km || car.remain

    this.color = car.color || ''

  }

}