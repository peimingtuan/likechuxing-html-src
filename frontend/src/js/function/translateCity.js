/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: translateCity
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/20-下午1:41
 Description:
 Param:
 Return:
 *************************************************/
const translateCity = new class TranslateCity{
    constructor(){
        this.db = require('../database/cityList')
    }

    /**
     * 通过城市名值取城市
     *
     * @param {string} name 城市名 （北京/北京市）
     */
    getCityByName(name){
        let city = this.db.find(item=> new RegExp(name).test(item.name))
        if(city){
            return city
        }else{
            return false
        }
    }

    /**
     * 通过城市id取城市
     *
     * @param {number} id 城市id （1/197）
     */
    getCityByCityId(id){
        let city = this.db.find(item=> id == item.id)
        if(city){
            return city
        }else{
            return false
        }
    }

}

export {translateCity}