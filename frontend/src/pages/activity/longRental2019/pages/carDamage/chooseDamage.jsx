/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: choose
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/6-下午1:58
 Description:
 Param:
 Return:
 *************************************************/
require('./chooseDamage.less')
import React from 'react'
import Reflux from 'reflux'
import $ from 'jquery'
import CarDamage from '../../component/carDamage'
import {RentalStore, RentalActions} from '../../js/RentalStore'
import createHistory from 'history/createHashHistory'
const history = createHistory()
import parseUrl from '../../../../../js/parseURL'
import {appMutual} from '../../../../../../other_modules/app-mutual'

export default class choose extends Reflux.Component {
    constructor() {
        super()
        this.partImages = null
        this.state = {
            parts:[],
            agreement:true
        }
    }

    componentDidMount() {
        appMutual.send.updateTitle('检验车辆')
        let that = this
        let carDamage = new CarDamage({
            parent: document.querySelector('.car'),
            clickable: true,
            clickCallback: function (area) {
                let img = $('.carDamage_container .part[data-id="' + area.id + '"]')
                if (img.hasClass('select')) {
                    img.removeClass('select')
                } else {
                    img.addClass('select')
                }
                that.saveParts()
            }
        })
        this.partImages = $('.carDamage_container .part')
    }

    saveParts(){
        let parts = []
        this.partImages.each(function(index,elem){
            if($(this).hasClass('select')){
                parts.push(elem.dataset.id)
            }
        })
        this.setState({
            parts
        })
    }

    submit(){
        if(!this.state.agreement){
            return
        }
        if(this.state.parts.length===0){
            return
        }
        let type = parseUrl(this.props.location.search).query.type

        RentalActions.submitDamage(type,'^'+this.state.parts.join('^')+'^')

        /*
        if(this.state.parts.length === 0){
            history.replace({
                pathname:'/carDamage/takePhoto',
                search:'?type='+type
            })
        }else{
            RentalActions.submitDamage(type,'^'+this.state.parts.join('^')+'^')
        }
        */
    }

    toStatic(){
        history.push({
            pathname:'/main/iframe',
            search:'?url='+encodeURIComponent('https://h5.likechuxing.com/static/checkDamageClause/index.html')
        })
    }

    render() {
        return <div className="ChooseDamage">
                <div className="chooseDamage">
                    <p className="tips fs12">*请检查车辆外观并选择车伤部位</p>
                    <div className="car" />
                    <div className="agreement fs13">
                        <div onClick={()=>{this.setState({agreement:!this.state.agreement})}} className={'agree_icon ' + (this.state.agreement?'':'disabled')}/>
                        <span onClick={this.toStatic}>立刻出行验车服务条款</span>
                    </div>
                    <a className={"fs14 btn_long " +(this.state.agreement && this.state.parts.length ?'':'disabled')} onClick={this.submit.bind(this)}>提交</a>
                </div>
        </div>
    }
}


 