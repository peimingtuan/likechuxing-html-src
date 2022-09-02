import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    data:{
        bind_info:{}
    },
    postAuthCode() {
        let _this = this;
        my.getAuthCode({
            scopes: 'auth_zhima',
            success: (res) => {
                console.log(res)
                my.showLoading({
                    content:'授权中...'
                })
                let { uuid,sign,openid } = app.globalData;
                http.post({
                    url:api.apiGetZhiMa(),
                    data:{
                        uuid:uuid,
                        sign:sign,
                        auth_code:res.authCode,
                        type:2,
                        openid:openid,
                        city_id:app.globalData.city_id,
                        user_lat:app.globalData.latitude,
                        user_lng:app.globalData.longitude
                    }
                }).then((json)=>{
                    my.hideLoading();
                    if(json.status==0){
                        my.showToast({
                            content:'授权成功',
                            success:()=>{
                                _this.getStatus()
                                .then((result)=>{
                                    console.log(result)
                                    if(result.license_status==3) {
                                        my.redirectTo({
                                            url: '/page/authentication/authentication'
                                        });
                                    }else{
                                        my.reLaunch({
                                            url: '/page/index/index',
                                            complete:()=>{
                                            app._getBaseInfo()
                                            }
                                        })
                                    }
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            }
                        })
                        
                    }else if(json.status==9001){
                        my.confirm({
                            content:'你的芝麻信用分不足，无法免保证金用车，请缴纳保证金',
                            confirmButtonText:'缴纳保证金',
                            success: (res) => {
                                if(res) {
                                    my.redirectTo({
                                        url:'/page/payBail/payBail'
                                    })
                                }
                            },
                        });
                    }else{
                        my.confirm({
                            content:json.msg,
                            confirmButtonText:'缴纳保证金',
                            success: (res) => {
                                if(res) {
                                    my.redirectTo({
                                        url:'/page/payBail/payBail'
                                    })
                                }
                            },
                        });
                    }
                }).catch((err)=>{
                    my.hideLoading();
                    console.log(err)
                })
            },
            fail:function(){
                my.confirm({
                            content:'芝麻信用授权失败，请缴纳用车保证金',
                            confirmButtonText:'缴纳保证金',
                            success: (res) => {
                                if(res) {
                                    my.redirectTo({
                                        url:'/page/payBail/payBail'
                                    })
                                }
                            },
                        });
            }
        });
    },
    goPayBail() {
        my.navigateTo({
            url:'/page/payBail/payBail'
        });
    },
    getStatus(){//获取审核状态
        let { uuid,sign } = app.globalData;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetProfile(),
                data:{
                    uuid:uuid,
                    sign:sign
                }
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
    tip() {
        my.alert({
            content:'免保证金以芝麻信用综合评估结果为准',
            buttonText:'我知道了'
        })
    }
})