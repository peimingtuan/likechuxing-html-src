import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        pageId:'profilePage',
        profilePage:true,
        pageIsShow:false,
        info:{},
        logoutBtn:false,
        canNavigate:true,
        couponNum:0   // 红包和优惠券的总数
    },
    onLoad() {
        this.getProfile();
    },
    onReady(){
        let _this = this;
        app.event.onEvent('rechargeSuccess',()=>{
            _this.getProfile();
        })
    },
    getProfile(callback) {
        var self = this ;
        //获取个人信息
        http.post({
            url:api.apiGetProfile(),
            data:{
                uuid:app.globalData.uuid,
                sign:app.globalData.sign
            }
        }).then((res)=>{
            
            if(res.status==0){
                self.setData({
                    info:res.data,
                    pageIsShow:true,
                    couponNum: parseInt(res.data.coupon_cash_num) + parseInt(res.data.coupon_num)
                })
                callback&&callback()
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    goCoupon() {
        my.navigateTo({
            url:'/page/preferential/preferential'
        });
    },
    goLicense() {
        let { license_status } = this.data.info;
        if(license_status==3) {
            my.navigateTo({
                url:'/page/authentication/authentication'
            });
        }else {
            my.navigateTo({
                url:'/page/certification/certification?status='+license_status
            });
        }
        
    },
    goBail() {
        let { canNavigate } = this.data;
        let _this = this;
        if(canNavigate){
            this.setData({
                canNavigate:false
            })
            this.getStatus().then((res)=>{

                if(res.deposit_status==1) {
                    if(res.is_open_zm_auth==1) {
                        my.navigateTo({
                            url: '/page/freeDeposit/freeDeposit',
                            success:()=>{
                                _this.setData({
                                    canNavigate:true
                                })
                            }
                        })
                    }else{
                        my.navigateTo({
                            url: '/page/payBail/payBail',
                            success:()=>{
                                _this.setData({
                                    canNavigate:true
                                })
                            }
                        });
                    }
                }else{
                    my.navigateTo({
                        url:'/page/bail/bail',
                        success:()=>{
                            _this.setData({
                                canNavigate:true
                            })
                        }
                    });
                } 
            }).catch((err)=>{
                console.log(err)
                _this.setData({
                    canNavigate:true
                })
            })
        }
        
    },
    _logout() {
        my.confirm({
            title:'提示',
            content:'确定要退出登录吗',
            success: (res) => {
                if(res.confirm) {
                    my.clearStorageSync();
                    app.globalData.hasLogin = false;
                    app.globalData.uuid = '';
                    app.globalData.sign = '';
                    my.reLaunch({
                        url: '/page/index/index',
                        complete:()=>{
                            app._getBaseInfo()
                        }
                    });
                }
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
    goinvitePage() {
        my.navigateTo({
            url:'/page/inviteFriends/inviteFriends'
        });
    },
    callPhone() {
        my.makePhoneCall({ number: '400-666-2333' });
    },
    goRecharge(){
        let isFirst = false;
        if(this.data.info.charge_discount!=''){
            isFirst = true;
        }
        my.navigateTo({
            url:'/page/recharge/recharge?isFirst='+isFirst
        })
    },
    goMyTrip(){
        my.navigateTo({
            url:'/page/myTrip/myTrip'
        })
    },
    onUnload(){
        app.event.offEvent('rechargeSuccess')
    }
})