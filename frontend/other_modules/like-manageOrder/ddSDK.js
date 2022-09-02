/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: dd.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/13-下午3:51
 Description:
 Param:
 Return:
 *************************************************/
import Signature from './Signature'
import env from '../like-env'

const JSAPI_LIST = [
  'runtime.info',
  'biz.contact.choose',
  'device.notification.confirm',
  'device.notification.alert',
  'device.notification.prompt',
  'biz.ding.post',
  'biz.util.openLink',
  'biz.user.get',
  'device.geolocation.get',
  'biz.util.uploadImageFromCamera',
  'biz.util.uploadImage',
  'biz.util.previewImage',
  'biz.navigation.setLeft',
  'biz.util.datepicker',
  'biz.util.scan',
  'biz.contact.complexPicker',
  'biz.customContact.multipleChoose',
  'biz.util.datetimepicker'
]

// 不需要dd.config便可以调用的钉钉接口
class DDBase {
  constructor () {
    // 就绪等级：0未就绪，1可以调用base接口，2可以调用权限接口
    this.readyLevel = 0
    this.inDDApp = navigator.userAgent.indexOf("DingTalk") > 0
    this.dd = window.dd

    if (!window.dd) {
      throw new Error('未检测到ddSDK')
    } else {
      this.readyLevel = 1
    }
  }

  // 获取设备信息
  getPhoneInfo () {
    return new Promise((resolve, reject) => {
      this.dd.ready(() => {
        this.dd.device.base.getPhoneInfo({
          onSuccess: data => {
            resolve(data)
          },
          onFail: err => {
            console.warn('获取设备信息失败:', err)
            reject({status: 1, msg: '获取设备信息失败', err})
          }
        })
      })
    })
  }

  // 设置页面标题
  setWebTitle (title) {
    return new Promise((resolve, reject) => {
      this.dd.ready(() => {
        this.dd.biz.navigation.setTitle({
          title,
          onSuccess: function (data) {
            resolve(data)
          },
          onFail: function (err) {
            console.warn('修改标题失败:', err)
            reject({status: 1, msg: '修改标题失败', err})
          }
        })
      })
    })
  }

  // 设置启用/禁用 ios弹性效果
  setWebViewBounce (boolean) {
    this.dd.ready(() => {
      if (boolean) {
        this.dd.ui.webViewBounce.enable()
      } else {
        this.dd.ui.webViewBounce.disable()
      }
    })
  }

  // 查看大图
  previewImage (opt) {
    return new Promise((resolve, reject) => {
      this.dd.ready(() => {
        this.dd.biz.util.previewImage({
          urls: opt.urls,//图片地址列表,数组
          current: opt.current,
          onSuccess: function (result) {
            resolve(result)
          },
          onFail: function (err) {
            reject(err)
          }
        })
      })
    })
  }

  // 日期选择器
  datetimepicker () {
    return new Promise((resolve, reject) => {
      this.dd.ready(() => {
        this.dd.biz.util.datetimepicker({
          format: 'yyyy-MM-dd HH:mm',
          value: '',
          onSuccess: function (result) {
            resolve(result)
          },
          onFail: function (err) {
            reject(err)
          }
        })
      })
    })
  }
}

// 需要调用dd.config,需要手动dd.init()
class DD extends DDBase {
  constructor () {
    super()
    this.signature = null
    this.signObj = null
    this.readyList = []
  }

  async init (url,time) {
    if (!url) url = window.location.origin+window.location.pathname+window.location.search
    this.signature = new Signature()

    this.signObj = await this.signature.getSignObj(url)

    this.dd.config({
      agentId: this.signObj.agentId, // 必填，微应用ID
      corpId: this.signObj.corpId,//必填，企业ID
      timeStamp: this.signObj.timeStamp, // 必填，生成签名的时间戳
      nonceStr: this.signObj.nonceStr, // 必填，生成签名的随机串
      signature: this.signObj.signature, // 必填，签名
      type: 0,   //选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0
      jsApiList: JSAPI_LIST
    })

    this.dd.error(err => {
      if(time){
        time++
      }else{
        time = 1
      }
      // 清除本地签名
      this.signature.signData.clear()
      if(time < 2){
        this.init(url,time)
      }else{
        alert('钉钉授权校验失败，已清空本地缓存，请退出后重试。如果重复出现此窗口，请截图'+err.errorMessage)
      }

      console.log(err)
    })

    this.dd.ready(()=>{
      this.readyLevel = 2
      this.readyList.forEach(fun=>{
        fun.call(this)
      })
      this.readyList = []
    })


  }

  ready(fun){
    if(this.readyLevel >=2){
      this.dd.ready(fun)
    }else{
      this.readyList.push(fun)
    }
  }

  // 获取用户信息
  getUser () {
    return new Promise((resolve, reject) => {
      this.ready(()=>{
        this.dd.biz.user.get({
          //corpId:'xxx', // 可选参数，如果不传则使用用户当前企业的corpId。
          onSuccess: function (data) {
            resolve(data)
          },
          onFail: function (err) {
            console.warn('获取用户信息失败:', err)
            reject({status: 1, msg: '获取用户信息失败', err})
          }
        });
      })
    })

  }

  // 获取定位经纬度
  getLocation (opt) {

    // todo 删除
/*    return Promise.resolve({
      longitude: 116.29829,
      lng:116.29829,
      latitude:40.04427,
      lat:40.04427
    })*/


    let withReGeocode = opt && opt.withReGeocode

    return new Promise((resolve, reject) => {
      this.ready(()=>{
        this.dd.device.geolocation.get({
          targetAccuracy: 200,
          coordinate: 1,
          withReGeocode, // 是否解析出地址
          useCache: true,
          onSuccess: function (data) {
            data.lng = data.longitude
            data.lat = data.latitude
            resolve(data)
          },
          onFail: function (err) {
            console.warn('定位失败:', err)
            reject({status: 1, msg: '定位失败', err})
          }
        });
      })
    })
  }

  // 上传图片仅支持手机拍照
  uploadImageFromCamera (opt) {
    let number = env.isIos ? 80 : 40
    return new Promise((resolve, reject) => {
      this.ready(() => {
        this.dd.biz.util.uploadImageFromCamera(Object.assign({
          compression: true,//(是否压缩，默认为true)
          quality: number, // 图片压缩质量,
          resize: number, // 图片缩放率
          stickers: {   // 水印信息
            time: "",
            dateWeather: "",
            username: "",
            address: ""
          },
        }, opt, {
          onSuccess: function (result) {
            resolve(result)
          },
          onFail: function (err) {
            reject(err)
          }
        }))
      })
    })
  }

  // 上传图片
  uploadImage (opt) {
    return new Promise((resolve, reject) => {
      this.ready(() => {
        this.dd.biz.util.uploadImage(Object.assign({
          compression: true,
          multiple: true,
          max: 9,
          quality: 50,
          resize: 50
        }, opt, {
          onSuccess: function (result) {
            resolve(result)
          },
          onFail: function (err) {
            reject(err)
          }
        }))
      })
    })
  }

}

export default new DD()

const DDExample = new DD()
const DDBaseExample = new DDBase()
export {
  DDExample as DD,
  DDBaseExample as DDBase
}
