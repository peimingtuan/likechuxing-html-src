/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Unique
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/19-下午4:05
 Description:
 Param:
 Return:
 *************************************************/
const md5 = require('md5')
import uuid from './uuid.js'

const LOCAL_NAME = 'like_millionGift'

 export default class Unique {
     constructor(){
         this.uuid = uuid(128, 16)
         this.str = md5(this.uuid).toUpperCase()
     }

     checkLocal(now){
         //todo
         return false

         let local_str = window.localStorage.getItem(LOCAL_NAME)
         let local
         if(local_str){
             local = JSON.parse(local_str)
             let toDay = getTheDay(now)
             let thatDay = getTheDay(local.time)
             if(thatDay+86400 <= toDay){
                 return false
             }else{
                 return local
             }
         }else{
             return false
         }
     }

     getLocal(){
         let local_str = window.localStorage.getItem(LOCAL_NAME)
         let local = false
         if(local_str){
             local = JSON.parse(local_str)
         }
         return local
     }

     saveLocal(now,phone,num,is_new,uuid){
         let local = {
             is_new,
             num,
             phone,
             time:now,
             str:uuid
         }
         window.localStorage.setItem(LOCAL_NAME,JSON.stringify(local))
     }
}

function getTheDay (timeStamp){
    return new Date(new Date(timeStamp*1000).toLocaleDateString()).getTime()/1000
}