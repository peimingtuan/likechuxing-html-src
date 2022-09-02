/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: arguAppend
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/17-下午2:01
 Description:
 Param:
 Return:
 *************************************************/
import appArguments from '../../../../../other_modules/app-arguments'

 export default function arguAppend(_data={}){
  let data = {}
   data.uuid = appArguments.uuid
   data.sign = appArguments.sign
   data.city_id = appArguments.city_id
   data.user_lat = appArguments.user_lat
   data.user_lng = appArguments.user_lng

   data.user_version = 'h5_2020'
   data.user_sys_version = window.navigator.userAgent.replace(/\s/g, '')
   data.device_name = 'web'

   return Object.assign(data,_data)
}