/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Branch
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/1-上午10:48
 Description:
 Param:
 Return:
 *************************************************/
import ObjectWithGPS from './ObjectWithGPS'
export default class Branch extends ObjectWithGPS{
     constructor(object){
         super({
             lng: object.lng,
             lat: object.lat
         })
         this.id = object.id
         this.name = object.name
         this.biz_type = object.biz_type
         this.city_id = object.city_id
     }

     equal(branch){
         if(!branch instanceof Branch){
             return false
         }

         return this.id === branch.id
     }

     match(search){
         let result = [true]
         if(search.city_id !== '0'){
             result.push(search.city_id == this.city_id)
         }
         if(search.biz_type !== ''){
             result.push(search.biz_type == this.biz_type)
         }
         if(search.branchName !== ''){
            result.push(new RegExp(search.branchName, 'i').test(this.name))
         }
         return result.every(item=>item)
     }
}