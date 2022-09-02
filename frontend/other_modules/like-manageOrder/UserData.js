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
import SessionData from '../like-webStorage/SessionData'

export default new class UserData extends SessionData {
  constructor () {
    super({
      name: 'manageOrder_user',
      lifetime: 86400,
      keys: [
        // 手机信息
        'phoneInfo',
        // 姓名
        'nickName',
        // 头像
        'avatar',
        // 电话
        'mobile',
        // 所选city_id
        'city_ids',
        // 全部权限城市
        'cityList',
        // 权限列表
        'permission',

        'lng',
        'lat',
		

        // 工单列表页缓存的数据
        'menuPage',
        //调度任务工单  
        "locationsLng",
        "locationsLat",
        "mapbranch_id",
        //维修工单
        'provice',
        'city',
        'mapName'
      ]
    })

  }
}