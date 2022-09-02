/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SDK.polyfill.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/17-上午11:09
 Description:
 Param:
 Return:
 *************************************************/
import POI from './class/POI'
import {MAP_LOCATION} from './mapControl/index'

let locationMap = new MAP_LOCATION()

 const SDK = {
  // todo 改成真的定位
   getLocation: () =>{
     return new Promise((resolve,reject)=>{
       locationMap.getLocation(function(status,result){
         if(status === 'complete'){
           resolve(new POI(result.position.lng, result.position.lat))
         }else{
           reject()
         }
       })
     })
   }
}

export default SDK