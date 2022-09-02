/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: translateStatus
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/28-下午2:47
 Description:
 Param:
 Return:
 *************************************************/

const translateStatus = new class Translate{
    constructor(){
        this.db = {
            car: require('../database/carStatus.json'),
            rental: require('../database/rentalStatus.json'),
            branch: require('../database/branchStatus.json')
        }
    }

    /**
     * 通过status值取status描述
     *
     * @param {number} type 类型（car|rental|branch）
     * @param {number} value 状态值
     */
    status2desc(type, value){
        if(!this.db.hasOwnProperty(type)){
            console.log('function error:translateStatus got a wrong type:'+type)
            return false
        }

        let currentStatus = this.db[type].find(item => item.status == value)
        if(!currentStatus){
            console.log('function error:translateStatus did not find currentStatus,status:'+value)
            return false
        }

        return currentStatus.desc
    }

    /**
     * 通过status描述取status值
     *
     * @param {number} type 类型（car|rental|branch）
     * @param {string} value 状态描述
     */
    desc2status(type, value){
        if(!this.db.hasOwnProperty(type)){
            console.log('function error:translateStatus got a wrong type:'+type)
            return false
        }

        let currentStatus = this.db[type].find(item => item.desc == value)
        if(!currentStatus){
            console.log('function error:translateStatus did not find currentStatus,desc:'+value)
            return false
        }

        return currentStatus.status
    }
}

export {translateStatus}
 