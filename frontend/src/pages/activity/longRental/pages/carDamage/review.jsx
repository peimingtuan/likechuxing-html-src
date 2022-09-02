import $ from "jquery";
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: review
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/23-下午4:47
 Description:
 Param:
 Return:
 *************************************************/
require('./review.less')
import Swiper from '../../js/swiper'
require('swiper/dist/css/swiper.css')
import React from 'react'
import Reflux from 'reflux'
import CarDamage from '../../component/carDamage'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import Loading from '../../../../../component/loading'
import {Alert, Toast} from "../../component/LikeAlert/index";
import MainBox from '../../component/MainBox'
import parseUrl from '../../../../../js/parseURL'
import myAjax from '../../component/myAjax/withJq'
import getApiUrl from '../../../../../js/getApiUrl'
import AutoHeight from '../../js/AutoHeight'
let setCss = ''
import preciew from '../../../../../component/previewImg2'

class PhotoBox extends React.Component{
    constructor(){
        super()
    }

    preview(){
        preciew({
            url:this.props.url
        })
    }

    render(){
        return (
            <div className="swiper-slide" onClick={this.preview.bind(this)} style={{
                backgroundImage:'url('+this.props.url+')'
            }} />
        )
    }
}

export default class review extends Reflux.Component {
    constructor(props) {
        super()
        this.state = {
            parts:[],
            imgs:[]
        }
        this.swiper = null
        let loading = new Loading()
        let user = Reflux.GlobalState.common
        let rental = Reflux.GlobalState.rental
        myAjax.post(getApiUrl('rental-history/car-before-photo-detail'),{
            uuid:user.uuid,
            sign:user.sign,
            rental_id:rental.rental_id,
            type:'1',
            behavior:parseUrl(props.location.search).query.type
        },function(res){
            loading.destroy()
            if(res.status === 0){
                let list = []
                let parts = []
                if(res.data.parts){
                    parts =  res.data.parts.substring(1,res.data.parts.length-1).split('^')
                }
                if(res)
                for(let k in res.data.images){
                    list.push({
                        key:k,
                        url:res.data.images[k]
                    })
                }
                this.setState({
                    parts,
                    imgs:list
                })
            }else{
                new Toast(res.msg)
            }
        }.bind(this))
    }

    componentDidMount() {
        setCss = new AutoHeight()
        let carDamage = new CarDamage({
            parent: document.querySelector('.car'),
            clickable: false
        })
        this.partImages = $('.carDamage_container')
    }

    componentDidUpdate() {
        setCss.auto(".photo_con")
        if(!this.swiper){
            this.state.parts.forEach(item=>{
                this.partImages.find('[data-id="'+item+'"]').addClass('select')
            })

            this.swiper = new Swiper('.swiper-container', {
                slidesPerView: 3,
                centeredSlides: this.state.imgs.length < 2,
                spaceBetween: 15
            });
        }
    }

    next(){
        this.swiper.slideNext();
    }

    prev(){
        this.swiper.slidePrev();
    }

    render() {
        let next = <div className="button_next swiper_button" onClick={this.next.bind(this)} />
        let prev = <div className="button_prev swiper_button" onClick={this.prev.bind(this)}/>
        if(this.state.imgs.length < 4){
            next = ''
            prev = ''
        }
        return <div className="Review">
            <MainBox>
                <div className="review">
                    <div className="car" />
                    <div className="photo_con">
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {this.state.imgs.map(item=><PhotoBox key={item.key} url={item.url} />)}
                            </div>
                        </div>
                        {next}
                        {prev}
                    </div>
                </div>
            </MainBox>
        </div>
    }
}


 