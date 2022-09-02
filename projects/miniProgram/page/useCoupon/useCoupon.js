import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        code:''
    },
    getCode(e) {
        this.setData({
            code:utils.trimStr(e.detail.value)
        })
    },
    convertCoupon() {
        console.log(this.data.code)
        http.post({
            url:api.apiConvertCoupon(),
            data:{
                uuid:app.globalData.uuid,
                sign:app.globalData.sign,
                code:this.data.code
            }
        }).then((res)=>{
            if(res.status==0) {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length-2];
                let profilePage = pages[pages.length-3];
                prevPage.setData({
                    begin:0,
                    list:[]
                })
                profilePage.getProfile();
                prevPage.getList(()=>{
                    my.showToast({
                        content:res.msg,
                        success:()=>{
                            my.navigateBack();
                        }
                    });
                });
            }else{
                my.showToast({
                    content:res.msg
                });
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
})