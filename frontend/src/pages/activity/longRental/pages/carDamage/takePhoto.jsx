import $ from "jquery";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: takePhoto
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/6-下午2:38
 Description:
 Param:
 Return:
 *************************************************/
require('./takePhoto.less')
import React from 'react'
import Reflux from 'reflux'
import myAjax from '../../component/myAjax/withJq'
import getApiUrl from '../../../../../js/getApiUrl'
import {Alert, Toast} from "../../component/LikeAlert/index";
import {RentalActions} from "../../js/RentalStore";
import {CarActions} from "../../js/CarStore";
import createHistory from 'history/createHashHistory'
const history = createHistory()
import loading from '../../component/loading'
import MainBox from '../../component/MainBox'
import parseUrl from "../../../../../js/parseURL";
import AppMutual from '../../../../../component/AppMutual'
const appMutual = new AppMutual()
import preview from '../../../../../component/previewImg2'
import zipImage from '../../../../../js/function/zipImage'

class PhotoBox extends React.Component{
    constructor(){
        super()
        this.reader = new FileReader()
        this.state = {
            chosen:false,
            imgUrl:''
        }
    }

    componentDidMount(){
        let that = this
        this.reader.onload = function(e){
            let imgFile = e.target.result
            if(imgFile){
                // base64方式上传
                that.uploadImgBase64.call(that, imgFile)
                that.setState({
                    chosen:true,
                    imgUrl:imgFile
                })
            }
        }
    }

    clickImg(){
        if(!this.state.chosen){
            this.refs.file.click()
        }else{
            preview({
                url:this.state.imgUrl
            })
        }
    }

    fileChange(){
        let file = this.refs.file.files[0]
        if(file){
            this.reader.readAsDataURL(this.refs.file.files[0])
            // file方式上传
            //this.uploadImg.call(this)
        }
    }

    uploadImg(){
        let that = this
        let formData = new FormData();
        let user = Reflux.GlobalState.common
        let rental = Reflux.GlobalState.rental
        formData.append("uuid", user.uuid);
        formData.append("sign", user.sign);
        formData.append("city_id", rental.rental_city_id);
        formData.append("rental_id", rental.rental_id);
        formData.append("behavior", this.props.type);
        formData.append("type", '1');
        formData.append("key", this.props.private_key);
        formData.append('file',this.refs.file.files[0])
        let data = {
            uuid:user.uuid,
            sign:user.sign,
            city_id:rental.rental_city_id,
            rental_id:rental.rental_id,
            behavior:this.props.type,
            type:'1',
            key:this.props.private_key
        }
        loading.show()
        myAjax.postFormData(getApiUrl('upload/car-before-photo'),formData,data,function(res){
            loading.hide()
            if(res.status === 0){
                that.props.upload(that.props.private_key, true)
            }else{
                new Toast(res.msg)
            }
        })
    }

    uploadImgBase64(url){
        let that = this
        let user = Reflux.GlobalState.common
        let rental = Reflux.GlobalState.rental
        zipImage(url,{
            width:1200
        }, function(res){
            let data = {
                uuid:user.uuid,
                sign:user.sign,
                city_id:rental.rental_city_id,
                rental_id:rental.rental_id,
                car_id: Reflux.GlobalState.car.car_id,
                behavior:that.props.type,
                type:'1',
                key:that.props.private_key,
                base64_string: res
            }
            loading.show()
            myAjax.post(getApiUrl('upload/car-before-photo'),data,function(res){
                loading.hide()
                if(res.status === 0){
                    that.props.upload(that.props.private_key, true)
                }else{
                    new Toast(res.msg)
                }
            })
        })



    }

    closeClick(e){
        e.stopPropagation()
        this.refs.file.value = null
        this.setState({
            chosen:false,
            imgUrl:''
        })
        this.props.upload(this.props.private_key, false)
    }

    render(){
        return (
            <li className="PhotoBox">
                <div className="title">{this.props.title}</div>
                <div onClick={this.clickImg.bind(this)} style={this.state.chosen?{backgroundImage:"url("+this.state.imgUrl+")"}:{}} className="photo_container" >
                    {this.state.chosen ? <div className="close" onClick={this.closeClick.bind(this)} /> : '' }
                </div>
                <input ref='file' type="file" accept="image/*" onChange={this.fileChange.bind(this)} className="file"/>
            </li>
        )
    }
}

export default class takePhoto extends Reflux.Component {
    constructor(props) {
        super()
        this.state = {
            type:parseUrl(props.location.search).query.type,
            photos:[
                {key:0,title:'左前',upload:false},
                {key:1,title:'右前',upload:false},
                {key:2,title:'左后',upload:false},
                {key:3,title:'右后',upload:false}
            ],
            finish:false
        }
    }

    componentDidMount(){
        appMutual.sendUpdateTitle('拍摄车辆')
        let window_height = window.innerHeight
        let height = $('body').height()
        if(height < window_height){
            $('.btn_long').css('margin-top',window_height - height)
        }
    }

    upload(key, value){
        let photos = this.state.photos
        photos.find(item=>item.key === key).upload = value
        this.setState({
            photos:photos,
            finish:photos.every(item=>item.upload)
        })
    }

    submit(){
        if(!this.state.finish){
            return
        }

        if(this.state.type === 'pre'){
            CarActions.openDoor(function(){
                history.replace('/rental/useCar')
            },function(){
                history.replace('/rental/chooseCar')
            })
        }else{
            RentalActions.finishRental()
        }
    }

    render() {
        let btn_text = this.state.type === 'pre' ? '提交开车门' : '提交并还车'
        return <div className="TakePhoto">
            <MainBox>
                <div className="takePhoto">
                    <ul className="photoList">
                        {this.state.photos.map(item=><PhotoBox
                            type={this.state.type}
                            key={item.key}
                            private_key={item.key}
                            title={item.title}
                            upload={this.upload.bind(this)}
                        />)}
                    </ul>
                    <a className={"fs14 btn_long "+(this.state.finish?"":'disabled')} onClick={this.submit.bind(this)}>{btn_text}</a>
                </div>
            </MainBox>
        </div>
    }
}


 