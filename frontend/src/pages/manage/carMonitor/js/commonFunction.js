/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: commonFunction
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午9:37
 Description:
 Param:
 Return:
 *************************************************/
import $ from 'jquery'
import toast from '../../../../component/toast'
import HeaderActions from '../component/Stores/HeaderActions'
import getEnv from '../../../../js/env'

import User from './User'

const my_user = new User()
let user = my_user.state
export default {
  login: function () {
    return (user.uuid && user.sign)
  },
  get: function (url, data, callback) {
    HeaderActions.loadingShow()
    data.uuid = user.uuid
    data.sign = user.sign
    let temp = []
    for (let k in data) {
      temp.push(k + '=' + data[k])
    }
    let fullUrl = url + (/\?/.test(url) ? '&' : '?') + temp.join('&')
    $.get(fullUrl, function (res) {
      HeaderActions.loadingHide()
      if (typeof callback === 'function') {
        callback(res)
      }

    })
  },
  open: function(url,data){
    data.uuid = user.uuid
    data.sign = user.sign
    let temp = []
    for (let k in data) {
      temp.push(k + '=' + data[k])
    }
    let fullUrl = url + (/\?/.test(url) ? '&' : '?') + temp.join('&')
    window.open(fullUrl)
  },

  post: function (url, data) {

    HeaderActions.loadingShow()

    data.uuid = user.uuid
    data.sign = user.sign

    return new Promise(function (resolve, reject) {
      $.post(url, data, function (res) {

        HeaderActions.loadingHide()

        if (res.status === 6001) {
          toast('登录信息已过期，请从管理后台重新进入')
          reject()
        } else if (res.status !== 0) {
          toast(res.msg)
          reject()
        }
        resolve(res)
      })
    })
  },

  jsonp: function (url, params, callback, before) {
    HeaderActions.loadingShow()
    var that = this;
    if (before) {
      before();
    }
    params.timeStamp = new Date().getTime();
    params.ak = ak;
    params.service_id = service_id;
    params.coord_type_output = 'gcj02'
    params.uuid = user.uuid
    params.sign = user.sign
    url = url + '?';
    for (let i in params) {
      url = url + i + '=' + params[i] + '&';
    }
    var timeStamp = (Math.random() * 100000).toFixed(0);
    window['ck' + timeStamp] = callback || function () {
    };
    var completeUrl = url + '&callback=ck' + timeStamp;
    var script = document.createElement('script');
    script.src = completeUrl;
    script.id = 'jsonp';
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function (e) {
      HeaderActions.loadingHide()
      $('#jsonp').remove();
    };
    script.onerror = function (e) {
      that.jsonp(url, params, callback, before)
    };
  },

  loadjs: function (file){
    HeaderActions.loadingShow()

    return new Promise(function (resolve, reject) {
      let host = getEnv() === 'production' ? 'images.likechuxing.com' : 'imagestest.likechuxing.com'
      let script = document.createElement('script')
      script.type = "text/javascript"
      script.src = 'https://'+host+'/lscoord/' + file + '.js'
      script.onload = function(){
        HeaderActions.loadingHide()
        document.body.removeChild(script)
        let data = JSON.parse(window[file])
        resolve(data)

      }
      document.body.appendChild(script)
    })
  }
}