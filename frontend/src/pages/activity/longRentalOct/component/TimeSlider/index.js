/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/8-下午2:51
 Description:
 Param:
 Return:
 *************************************************/
import $ from 'jquery'
const selectBox = require('./index.pug')
const slide = require('./slide.pug')
import Swiper from 'swiper'
require('swiper/dist/css/swiper.css')

class TimeSlider {
    constructor({name, group, callback, startIndex, activeTab,callbackCancel}){
        const that = this
        this.name = name || '请选择'
        this.activeTab = activeTab || 0
        this.options = group
        this.callback = callback
        this.callbackCancel = callbackCancel
        this.activeOptions = startIndex.length === 2 ? startIndex : [
            getInitialSlide(this.options[0].data.length),
            getInitialSlide(this.options[1].data.length)
        ]
        this.selectBox = $(selectBox({options:this.options}))
        this.selectBox.find('.tab').on("click",function(){
            if(!$(this).hasClass('active')){
                that.changeTab(this.dataset.id)
            }
        })
        this.changeTab(this.activeTab)
        $('body').append(this.selectBox)
        this.swiper = new Swiper('.swiper-container', {
            initialSlide: this.activeOptions[this.activeTab],
            slidesPerView: 5,
            centeredSlides: true,
            direction: 'vertical',
            onSlideChangeEnd: function(swiper){
                that.activeOptions[that.activeTab] = swiper.activeIndex
            }
        });

        this.selectBox.find('#cancel,mask').click(this.cancel.bind(this))
        this.selectBox.find('#submit').click(this.submit.bind(this))
    }

    changeTab(index){
        this.activeTab = index
        this.selectBox.find('.tab').removeClass('active')
        this.selectBox.find('.tab').eq(this.activeTab).addClass('active')
        let activeData = this.options[this.activeTab]
        let slides = activeData.data.map(item=>slide(item)).join('')
        this.selectBox.find('.swiper-wrapper').empty().append(slides)
        if(this.swiper){
            this.swiper.update()
            this.swiper.slideTo(this.activeOptions[this.activeTab])
        }
    }

    submit(){
        this.callback(this.options.map((item, index)=>{
            return {
                groupIndex:index,
                option:item.data[this.activeOptions[index]]
            }
        }))
        this.destroy()
    }

    cancel(){

        this.callbackCancel()
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
            return 1
            break;
        default:
            return 2
    }
}

export default TimeSlider