import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
import utils from '../../common/utils';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        num:'',
        pageIsShow:false
    },
    onLoad() {
        this.getBailInfo(); 
    },
    goBailRcord() {
        my.navigateTo({
            url:'../../page/bailRecording/bailRecording'
        });
    },
    getPayStr() { //获取支付字符串;
        let { num } = this.data;
        var self = this ;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetAlipayStr(),
                data:{
                    type:3,
                    methond:1,
                    money:num,
                    city_id:app.globalData.city_id,
                    sign:app.globalData.sign,
                    uuid:app.globalData.uuid
                }
            }).then((res)=>{
                if(res.status===0) {
                    resolve(res.data.alipay_str)
                }else{
                    reject(res.msg)
                }
            }).catch((err)=>{
                console.log(err)
            })
        })
        return p;
    },
    goAuthentication() {
        let _this = this;
        this.getPayStr().then((str)=>{
            if(str!='') {
                my.tradePay({
                    orderStr:str,
                    success: (res) => {
                        if(res.resultCode==9000) {
                            _this.getStatus().then((data)=>{
                                if(data.license.status==3) {
                                    my.redirectTo({
                                        url: '/page/authentication/authentication',
                                    });
                                }else{
                                    my.redirectTo({
                                    url: '/page/index/index'
                                    });
                                } 
                            }).catch((err)=>{
                                console.log(err)
                            })  
                        }
                    }
                });
            }
        }).catch((err)=>{
            console.log(err);
        })

    },
    getBailInfo() {
        let { uuid,sign,longitude,latitude,city_name,city_id } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            user_lat:longitude,
            user_lng:latitude,
            city_id:city_id,
            city_name:city_name
        }
        let _this = this;
        http.post({
            url:api.apiQueryBail(),
            data:data
        }).then((res)=>{
            console.log(res)
            if(res.status===0) {
                if(res.data.deposit_status==1) {
                    _this.setData({
                        num:utils.switchNum(res.data.deposit),
                        pageIsShow:true
                    })
                }
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    goBailDesc() {
        my.navigateTo({
            url:'/page/bailDesc/bailDesc'
        })
    },
    getStatus(){//获取审核状态
        let { uuid,sign } = app.globalData;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetUserInfo(),
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
})