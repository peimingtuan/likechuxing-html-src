/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/22-上午11:44
 Description:
 Param:
 Return:
 *************************************************/
import $ from 'jquery'
const selectBox = require('./index.pug')
import Swiper from 'swiper'
require('swiper/dist/css/swiper.css')

/**
 * 模拟ios选择框
 *
 * @param {object}
 * name 显示的名字
 * options 内容数组，例[{name: '显示出来的选项', anyOthers: ''}]
 * callback 选择成功后的回调函数
 *
 * new Select({
        name: '名字',
        options:[
            {name:'F5名字名字名字'},
            {name:'F4名字名字名字'},
            {name:'F3名字名字名字'}
        ],
        callback:function(item){
            console.log(item)
        }
    })
 */
class Select {
    constructor({name, options, callback}){
        this.name = name || '请选择'
        this.options = options
        this.callback = callback
        this.selectBox = $(selectBox({
            name,
            options
        }))
        $('body').append(this.selectBox)
        this.swiper = new Swiper('.swiper-container', {
            initialSlide: getInitialSlide(this.options.length),
            slidesPerView: 5,
            centeredSlides: true,
            direction: 'vertical'
        });

        this.selectBox.find('.left, .mask').click(this.destroy.bind(this))
        this.selectBox.find('.right').click(this.submit.bind(this))
    }

    submit(){
        this.callback(this.options[this.swiper.activeIndex])
        this.destroy()
    }

    destroy(){
        this.swiper.destroy()
        this.selectBox.remove()
    }
}

function getInitialSlide(length){
    switch (length){
        case 1:
        case 2:
            return 0
            break;
        case 3:
        case 4:
            return 0
            break;
        case 13:
            return 6
            break;
        case 9:
            return 2
            break;
        default:
            return 2
    }
}

export {Select}
