/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: localHistory
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/25-下午12:51
 Description:
 Param:
 Return:
 *************************************************/
 export default class LocalHistory {
     constructor(name){
         this.name = 'like_longRental_history_'+name
         let local_str = localStorage.getItem(this.name)
         this.history = local_str ? JSON.parse(local_str) : []
     }

     get(){
         return this.history
     }

     clear(){
         this.history = []
         localStorage.removeItem(this.name)
     }

     push(branch){
         let _array = this.history.filter(item=>item.branch_id != branch.branch_id)
         _array.push(branch)
         if(_array.length > 3){
             _array.shift()
         }
         this.history = _array
         localStorage.setItem(this.name, JSON.stringify(this.history))
     }
}