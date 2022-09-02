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
    constructor({name, options,options2, callback, initIndex}){
        this.name = name || '请选择'
        this.options = options
        this.options2 = options2
        this.callback = callback
        this.selectBox = $(selectBox({
            name,
            options,
            options2
        }))
        $('body').append(this.selectBox)
        // $('body').append(this.selectBox2)
        this.swiper = new Swiper('.swiper-container', {
            initialSlide: initIndex,
            slidesPerView: 5,
            centeredSlides: true,
            direction: 'vertical'
        });
        this.swiper2 = new Swiper('.swiper-container2', {
            initialSlide: initIndex,
            slidesPerView: 5,
            centeredSlides: true,
            direction: 'vertical'
        });
        this.selectBox.find('.left, .mask').click(this.destroy.bind(this))
        this.selectBox.find('.right').click(this.submit.bind(this))
    }

    submit(){
        this.callback(this.options[this.swiper.activeIndex],this.options2[this.swiper2.activeIndex])
        this.destroy()
        // console.log(this.swiper.activeIndex,this.swiper2.activeIndex);
        
    }

    destroy(){
        this.swiper.destroy()
        this.swiper2.destroy()
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
            return 1
            break;
        default:
            return 2
    }
}

export {Select}
