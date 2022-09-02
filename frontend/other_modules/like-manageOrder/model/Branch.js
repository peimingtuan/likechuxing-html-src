/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Branch
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-07-11:20
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
export default class Branch {
  constructor (branch) {

    this.id = Number(branch.id)
    this.biz_type = Number(branch.biz_type)
    this.name = branch.name
    this.address = branch.address
  }

}