/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.LoatOrder.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/4-下午4:14
 Description:
 Param:
 Return:
 *************************************************/
const OrderStatus = require('./orderStatus')
import format from '../../../../../other_modules/like-function/format'
import {maskIdCardNum2} from "../../../../../other_modules/like-function/desensitized";

 export default class LostOrder {
   constructor (data){
     this.id = Number(data.id) || 0
     this.status = Number(data.status)
     this.statusDesc = OrderStatus.find(sta => sta.status === this.status).name

     this.car_id = data.car_id
     this.plate_no = data.plate_no
     this.vin = data.vin
     this.vin_front = this.vin.substring(0, this.vin.length - 7)
     this.vin_end = this.vin.substring(this.vin.length - 7, this.vin.length - 1)

     // the lost stuff
     this.lost = data.lost
     this.lost_detail = data.lost_detail

     // photo of the lost stuff
     this.photo = data.photo_string ? data.photo_string : []

     // photo of owner's id or license
     this.photo_get = data.owner_photo
     this.remark = data.remark

     this.owner_phone = data.owner_phone
     this.owner_idcard = data.owner_idcard
     this.owner_idcard_m = maskIdCardNum2(this.owner_idcard)

     this.create_time = data.create_time
     this.create_time_h = format.time(this.create_time, 0)
     this.update_time = data.update_time
     this.update_time_d = data.update_time ? format.during(Date.parse(new Date()) / 1000 - this.update_time) : data.last_time
   }
}