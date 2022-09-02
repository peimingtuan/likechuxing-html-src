import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        coupon_cash:[],
        coupon:[],
        info:{},
        show:false,
        pageIsShow:false,
    },
    onLoad() {
        // let res = {
        //     "status": 0,
        //     "msg": "请求成功",
        //     "data": {
        //         "balance": "100454.3",
        //         "unpay_renta": {
        //             "uuid": "RE15407461938851",
        //             "status": "10"
        //         },
        //         "voucher": {
        //             "gift_balance":100,//新增加 (赠送的金额)
        //             "coupon_cash": [
        //                 {
        //                     "cnt": 1,
        //                     "money": "20.00"
        //                 },
        //                 {
        //                     "cnt": 1,
        //                     "money": "10.00"
        //                 }
        //             ],
        //             "coupon": [
        //                 {
        //                     "cnt": 1,
        //                     "money": "30.00"
        //                 },
        //                 {
        //                     "cnt": 1,
        //                     "money": "10.00"
        //                 }
        //             ]
        //         },
        //         "coupon_cnt": 12,
        //         "coupon_cash_cnt": "5",
        //         "activity": [
        //             {
        //                 "banner": "https://images.likechuxing.com/activity/evaluate_list.png",
        //                 "url": "https://www.baidu.com/"
        //             }
        //         ]
        //     }
        // }
        // this.setData({
        //     coupon_cash:res.data.voucher.coupon_cash,
        //     coupon:res.data.voucher.coupon,
        //     info:res.data,
        //     pageIsShow:true
        // })
        this.getProfile()
    },
    toggle(){
        this.setData({
            show:!this.data.show
        })
    },
    getProfile() {
        var self = this ;
        let { uuid,sign,city_id,longitude,latitude} = app.globalData;
        http.post({
            url:api.apiChargeSuccess(),
            data:{
                uuid,
                sign,
                city_id,
                user_lat:latitude,
                user_lng:longitude
            }
        }).then((res)=>{
            
            if(res.status==0){
                console.log(JSON.stringify(res.data))
                self.setData({
                    coupon_cash:res.data.voucher.coupon_cash,
                    coupon:res.data.voucher.coupon,
                    info:res.data,
                    pageIsShow:true
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    goAcount(){
        my.redirectTo({
            url:'/page/bail/bail'
        })
    },
    goCoupon() {
        my.navigateTo({
            url:'/page/coupon/coupon'
        });
    },
    goHongbao() {
        my.navigateTo({
            url:'/page/hongbao/hongbao'
        });
    },
    goIndexPage(){
        my.reLaunch({
            url: '/page/index/index',
            complete:()=>{
            app._getBaseInfo()
            }
        });
    }
})