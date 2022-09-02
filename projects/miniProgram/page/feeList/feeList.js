import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
var app = getApp();
Page({
    data:{
        info:{},
        h:'',
        m:'',
        pay_time:'',
        end_time:'',
        begin_time:'',
        book_time:'',
        rental_no:'',
        pageIsShow:false,
        rental_actual_fee:0,
        distance:0,
        price_desc:"",
        distance_fee:0,
        rental_zero_money:0
    },
    onLoad(query) {
       
        this.setData({
            rental_no:query.rental_no
        })
        this._getTripDetail();
    },
    _getTripDetail(){
        let { rental_no }= this.data;
        let { uuid, sign } = app.globalData;
        let data = {
            uuid:uuid,
            sign:sign,
            rental_no:rental_no
        }
        let _this = this;
        http.post({
            url:api.apiTripDetail(),
            data
        }).then((res)=>{
            if(res.status==0){
                let info = res.data;
                _this.switchProperty('distance',info);
                _this.switchProperty('fee_total',info);
                _this.switchProperty('km_fee',info);
                _this.switchProperty('time_fee',info);
                _this.switchProperty('parking_fee_in',info);
                _this.switchProperty('coupon_fee',info);
                _this.switchProperty('balance_in',info);
                _this.switchProperty('balance',info);
                _this.switchProperty('actual_fee',info);
                _this.setData({
                    info:info,
                    h:parseInt(info.total_time/3600),
                    m:parseInt(info.total_time%3600/60),
                    pay_time:_this.toTime(info.pay_time),
                    end_time:_this.toTime(info.end_time),
                    begin_time:_this.toTime(info.begin_time),
                    book_time:_this.toTime(info.book_time),
                    pageIsShow:true,
                    price_insurance:Number(info.price_insurance)>0 ? info.price_insurance : Number(info.price_insurance),
                    rental_actual_fee:parseFloat(info.rental_actual_fee).toFixed(2),
                    distance:Number(info.distance)>0 ? info.distance : Number(info.distance),
                    price_desc:this.CarPrice(info.price_desc),
                    distance_fee:(parseFloat(info.fee_total_insurance) + parseFloat(info.fee_total)).toFixed(2),
                    rental_zero_money:Number(info.rental_zero_money)>0 ? info.rental_zero_money : Number(info.rental_zero_money),
                })
              console.log(Number(info.price_insurance) > 0 ? info.price_insurance : Number(info.price_insurance))
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    toTime(timestamp) {
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = this.toTwo(date.getDate()) + ' ';
        let h = this.toTwo(date.getHours()) + ':';
        let m = this.toTwo(date.getMinutes()) + ':';
        let s = this.toTwo(date.getSeconds());
        return Y+M+D+h+m+s;
    },
    toTwo(data) {
        return data<10?'0'+data:data;
    },
    switchProperty(pro,obj) {
        if(obj.hasOwnProperty(pro)) {
            obj[pro] = utils.switchNum(obj[pro])
        }
    },
    CarPrice(data){
        let price_order = []
        
        if(data){
            if(/%3c/i.test(data)) text = decodeURIComponent(data.replace(/\+/g,' '))
            data.replace(/(\d\.\d{2}|元\/分钟|元\/公里)/g,match=> {
                price_order.push(match)
            })
            return price_order[0]+price_order[1]+' + '+price_order[2]+price_order[3]
        }
        // getPrice(){
        //     return this.price_order.concat()
        // }

        // getPricePureText(){
        // }

    }
})