/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Order
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/25-下午2:06
 Description:
 Param:
 Return:
 *************************************************/
import format from '../Format'

export default class Order {
  constructor(order) {
    this.rental_no=order.rental_no
    this.distance=order.distance
    this.time=order.time
    this.fee_total=format.money(order.fee_total)
    this.price_desc=order.price_desc
    this.price_extra=order.price_extra
    this.km_fee=order.km_fee
    this.time_fee=order.time_fee
    this.coupon_fee=order.coupon_fee
    this.balance=order.balance
    this.actual_fee=format.money(order.actual_fee)
    this.car_id=order.car_id
    this.parking_fee_in=order.parking_fee_in
    this.discount_time=order.discount_time
    this.discount_km=order.discount_km
    this.discount_msg=order.discount_msg
    this.discount_fee=order.discount_fee
    this.money=format.money(order.money)
    this.charge_des=order.charge_des
    this.coupon_cnt = Number(order.coupon_cnt)
  }
}
