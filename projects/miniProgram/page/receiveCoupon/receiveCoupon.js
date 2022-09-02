import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();

Page({
    receiveCoupon() {
        let { openid,uuid,sign,city_id } = app.globalData;
        let data = {
            openid,
            uuid,
            sign,
            activity_id:1,
            city_id:city_id
        }
        http.post({
            url:api.apiReceiveCoupon(),
            data
        }).then((res)=>{
            console.log(res)
            if(res.status==0) {
                console.log(app.globalData.new_user);
                if(res.data.voucher_id){
                    my.confirm({
                        content:'您已经获得一张2小时免费用车券,您还有资格去领取一张30元代金券，快去领取吧',
                        confirmButtonText: '马上领取',
                        cancelButtonText: '不需要',
                        success: (result) => { 
                            console.log(result)
                            if(result.confirm) {
                                my.redirectTo({
                                    url:'/page/webview/webview?id='+res.data.voucher_id
                                })
                            }else{
                                my.navigateBack();
                            }
                            
                        },
                    });
                }else{
                    my.alert({
                        content:'您已经获得一张2小时免费用车券，用车后可选择使用',
                        buttonText:'好的,谢谢',
                        success:()=>{
                            my.navigateBack();
                        }
                    })
                }
            }else if(res.status==3){
                my.alert({
                    content:res.msg,
                    success: (res) => {
                        my.redirectTo({
                          url: '/page/alipayLogin/alipayLogin'
                        });
                    },
                });
            }else{
                my.alert({
                    content:res.msg
                });
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
})