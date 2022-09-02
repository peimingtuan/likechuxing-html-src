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
import React from 'react'
import Reflux from 'reflux'
import {IndexActions, IndexStore} from "../../js/IndexStore";
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import {Select} from "../../component/Select/index";
import createHistory from 'history/createHashHistory'
import { IsAndriod } from "../../../../../js/UserAgent.js";
const history = createHistory()
class CarBox extends React.Component{
    constructor(){
        super()
    }

    bookCar(){
        if(this.props.canCheckout){
            IndexActions.changeState({currentModelId:this.props.id,discount:this.props.discount,canCheckout:false})
            IndexActions.checkPermision(this.props.price)
        }                
    }

    render(){
        return(
            <div className="CarBox" onClick={this.bookCar.bind(this)}>
                <img className="carImg" src={this.props.carImg}/>
                <div className="title">{this.props.carName}</div>
                <div className="price"><span>{Number(this.props.price)}</span> 元/月</div>
                <a className="payBtn">立刻<br/>预定</a>
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
        appMutual.sendUpdateTitle('全新月租上线')
        IndexActions.initIndex()        
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
                IndexActions.changeState({'currentCityId': item.id,noChangeCity:false})
                IndexActions.updateModelList()
            }
        })
    }
    toExplain(){
        history.push('/explains')
    }


    render() {
        let city = this.state.cityList.find(item=>item.id == this.state.currentCityId)
        let cityName = city ? city.city : ''    
        return <div className="Index">
            <div className="city_select" onClick={this.changeCity.bind(this)}>
                <span className="icon_location"/>
                <span className={"cityName "+(IsAndriod()?"andStyle":"")}>{cityName}</span>
                <span className="icon_rightArrow" />
            </div>
            <div className={"main_header "+((cityName=="佛山" || cityName=="中山" || cityName=="东莞" ||cityName=="广州")?"newBg":"")+(cityName=="长沙"?"newBg2":"")}  />
            <div className="content_bg">
                <div className="carList">
                    {this.state.modelList.map((item,index) =>(
                        <CarBox
                            key={index}
                            carName={item.model_name}
                            price={item.car_price}
                            carImg={item.car_img}
                            id={item.model_id}
                            discount={item.discount}
                            canCheckout={this.state.canCheckout}
                        />
                    ))}
                </div>
                <p className="footHint">以上价格不含保障服务费</p>
            </div>
            <button className={"toEditRental "+(IsAndriod()?"andStyle":"")} onClick={this.toExplain.bind(this)}>月租规则</button>
        </div>
    }
}

 