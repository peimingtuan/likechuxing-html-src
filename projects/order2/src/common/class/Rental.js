/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: rental
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/23-下午9:12
 Description:
 Param:
 Return:
 *************************************************/
import Branch from './Branch'
import Car from './Car'
import POI from "./POI";
import format from '../Format'

export default class Rental {
  constructor(rental) {
    this.rental_id = rental.rental_id 	//	行程id
    this.guide_img = rental.guide_img //	车钥匙图片
/*    this.plate_no = rental.plate_no	//	车牌号
    this.brand_name = rental.brand_name	//	品牌名称
    this.model_name = rental.model_name	//	车型名称
    this.gear_type = rental.gear_type	//	档类型：自动档 手动档
    this.car_pic = rental.car_pic	//	车型图Url
    this.price_km = rental.price_km	//	里程价格
    this.price_min = rental.price_min	//	时间价格
    this.price_extra = rental.price_extra	//	动态价格*/
    this.is_rental_begin = rental.is_rental_begin	//	是否开始计费
    this.is_car_begin = rental.is_car_begin	//	是否开车门
    this.total_time = rental.total_time	//	总时长 单位：秒
    this.total_km = rental.total_km	//	总公里数 KM
    this.total_money = rental.total_money	//	总费用 元
/*    this.begin_branch_id = rental.begin_branch_id	//	取车网点id
    this.begin_branch_name = rental.begin_branch_name	//	取车网点名称
    this.begin_branch_addr = rental.begin_branch_addr	//	取车网点地址
    this.begin_branch_walk_addr = rental.begin_branch_walk_addr	//	取车网点步行地址*/
    this.begin_parking_floor = rental.begin_parking_floor	//	取车车位楼层
    this.begin_parking_no = rental.begin_parking_no	//	取车车位编号
/*    this.begin_walk_remark = rental.begin_walk_remark	//	取车网点备注
    this.walk_overall_view = rental.walk_overall_view	//	取车全景图*/
/*    this.end_branch_id = rental.end_branch_id	//	还车网点id
    this.end_branch_name = rental.end_branch_name	//	还车网点名称
    this.end_branch_addr = rental.end_branch_addr	//	还车网点地址
    this.end_drive_addr = rental.end_drive_addr	//	还车网点车行地址
    this.end_drive_remark = rental.end_drive_remark	//	还车网点标注*/
    this.left_free_time = rental.left_free_time	//	剩余免费取车时间(单位:秒)
    this.walk_lat = rental.walk_lat	//	步行导航纬度
    this.walk_lng = rental.walk_lng	//	步行导航经度
/*    this.drive_lat = rental.drive_lat	//	车行导航纬度
    this.drive_lng = rental.drive_lng	//	车行导航经度*/
/*    this.drive_overall_view = rental.drive_overall_view	//	还车全景图*/
    this.need_photo = rental.need_photo	//	1：需要用车拍照 0：不需要
 /*   this.begin_branch_lat = rental.begin_branch_lat	//	取车网点纬度
    this.begin_branch_lng = rental.begin_branch_lng	//	取车网点经度*/
    this.begin_branch_unzoned = rental.begin_branch_unzoned	//	1：随意还 0：非随意还
    this.begin_branch_car_cnt = rental.begin_branch_car_cnt	//	取车网点可用车辆数
    this.driving_license_url = rental.driving_license_url	//	行驶证的url
    this.car_overall_view = rental.car_overall_view	//	车内全景的url
    this.check_car_list_url = rental.check_car_list_url	//	验车单的url
    this.begin_time = format.time(rental.begin_time,9)	//	开始计费时间
/*    this.parking_fee_in = rental.parking_fee_in	//	入场停车费*/
    this.parking_fee_out = rental.parking_fee_out	//	出场停车费
    /*this.seat_cnt = rental.seat_cnt	//	座位数 5座
    this.power_type = rental.power_type	//	动力类型：燃油车*/
    this.power_charge_des = rental.power_charge_des	//	动力充值描述： 充电接口 快充
    this.notify_branch = rental.notify_branch	//	1:弹提示 0:不弹
    this.km_money = rental.km_money	//	里程费
    this.min_money = rental.min_money	//	分钟费
/*    this.is_limit = rental.is_limit	//	是否限行： 1限行 0不限行*/
    this.power_charge_key = rental.power_charge_key	//	汽油类型或充电类型
    this.power_charge_value = rental.power_charge_value	//	汽油类型或充电类型值：快充、92#
/*    this.is_tomorrow_limit = rental.is_tomorrow_limit	//	明日是否限行： 1限行 0不限行*/
    this.parking_fee_refund = rental.parking_fee_refund	//	停车费返还余额
    this.discount_msg = rental.discount_msg	//	优惠的描述(可以根据这个字的来判断是否有优化,没有优惠值为空字符串 “”).1.4添加
    this.discount_title = rental.discount_title	//	H5的费用详情使用优惠的描述(可以根据这个字的来判断是否有优化,没有优惠值为空字符串 “”).1.4添加
    this.discount_fee = rental.discount_fee	//	优惠的价格.1.4添加
    this.discount_time = rental.discount_time	//	优化的时间,已经格式化 app2.1.4添加
    this.discount_km = rental.discount_km	//	优惠的里程 app2.1.4添加

    this.begin_branch = new Branch({
      id: rental.begin_branch_id,
      name: rental.begin_branch_name,
      addr: rental.begin_branch_addr,
      lat: rental.begin_branch_lat,
      lng: rental.begin_branch_lng,

      walk_addr: rental.begin_branch_walk_addr,
      walk_remark: rental.begin_walk_remark,
      walk_overall_view: rental.walk_overall_view,

      car_cnt: rental.begin_branch_car_cnt,
      biz_type: rental.biz_type
    })
    this.end_branch = rental.end_branch_id ? new Branch({
      id:rental.end_branch_id,
      name: rental.end_branch_name,
      addr: rental.end_branch_addr,
      lat:rental.drive_lat,
      lng:rental.drive_lng,

      parking_fee_in:rental.parking_fee_in,

      drive_addr:rental.end_drive_addr,
      drive_remark:rental.end_drive_remark,
      driving_overall_view:rental.driving_overall_view
    }) : null
    this.car = new Car({
      id :rental.id,
    plate_no :rental.plate_no,
    car_pic :rental.car_pic,

    remain_km :rental.remain_km,
    brand_name :rental.brand_name,
    model_name :rental.model_name,

   /* box_cnt :rental.box_cnt,*/
    seat_cnt :rental.seat_cnt,
    power_type :rental.power_type,
    gear_type :rental.gear_type,
    max_km :rental.max_km,

    price_extra :rental.price_extra,
    price_km :rental.price_km,
    price_min :rental.price_min,

/*    parking_fee :rental.parking_fee,
    balance_refund :rental.balance_refund,*/

    is_limit :rental.is_limit,
    is_tomorrow_limit :rental.is_tomorrow_limit,
    })
  }

  getStep() {
    // 0未下单，1：已下单，2：已计费，3：已开门
    if (this.is_rental_begin) {
      return this.is_car_begin ? 3 : 2
    } else {
      return 1
    }
  }
}
