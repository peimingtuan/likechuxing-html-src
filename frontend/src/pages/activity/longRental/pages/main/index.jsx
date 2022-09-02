/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/3-下午1:24
 Description:
 Param:
 Return:
 *************************************************/

require('./index.less')
import $ from 'jquery'
import React from 'react'
import Reflux from 'reflux'
import {Link} from 'react-router-dom'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import MainBox from '../../component/MainBox'
import ToLongRentalExplain from '../../component/ToLongRentalExplain'
import {Select} from "../../component/Select/index";
import AutoHeight from '../../js/AutoHeight'
let setCss

class CarBox extends React.Component{
    constructor(){
        super()
    }

    bookCar(id){
        IndexActions.changeState({currentModelId:id})
        this.props.history.push('/main/editRental')
    }

    render(){
        return(
            <div className="CarBox">
                <img className="carImg" src={this.props.carImg}/>
                <div className="title fs16">{this.props.carName}</div>
                <div className="price fs12">日均: <span className="fs14">{this.props.price}</span> 元/天</div>
                <a className="btn_short fs12" onClick={()=>this.bookCar.call(this,this.props.id)}>立即预定</a>
            </div>
        )
    }
}

export default class Index extends Reflux.Component {
    constructor() {
        super()
        this.store = IndexStore
    }

    componentDidMount() {
        setCss = new AutoHeight()
        appMutual.sendUpdateTitle('春节长租')
        IndexActions.initIndex()
    }

    componentDidUpdate(){
        setCss.auto('.box_footer')
    }

    changeCity(){
        new Select({
            name: '',
            options:this.state.cityList.map(item=>{
                return {
                    id:item.id,
                    name:item.city,
                }
            }),
            initIndex:this.state.cityList.findIndex(item=>item.id == this.state.currentCityId),
            callback:function(item){
                IndexActions.changeState({'currentCityId': item.id})
                IndexActions.updateModelList()
            }
        })
    }

    render() {
        let city = this.state.cityList.find(item=>item.id == this.state.currentCityId)
        let cityName = city ? city.city : ''
        return <div className="Index">
            <div className="city_select" onClick={this.changeCity.bind(this)}>
                <span className="icon_location"/>
                <span className="cityName">{cityName}</span>
                <span className="icon_rightArrow" />
            </div>
            <div className="main_header" />
            <MainBox>
                <div className="carList">
                    {this.state.modelList.map(item =>(
                        <CarBox
                            key={item.id}
                            carName={item.model_name}
                            price={item.day_price}
                            carImg={item.car_img}
                            id={item.id}
                            history={this.props.history}
                        />
                    ))}
                </div>
            </MainBox>
            <ToLongRentalExplain type="yellow"/>
        </div>
    }
}

 