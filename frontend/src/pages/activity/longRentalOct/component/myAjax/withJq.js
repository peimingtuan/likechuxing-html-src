/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: withJq
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/18-下午4:48
 Description:
 Param:
 Return:
 *************************************************/
/**
 * Created by garvey on 2017/9/11.
 */
import $ from 'jquery'
import getVerification from '../../../../../js/getVerification'
import getApiUrl from '../../../../../js/getApiUrl'
import post from '../../../../../js/post'
require('../../../../../js/polyfills')

class Ajax {
    constructor () {
        this.time_offset = null
        this.list = []

        $.get(getApiUrl('/time/get'), function(res){
            let now = Math.floor(new Date().getTime()/1000)
            this.time_offset = JSON.parse(res).data.timestamp - now
            this.list.forEach( item => {
                this.postNow(...item)
            })
            this.list.length = 0
        }.bind(this))
    }

    post (url, data, cb) {
        if (this.time_offset === null) {
            this.list.push([url, data, cb])
        } else {
            this.postNow(url, data, cb)
        }
    }

    postJump (url, _data) {
        let data = Object.assign({}, _data)
        data.user_version = 'h5_1000'
        data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0)
        data.verification = getVerification(data)
        post(url, data)
    }

    postFormData(url,formData,data,cb){
        data.user_version = 'h5_1000'
        formData.append('user_version', data.user_version)
        data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0)
        formData.append('client_time', data.client_time)
        formData.append('verification', getVerification(data))
        $.ajax({
            url,
            type:'POST',
            data:formData,
            processData: false,  // 不处理数据
            contentType: false,   // 不设置内容类型
            success:function(res){
                cb(res)
            }
        })
    }

    postNow (url, _data, cb) {
        let data = Object.assign({}, _data)
        if (data.hasOwnProperty('user_channel')){
            data.channel = data.user_channel || ''
            delete data.user_channel
        }
        data.user_version = 'h5_1000'
        data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0)
        data.verification = getVerification(data)
        $.post(url, data, function(res){
            cb(res)
        })
    }
}

export default new Ajax()