import api from './common/api';
import http from './common/http';
import Event from './common/levent';

App({
  onLaunch(options) {
    this.globalData.channel = (options.query && options.query.channel) ? options.query.channel : '8929'

    this._getBaseInfo();
  },
  globalData: {
    channel:'8928',
    hasLogin: false,//是否是登录状态
    uuid: '',
    sign: '',
    longitude: 0,//经度
    latitude: 0,//纬度
    city_name: '',//城市
    city_id: '0',//城市id
    sys_string: 'miniprogram',//系统信息拼接字符串
    openid:'',
    auth_token:''
  }, 
  event:new Event(),
  onShow() {
    var pages = getCurrentPages();
    if(pages.length==1){
        this.checkPage();
    }
  },
  checkPage() {//检查是否有当前行程
        this._checkIsLogin().then((isLogin)=>{
            
            if(isLogin) {
                let { uuid, sign } = this.globalData;
                let data = {
                    uuid:uuid,
                    sign:sign
                }
                http.post({
                    url:api.apiGetCurrentOrder(),
                    data
                }).then((json)=>{
                    switch (json.status) {
                        case 0:
                            if (json.data.is_car_begin == 0) {//创建订单(未开门)
                                my.navigateTo({
                                    url: '/page/pickCarWaiting/pickCarWaiting'
                                })
                            } else if (json.data.is_car_begin == 1) {//订单已开始（计费开始）
                                my.navigateTo({
                                    url: '/page/cuurentTrip/cuurentTrip'
                                })
                            }
                            break;
                        case 1001://未支付订单
                            my.navigateTo({
                                url: '/page/payOrder/payOrder?rental_no=' + res.data.rental_no
                            })
                            break;
                        case 1003:
                            if(json.msg){
                                my.showToast({
                                  content:json.msg, 
                                  duration:1000, 
                                  success: (res) => {
                                    my.navigateTo({
                                        url:'/page/payBail/payBail'
                                    })
                                  },
                                });
                            }else{
                                my.navigateTo({
                                    url:'/page/payBail/payBail'
                                })
                            }
                            
                            break;
                        case 1007:
                            my.navigateTo({
                                url:'/page/orderTip/orderTip'
                            })
                            break;
                        case 1008:
                            my.navigateTo({
                                url:'/page/payTip/payTip'
                            })
                            break;
                        case 1009:
                            my.navigateTo({
                                url: '/page/authentication/authentication'
                            })
                            break;
                        case 1013:  
                            my.navigateTo({
                                url: '/page/submitOrder/submitOrder?rental_no=' + json.data.rental_no
                            })
                            break;
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
  _getCityId() {//获取城市ID
    let _this = this;
    my.getLocation({
          type:1,
          success:(location)=>{
            _this.globalData.longitude = location.longitude;
            _this.globalData.latitude = location.latitude;
            _this.globalData.city_name = location.city;
            let data = {
              city_name: location.city,
              user_lng: location.longitude,
              user_lat: location.latitude,
              channel:this.globalData.channel
            }

            http.post({
              url:api.apiGetCityId(),
              data:data
            }).then((res)=>{

                if(res.status==0) {
                    let city_id = parseInt(res.data.city_id);
                    _this.globalData.city_id = city_id;
                    if( city_id === 213 ||city_id === 202 || city_id === 197){
                        my.reLaunch({
                            url:'/page/k4t4/k4t4'
                        })
                        return
                    }
                    this.event.emitEvent('getCityIdSuccess',city_id)
                }
            }).catch((err)=>{
                console.log(err)
            })
          },
          fail:(err)=>{
            console.log(JSON.stringify(err))
            my.navigateTo({
                url: '/page/setting/setting'
            }) 
          }
        })
  },
  _getSystemInfo() {//获取系统信息

    let p = new Promise((resolve,reject)=> {
      my.getSystemInfo({
        success: (res) => {
          this.globalData.screenHeight = res.screenHeight
          this.globalData.platform = res.platform;
          let str = res.model + res.version + res.platform;
          this.globalData.sys_string = this._trimString(str);
          resolve(this.globalData.sys_string)
        },
        fail:(err)=>{
          reject(err);
        }
      })
    })
    return p;
    
  },
  _checkIsLogin() {//判断登录状态
    let p = new Promise((resolve,reject)=>{

      if (this.globalData.uuid) {
        this.globalData.hasLogin = true;
        resolve(true);
      } else {
        this.globalData.hasLogin = false;
        resolve(false);
      }
      if(!this.globalData.uuid){
        reject('未登录')
      }
    })
    return p;
  },
  _getBaseInfo() {
    this._getSystemInfo();
    this._getCityId();
  },
  _trimString(str) {
    return str.split(' ').join('*');
  },
  getAccount() {//静默授权登录
    let _this = this;
    let p = new Promise((resolve,reject)=>{
      my.getAuthCode({
            scopes: 'auth_base',
            success: (res) => {
                http.post({
                    url:api.apiPostAuthCode(),
                    data:{
                        auth_code:res.authCode,
                        type:2,
                        auth_type:1,
                    }
                }).then((json)=>{
                    let data = json.data;
                    _this.globalData.openid = data["bind_info"].openid
                    if(data["user_info"]) {
                      _this.globalData.uuid = data["user_info"].uuid;
                      _this.globalData.sign = data["user_info"].sign;
                      _this.globalData.hasLogin = true;
                    }else{
                      _this.globalData.hasLogin = false;
                    }
                    resolve(json.data.bind_info);
                }).catch((err)=>{
                    reject(err)
                    console.log(err)
                })
            },
            fail:(err)=>{
                console.log(err)
            }
        });
    })
    return p ;
  }
});
