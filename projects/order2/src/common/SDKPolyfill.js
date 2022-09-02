/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: SDKPolyfill
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/8-下午4:52
 Description:
 Param:
 Return:
 *************************************************/
import Env from './env'
import POI from './class/POI'
import {Alert,Toast}from '../../other_modules/vue-plugins/like-base/'

function compressImage(src){
  return new Promise(reslove=>{
    let cvs = document.createElement('canvas')
    let ctx = cvs.getContext('2d')
    let img = new window.Image()
    img.style.display = 'none'
    // 跨域图片不能通过canvas.toDataUrl输出
    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = () => {
      console.log('onload')
      let scale = img.width/img.height
      cvs.width = 1200
      cvs.height = 1200/scale
      ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
      reslove(cvs.toDataURL('image/jpeg', 0.8))
      setTimeout(() => {
        document.body.removeChild(img)
      }, 0)
    }
    document.body.appendChild(img)
    img.src = src
  })
}

const WX_SDK = {
  getLocation(cb){
    cb()
  },

  chooseImage(cb){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (Env.isIos) {
          wx.getLocalImgData({
            localId: res.localIds[0],
            success: function (res_2) {
              that['photo_' + index] = res_2.localData // localData是图片的base64数据，可以用img标签显示
            }
          })
        } else {
          that['photo_' + index] = res.localIds[0]
        }
        wx.uploadImage({
          localId: res.localIds[0].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            that['serverId_' + index] = res.serverId
          }
        })
      }
    })
  }
}

const AL_SDK = {

  getLocation(){
    return ap.getLocation({
      type:2
    }).then(res=>{
      return new POI(res.longitude, res.latitude)
    }).catch(err=>{
      if (err.hasOwnProperty('error') && err.error === 4) {
        Alert({
          title: '提示',
          msg: '立刻出行需要获取您的位置才能提供服务',
          confirmButtonCallback: function () {
            that.indexInit()
          }
        })
      }else{
        console.log(err)
        throw {status:8001,msg:'定位失败，请打开手机的定位服务'}
      }
    })
  },

  chooseImage(){
    return new Promise((resolve,reject)=>{
      AlipayJSBridge.call('photo', {
        dataType: 'dataURL',
        imageFormat: 'jpg',
        quality: 75,
        maxWidth: 1600,
        maxHeight: 1600,
        allowEdit: false
      }, function(result) {
        console.log(result)
        if(result.error){
          reject(result)
        }if(result.scene === 'assets'){
          Toast('请直接拍照，而不是从相册选择')
          reject(result)
        }else{
          resolve("data:image/jpeg;base64," + result.dataURL)
        }
      });
    })
  },

  chooseImageV2(){
    return ap.chooseImage({
      count:1,
      sourceType:['camera']
    }).then(res=>{
      return res.apFilePaths[0]
    })
  },

  previewImg(data){
    ap.previewImage(data)
  },

  openWindow(url,query){
    ap.pushWindow({
      url: url,
      data:query || {}
    });
  },

  setWindowTitle(title){
    ap.setNavigationBar(title);
  },

  makePhoneCall(phone_no){
    ap.makePhoneCall(phone_no);
  },

  popWindow(){
    ap.popWindow()
  }
}

const H5_SDK = {
  getLocation:function(){
    return new Promise(resolve=>{
      let i = function(){
        return (Math.random()*0.02-0.01)*0.3
      }
      setTimeout(function(){
        resolve(new POI(116.298280+i(),40.044404+i())) //北京
        //resolve(new POI(104.05696392+i(),30.65810766+i())) // 成都
      },100)

      /*if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(res){
          resolve(new POI(res.coords.longitude, res.coords.latitude))
        },function(err){
          console.log(err)
          reject(err)
          ErrorCb.locationFail()
        })
      }else{
        reject()
        console.log('location fail')
      }*/
    })
  },

  openWindow(url,query){
    let query_str = '?'
    for (let i in query) {
      query_str = query_str + i + '=' + query[i] + '&';
    }
    window.open(url+query_str,'_blank')
  },

  setWindowTitle(title){
    document.title = title
  },

  makePhoneCall(phone_no){
    let a = document.createElement('a')
    a.href = 'tel://'+phone_no
    a.click()
  },

  popWindow(){
    console.log('SDK popWindow')
  }
}

function random(){
  return (Math.random()*2-1)*0.03
}
let city_list = [
  {
    "id": 183,
    "lat": 28.200548,
    "lng": 113.023789,
    "name": "长沙市"
  },
  {
    "id": 235,
    "lat": 30.650909,
    "lng": 104.07074,
    "name": "成都市"
  }, {
    "id": 214,
    "lat": 22.51595,
    "lng": 113.3926,
    "name": "中山市"
  }, {
    "id": 213,
    "lat": 23.02067,
    "lng": 113.75179,
    "name": "东莞市"
  }, {
    "id": 202,
    "lat": 23.002012,
    "lng": 113.135147,
    "name": "佛山市"
  }, {
    "id": 197,
    "lat": 23.12908,
    "lng": 113.26436,
    "name": "广州市"
  }, {
    "id": 169,
    "lat": 30.59276,
    "lng": 114.30525,
    "name": "武汉市"
  }, {
    "id": 74,
    "lat": 32.05838,
    "lng": 118.79647,
    "name": "南京市"
  }
]
let length = city_list.length
let index = Math.floor(Math.random()*length)
let pos_lng = city_list[index].lng+random()
let pos_lat = city_list[index].lat+random()

const TEST_SDK = {
  city_list:[
    {
      "id": 183,
      "lat": 28.200548,
      "lng": 113.023789,
      "name": "长沙市"
    },
    {
      "id": 235,
      "lat": 30.650909,
      "lng": 104.07074,
      "name": "成都市"
    }, {
      "id": 214,
      "lat": 22.51595,
      "lng": 113.3926,
      "name": "中山市"
    }, {
      "id": 213,
      "lat": 23.02067,
      "lng": 113.75179,
      "name": "东莞市"
    }, {
      "id": 202,
      "lat": 23.002012,
      "lng": 113.135147,
      "name": "佛山市"
    }, {
      "id": 197,
      "lat": 23.12908,
      "lng": 113.26436,
      "name": "广州市"
    }, {
      "id": 169,
      "lat": 30.59276,
      "lng": 114.30525,
      "name": "武汉市"
    }, {
      "id": 74,
      "lat": 32.05838,
      "lng": 118.79647,
      "name": "南京市"
    }
  ],
  getLocation:function(){
    return new Promise(resolve=>{
      setTimeout(function(){
        resolve(new POI(pos_lng,pos_lat)) //北京
        //resolve(new POI(104.05696392+i(),30.65810766+i())) // 成都
      },100)

    })
  },

  openWindow(url,query){
    let query_str = '?'
    for (let i in query) {
      query_str = query_str + i + '=' + query[i] + '&';
    }
    window.open(url+query_str,'_blank')
  },

  setWindowTitle(title){
    document.title = title
  },

  makePhoneCall(phone_no){
    let a = document.createElement('a')
    a.href = 'tel://'+phone_no
    a.click()
  },

  popWindow(){
    console.log('SDK popWindow')
  }
}

if(Env.isWeiXin){
  console.log('wx_sdk')
  //window.SDK = WX_SDK
  window.SDK = H5_SDK
}else if(Env.isAliPay){
  console.log('ali_sdk')
  window.SDK = AL_SDK
}else{
  console.log('h5_sdk')
  window.SDK = H5_SDK
}

console.log('test_sdk')
window.SDK = TEST_SDK
