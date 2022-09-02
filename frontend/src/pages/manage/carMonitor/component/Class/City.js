/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: City
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/2/1-上午11:28
 Description:
 Param:
 Return:
 *************************************************/
export default class City{
    constructor(object){
        this.city_id = object.city_id
        this.name = object.name
        this.car_count = Number(object.count) || 0
        this.branch_count = Number(object.branch_count) || 0
    }

    updateCarCount(num){
        this.car_count = Number(num)
    }

    updateBranchCount(num){
        this.branch_count = Number(num)
    }
}