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
require('../../../../../js/polyfills')

class Ajax {
    constructor () {
        this.time_offset = 0
        this.server_time = new Date()
        this.list = []
    }

    post (url, data, cb) {
        if (this.time_offset === null) {
            this.list.push([url, data, cb])
        } else {
            this.postNow(url, data, cb)
        }
    }

    postNow (url, _data, cb) {
        let data = Object.assign({}, _data)
        if (data.hasOwnProperty('user_channel')){
            data.channel = data.user_channel || ''
            delete data.user_channel
        }
        data.user_version = 'h5_2100'
        data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0)
        data.verification = getVerification(data)
        $.post(url, data, function(res){
            cb(res)
        })
    }

  postPage(url, data) {
    var temp = document.createElement("form");
    temp.action = url;
    temp.method = "post";
    temp.style.display = "none";

    if (data.hasOwnProperty('user_channel')){
      data.channel = data.user_channel || ''
      delete data.user_channel
    }
    data.user_version = 'h5_2100'
    data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0)
    data.verification = getVerification(data)
    for (var x in data) {
      var opt = document.createElement("textarea");
      opt.name = x;
      opt.value = data[x];
      temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
  }

    get(url,cb){
        $.get(url,cb)
    }
}

export default new Ajax()