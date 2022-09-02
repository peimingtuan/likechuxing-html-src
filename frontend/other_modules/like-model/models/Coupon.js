/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Coupon
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/9-下午3:34
 Description:
 Param:
 Return:
 *************************************************/
import '../../polyfills/index'
import format from "../../like-function/format";

export default class Coupon {
  constructor (coupon,isCash) {
    // 优惠券id
    this.id = Number(coupon.id)

    // 优惠券名称，显示给用户看
    this.name = coupon.name || '优惠券'

    // 优惠券是否可用，默认可用
    this.valid = 1

    // 使用门槛
    this.minimum = 0

    // 优惠券类型 1=现金抵扣，2=时长减免，3=免费券，4=通勤券，101=红包
    this.type = 0
    this.type_name = '优惠券'

    // 优惠券状态
    this.status = 0
    this.status_name = '未使用'

    // 减免金额，单位元，两位小数
    this.free_money = '0.00'

    // 减免时间，单位分钟，int型
    this.free_time = 0

    // 格式化后的减免时间，单位小时，保留1位小数，为整数时不保留小数
    this.free_time_h = '2'

    // 起止时间，单位秒，时间戳，int型
    this.time_start = 0
    this.time_end = 0

    // 起止时间格式化 "2017.01.01 - 2018.01.01 有效"
    this.time_text = ''

    // 券面显示描述，length不超过2
    this.conditions = []

    // 下拉显示的详细信息，自动增加index索引
    this.description = []

    // 优惠券的限制 - 直接返回到dec中
    this.limitDes = coupon.description ? coupon.description : coupon.des

    this.couponStyle = coupon.couponStyle>=0 ? coupon.couponStyle : ""

    // 新老版本接口适配
    if (coupon.hasOwnProperty('minimum')) {
      this._loadCouponV2(coupon,isCash)
    } else {
      this._loadCouponV1(coupon,isCash)
    }
  }

  _loadCouponV2 (coupon, isCash) {
    // 新版数据格式，接口大鹏写的，2018年10月初上线

    this.minimum = Number(coupon.minimum) || 0

    if(isCash){
      this.type = 101
    }else{
      this.type = Number(coupon.type)
    }

    this.type_name = this._getTypeName(this.type, this.minimum)

    this.status = Number(coupon.status)

    this.status_name = this._getStatusName(this.status)

    this.valid = coupon.hasOwnProperty('valid') ? Number(coupon.valid) : this.status === 0 ? 1 : 0

    this.free_money = Number(coupon.free_money)

    this.free_time = coupon.free_time

    this.free_time_h = (this.free_time/60).toFixed(1).replace(/\.0/,'')

    this.time_start = coupon.expire_start_time

    this.time_end = coupon.expire_end_time

    this.time_text = this._getTimeText(this.time_start, this.time_end)

    this.conditions = coupon.conditions.split('\n')

    this.description = coupon.description.split('\n')

    this.limitDes = coupon.instructions || this.conditions[0]
  }

  _loadCouponV1 (coupon) {
    // 旧版数据格式

    // 使用门槛
    this.minimum = Number(coupon.use_condition) || 0

    // type，旧版 0=无门槛券，1=有门槛满减券
    let type = Number(coupon.type)
    this.type = type < 2 ? 1 : type
    this.type_name = this._getTypeName(this.type, this.minimum)

    this.status = Number(coupon.coupon_status)
    this.status_name = this._getStatusName(this.status)
    this.valid = coupon.hasOwnProperty('valid') ? Number(coupon.valid) : this.status === 0 ? 1 : 0
    this.free_money = Number(coupon.value)
    this.free_time = this.type === 2 ? 120 : 0
    this.free_time_h = (this.free_time/60).toFixed(1).replace(/\.0/,'')

    if(coupon.hasOwnProperty('time')){
      this.time_text = coupon.time.replace('有效',' 有效')
    }else{
      this.time_text = this._getTimeText(coupon.begin_time,coupon.end_time)
    }


    let des = coupon.des.split('/')
    this.conditions = des.slice(0, 2)
    this.description = des.slice(2)
  }

  // type转type名
  _getTypeName (type, minimum) {
    switch (type) {
      case 1:
        return minimum > 0 ? '满减券' : '通用券'
      case 2:
        return '免费券'
      case 4:
        return '通勤券'
      case 101:
        return '红包'
      default:
        return '优惠券'
    }
  }

  // status转status名
  _getStatusName (status) {
    switch (status){
      case 0:
        return '未使用'
      case 1:
        return '已使用'
      case 2:
        return '已过期'
      default:
        return ''
    }
  }

  _getValueText (type, value) {
    return type === 2 ? '免费' : Math.floor(value)
  }

  _getTimeText (start, end) {
    // return format.time(start, 6) + ' - ' + format.time(end, 6) + ' 有效'
    return format.time(start, 6) + ' - ' + format.time(end, 6)
  }
}