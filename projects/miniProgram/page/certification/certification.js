import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        status:10,
        reason:'',
        pageIsShow:false
    },
    onLoad() {
        let _this = this;
        this.getStatus().then((res)=>{
            _this.setData({
                status:res.license.status,
                reason:res.license.reason||'',
                pageIsShow:true
            })
        }).catch((err)=>{
            console.log(err);
        })
    },
    goIndexPage() {
        my.reLaunch({
            url:'/page/index/index',
            complete:()=>{
                app._getBaseInfo()
            }
        });
    },
    goAuthenticationPage() {
        my.redirectTo({
            url:'/page/authentication/authentication'
        });
    },
    getStatus(){//获取审核状态
        let { uuid,sign } = app.globalData;
        let p = new Promise((resolve,reject)=>{
            http.post({
                url:api.apiGetUserInfo(),
                data:{
                    uuid:uuid,
                    sign:sign,
                    auth:0
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
    callPhone() {
        my.makePhoneCall({ number: '400-666-2333' });
    }
})