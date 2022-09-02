/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: searchData
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/6-下午2:12
 Description:
 Param:
 Return:
 *************************************************/
import LocalData from '../../../../../other_modules/like-webStorage/LocalData'

export default new class SearchData extends LocalData {
  constructor () {
    super({
      name: 'manageOrder_search',
      lifetime: 86400*30,
      keys: [
        "history"
      ]
    })
  }
}