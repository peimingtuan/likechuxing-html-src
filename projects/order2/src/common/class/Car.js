/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Car
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/23-下午12:18
 Description:
 Param:
 Return:
 *************************************************/
export default class Car {
  constructor(car) {
    this.id = car.id
    this.plate_no = car.plate_no // 车牌号
    this.car_pic = car.car_pic	// 	车型图片url

    this.remain_km = car.remain_km // 续航
    this.brand_name = car.brand_name // 车辆品牌
    this.model_name = car.model_name // 车型
    this.box_cnt = car.box_cnt	// 	车厢数
    this.seat_cnt = /座/.test(car.seat_cnt)? car.seat_cnt : car.seat_cnt+"座"	// 	座位数
    this.power_type = car.power_type	// 	动力类型
    this.gear_type = car.gear_type	// 	档位类型
    this.max_km = car.max_km	// 	最大里程

    this.price_extra = car.price_extra	// 	动态价格
    this.price_km = car.price_km	// 	里程费价格
    this.price_min = car.price_min	// 	时间费价格

    this.parking_fee = car.parking_fee	// 	停车费金额
    this.balance_refund = car.balance_refund //补偿余额

    this.is_limit = car.is_limit	// 	车辆限行：1：限行 0：不限行
    this.is_tomorrow_limit = car.is_tomorrow_limit	// 	（v2.1.3）明日车辆限行：1：限行 0：不限行
  }
}
