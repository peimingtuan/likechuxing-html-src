/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: footer
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/14-下午2:17
 Description:
 Param:
 Return:
 *************************************************/
const footer = require('./footer.pug')
import $ from 'jquery'

export default function(text){
    $('body').append(footer({
        text:text || '活动最终解释权归立刻出行所有'
    }))

    let footerEl = $('.footer_text')
    let footer_height = footerEl.height()
    if(footerEl.offset().top < (window.innerHeight - footer_height)){
        footerEl.css('margin-top',(window.innerHeight - footer_height-footerEl.offset().top) +"px")
    }
}


