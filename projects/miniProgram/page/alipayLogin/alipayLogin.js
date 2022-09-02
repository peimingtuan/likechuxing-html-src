import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    login() {
        let _this = this;
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                console.log(res)
                my.showLoading({
                    content:'登录中...'
                })
                http.post({
                    url:api.apiPostAuthCode(),
                    data:{
                        auth_code:res.authCode,
                        type:2,
                        channel:app.globalData.city_id+'_'+app.globalData.channel
                    }
                }).then((json)=>{

                    if(json.status==1) {
                        my.alert({
                            content:json.msg,
                            success:()=>{
                                return;
                            }
                        })
                    }
                    app.globalData.uuid = json.data.user_info.uuid;
                    app.globalData.sign = json.data.user_info.sign;
                    app.globalData.hasLogin = true;
                    _this.getStatus().then((res)=>{
                        my.hideLoading();
                        
                        app.globalData.deposit_status = res.deposit_status;
                        app.globalData.license_status = res.license_status;
                        if(res.deposit_status==1) {
                            if(res.is_open_zm_auth==1) {
                                my.redirectTo({
                                    url: '/page/freeDeposit/freeDeposit'
                                });      
                            }else{
                                my.redirectTo({
                                    url: '/page/payBail/payBail'
                                }); 
                            }
                        }else{
                            if(res.license_status==3) {
                                my.redirectTo({
                                    url: '/page/authentication/authentication'
                                });
                            }else{
                                my.reLaunch({
                                    url: '/page/index/index',
                                    complete:()=>{
                                        app._getBaseInfo()
                                    }
                                });
                            }
                        }
                    }).catch((err)=>{
                        my.hideLoading();
                        console.log(err)
                    })

                }).catch((err)=>{
                    my.hideLoading();
                    console.log(err)
                })
            },
        });
    },
    getStatus(){//获取审核状态
        let { uuid,sign,longitude,latitude,city_name,city_id } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:longitude,
            user_lng:latitude,
            city_id:city_id,
            city_name:city_name
        }
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiQueryBail(),
                data
            }).then((res)=>{
                if(res.status==0) {
                    resolve(res.data);
                }else{
                    reject(res.msg);
                }
            }).catch((err)=>{
                conosle.log(err)
            })
        })
        return p;
    },
    goLogin() {
        my.redirectTo({
            url:'/page/bindPhone/bindPhone'
        });
    }
})