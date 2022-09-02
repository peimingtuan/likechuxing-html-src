/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: finishData
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-24-18:19
 * Description:
 *
 *************************************************/
import SessionData from '../../../../../other_modules/like-webStorage/SessionData'

export default new class SearchData extends SessionData {
  constructor () {
    super({
      name: 'manageOrder_finishOrder',
      lifetime: 3600,
      keys: [
        "type",
        "current_branch",
        'floor_id',
        'place_no',
        'car_status_id',
        'desc'
      ]
    })
  }
}