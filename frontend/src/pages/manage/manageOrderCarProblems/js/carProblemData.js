/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: carProblemData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/22-下午1:57
 Description:
 Param:
 Return:
 *************************************************/
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: userData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/15-下午3:58
 Description:
 Param:
 Return:
 *************************************************/
import SessionData from '../../../../../other_modules/like-webStorage/SessionData'

export default new class CarProblemData extends SessionData {
  constructor () {
    super({
      name: 'manageOrder_carProblem',
      lifetime: 86400,
      keys: [
        'status',
        'car_parts',
        'num',
        'source',

        'resId',
        'name'
      ]
    })

  }
}