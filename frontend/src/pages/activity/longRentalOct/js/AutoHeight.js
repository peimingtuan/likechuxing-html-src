/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: setCss
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/22-下午4:55
 Description:
 Param:
 Return:
 *************************************************/
import $ from "jquery";

export default class AutoHeight {
    constructor(){
        this.marginTop = 0
    }

    auto(selector){
        let window_height = window.innerHeight
        let height = $('body').height()
        let top = window_height - height + this.marginTop
        if(top<0){
            top = 0
        }
        $(selector).css('margin-top',top)
        this.marginTop = top
    }
}