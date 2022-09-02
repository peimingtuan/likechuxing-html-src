import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        phone:'',
        codeIshow:false,
        count:60,
    },
    getPhone(e) {//获取手机号
        if(e.detail.value) {
            this.setData({
                phone:e.detail.value,
            })
        }
    },
    getCode(e) {//验证码发往后台验证
        let phone = this.data.phone;
        let code = e.detail.value;
        let _this = this;
        if(!(/^1[3456789]\d{9}$/.test(phone))) {
            my.showToast({
                content:'请输入正确手机号',
                success:()=>{
                    return false;
                }
            });
        }
        if((/^1[3456789]\d{9}$/.test(phone)) && code.length==4){
            http.post({
                url:api.apiLogin(),
                data:{
                    phone:phone,
                    code:code,
                    channel:app.globalData.city_id+'_'+app.globalData.channel
                }
            }).then((res)=>{
                
                if(res.status!=1){
                    //保存全局变量
                    app.globalData.uuid = res.data.uuid;
                    app.globalData.sign = res.data.sign;
                    app.globalData.hasLogin = true;
                    //获取保证金信息
                    _this.getStatus().then((res)=>{
                        app.globalData.deposit_status = res.deposit_status;
                        app.globalData.license_status = res.license_status;
                        if(res.deposit_status==1) {
            
                            my.redirectTo({
                              url: '/page/payBail/payBail'
                            });
                        }else{
                            if(res.license_status==3) {
                                my.redirectTo({
                                    url: '/page/authentication/authentication'
                                });
                            }else{
                                my.redirectTo({
                                    url: '/page/index/index'
                                });
                            }
                        }
                    }).catch((err)=>{
                        console.log(err)
                    })
                    
                    //储存用户信息
                    my.setStorage({
                        key: 'loginInfo',
                        data: {
                            uuid:res.data.uuid,
                            sign:res.data.sign
                        },
                    });
                }else{
                    my.showToast({
                        content:res.msg
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })

        }     
    },
    fetchCode() {//获取验证码
        var phone = this.data.phone;
        var _this = this;
        if(/^1[3456789]\d{9}$/.test(phone)) {
            //显示倒计时
            this.setData({
                codeIshow:true
            })
            var time = 59;
            this.timer&&clearInterval(this.timer);
            this.timer = setInterval(function() {
                _this.setData({
                    count:time
                })
                time--;
                if(time<0) {
                    time = 60
                    _this.setData({
                        codeIshow:false,
                        count:time
                    })
                    this.timer&&clearInterval(this.timer);
                }
            },1000)
            //获取验证码
            http.post({
                url:api.apiLoginGetCode(),
                data:{
                    phone:phone
                }
            })
            .then((res)=>{
                console.log(res)
                my.showToast({
                    content:res.msg
                });
            })
            .catch((err)=>{
                console.log(err)
            })
        }else{
            my.showToast({
              content:'请输入正确手机号'
            });
        }
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
    goLicence() {
        my.navigateTo({
            url:'/page/license/license'
        });
    },
    onUnload() {//清除定时器
        this.timer&&clearInterval(this.timer);
    }
}) 