/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: branch
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/24-下午2:06
 Description:
 Param:
 Return:
 *************************************************/
import POI from './POI'

export default class Branch {
  constructor(branch) {
    this.id = branch.id
    this.name = branch.name
    this.addr = branch.addr || branch.address
    this.lat = branch.lat
    this.lng = branch.lng
    this.poi = new POI(branch.lng, branch.lat)

    this.walk_addr = branch.walk_addr // 步行地址
    this.walk_remark = branch.walk_remark // 步行备注
    this.walk_lat = branch.walk_lat
    this.walk_lng = branch.walk_lng
    this.walk_overall_view = branch.walk_overall_view // 步行入口全景

    this.drive_addr=branch.drive_addr
    this.drive_remark=branch.drive_remark
    this.driving_overall_view = branch.driving_overall_view

    this.parking_fee_in = branch.parking_fee_in // 还车附加费
    this.car_cnt = branch.car_cnt // 当前可用车辆
    this.biz_type = branch.biz_type // 类型0合作（B）1非合作（B+）
  }
}
