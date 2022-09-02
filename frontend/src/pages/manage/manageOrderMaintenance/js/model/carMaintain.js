/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: maintainRemind
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-07-16:35
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
 import CarManage from '../../../../../../other_modules/like-manageOrder/model/CarManage'

export default class CarMaintain {
  constructor (maintain) {
    this.car = new CarManage({
      id:maintain.car_id,
      limit_record:maintain.limit_record,
      plate_no:maintain.plate_no,
      vin:maintain.vin,
      status_name:maintain.car_status,
      remain_km:maintain.remain_km,
      model_name:maintain.model_name,
      color:maintain.color,

      branch_name:maintain.branch_name,
      biz_type:maintain.biz_type
    })

    this.id = Number(maintain.id)
    this.status = Number(maintain.status)
    this.status_name = maintain.status_name
    this.is_mine = Boolean(maintain.is_mine)
    this.maintain_status = Number(maintain.status)
    this.maintain_status_name = maintain.status_name

    this.maintain_number = maintain.maintain_number
    // 保养时已行驶的总里程
    this.end_km = maintain.end_km
    // 当前已经行驶的里程
    this.custom_km = maintain.custom_km
    this.maintain_time = maintain.maintain_time
    this.maintain_type = maintain.maintain_type
    this.warning_matintain_type = maintain.warning_matintain_type
    this.warning_repair_branch = maintain.warning_repair_branch
    this.last_time = maintain.last_time

    this.step = Number(maintain.step)

    this.last_maintain_number = maintain.last_maintain_number
    this.last_custom_km = maintain.last_custom_km
    this.last_maintain_time = maintain.last_maintain_time
    this.last_maintain_type = maintain.last_maintain_type

    this.total_km = maintain.total_km

  }

}