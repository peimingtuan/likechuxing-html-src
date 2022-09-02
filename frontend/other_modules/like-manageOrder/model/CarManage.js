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
import Branch from './Branch'
import Car from '../../like-model/models/Car'

export default class CarManage extends Car{
  constructor (car) {
    super(car)

    // 限行
    this.limit_record = car.limit_record || null

    this.branch = new Branch({
      id:car.current_branch_id,
      biz_type:car.biz_type,
      name:car.branch_name,
      address:car.branch_addr
    })
  }

}