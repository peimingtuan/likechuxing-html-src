import api from '../../common/api';
import http from '../../common/http';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp()
Page({
    onShareAppMessage,
    data:{
        rental_no:'',
        num:0,
        alipay_str:'',
        pageIsShow:false
    },
    onLoad(query) {
        this.setData({
            rental_no:query.rental_no
        })
        this.getNum()
        
    },
    getPayStr() {
        //获取支付字符串;
        var self = this ;
        let { uuid,sign,city_id } = app.globalData;
        let { num,rental_no } = this.data;
        http.post({
            url:api.apiGetAlipayStr(),
            data:{
                type:1,
                methond:1,
                money:num,
                rental_no:rental_no,
                city_id:city_id,
                sign:sign,
                uuid:uuid
            }
        }).then((res)=>{
            if(res.status===0) {
                self.setData({
                    alipay_str:res.data.alipay_str
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    getNum() {
        let { rental_no } = this.data;
        let { uuid,sign } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            rental_no:rental_no
        }
        let _this = this;
        http.post({
            url:api.apiPayAmount(),
            data
        }).then((res)=>{
            if(res.status==0) {
                _this.setData({
                    num:res.data.fee_actual,
                    pageIsShow:true
                })
                _this.getPayStr();
            }
        }).catch((err)=>{
            console.log(err)
        })

    },
    goAuthentication() {
        let _this = this;
        if(this.data.alipay_str!=''){
            my.tradePay({
                orderStr:this.data.alipay_str,
                success: (res) => {
                    if(res.resultCode==9000) {
                        my.redirectTo({
                          url: '/page/tripDetail/tripDetail?rental_no='+_this.data.rental_no,
                        });
                    }
                }
            });
        }
    }
})