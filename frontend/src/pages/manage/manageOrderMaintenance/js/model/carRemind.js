/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: remindRemind
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-07-16:35
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
import CarManage from '../../../../../../other_modules/like-manageOrder/model/CarManage'

export default class CarRemind {
  constructor (remind) {
    this.car = new CarManage({
      id: remind.car_id,
      limit_record: remind.limit_record,
      plate_no: remind.plate_no,
      vin: remind.vin,
      status_name: remind.car_status,
      remain_km: remind.remain_km,
      model_name: remind.model_name,

      branch_name: remind.branch_name,
      biz_type: remind.biz_type
    })

    this.id = Number(remind.id)
    this.history_times = remind.maintain_number
    this.over_km = remind.max_over_km
    this.over_time = remind.max_over_time
    this.sugges_type = remind.maintain_type
    this.sugges_branches = remind.maintain_branch

    this.all_items = []
    if (remind.part_list && remind.part_list.forEach) {
      this.all_items = remind.part_list.map(item => {
        return {
          part_id: item.id,
          part_name: item.part_name,
          part_no: item.part_no,
          to_next_km: -item.over_km,
          to_next_day: -item.over_day
        }
      })
    }
  }

}