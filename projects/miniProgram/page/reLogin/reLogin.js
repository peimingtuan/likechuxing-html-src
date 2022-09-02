import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();

Page({
    reLogin() {
        let _this = this;
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
                    app.globalData.openid = data["bind_info"].openid
                    if(data["user_info"]) {
                        app.globalData.uuid = data["user_info"].uuid;
                        app.globalData.sign = data["user_info"].sign;
                        app.globalData.hasLogin = true;
                    }else{
                        app.globalData.hasLogin = false;
                    }
                    my.reLaunch({
                      url: '/page/index/index',
                      complete:()=>{
                        app._getBaseInfo()
                      }
                    });
                }).catch((err)=>{
                    reject(err)
                    console.log(err)
                })
            },
            fail:(err)=>{
                console.log(err)
            }
        });
    }
})