import api from '../../common/api';
import http from '../../common/http';
import util from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();
Page({
    onShareAppMessage,
    data:{
        list:[],
        begin:0,
        descList:[
            '1.红包不同享、不找零；',
            '2.每个订单限用一个红包；',
            '3.每日可使用6次优惠（包含优惠券和红包）；',
            '4.红包需要在有效范围内使用，过期后自动作废；',
            '5.红包仅在可以满足其使用限制的订单中使用；',
            '6.无法支付“不计免赔服务”费用。'
        ]
    },
    onLoad() {
        getCurrentPages()[0].$viewId = 'index'
        console.log(getCurrentPages())
        console.log(this.route)
        this.getList();
    },
    getList(callback) {
        let self = this;
        let { uuid,sign,city_id,longitude,latitude,city_name,sys_string } = app.globalData
        http.post({
            url:api.apiGetCouponList(),
            data:{
                uuid,
                sign,
                status:0,
                begin:self.data.begin,
                user_lat:latitude,
                user_lng:longitude,
                user_sys_version:sys_string,
                city_id,
                version:2,
                type:1
            }
        }).then((res)=>{
            if(res.status===0) {
                let data =  self.filterData(res.data)
                self.setData({
                    list:self.data.list.concat(data),
                    begin:self.data.begin+10
                })
                console.log(self.data)
                callback&&callback()
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    filterData(arr){
        if(!arr.length){
            return []
        }
        let res = arr.map(item=>{
            let resItem = {}
            resItem.name = item.name;
            resItem.case = item.instructions ;
            resItem.time = util.toDate(item.expire_start_time)+' - '+util.toDate(item.expire_end_time);
            resItem.money = parseInt(item.free_money);
            resItem.numCase = item.minimum;
            resItem.freeTime = parseInt(item.free_time/60);
            resItem.type = item.type;
            return resItem
        })
        return res
    },
    onReachBottom() {
        this.getList();
    },
    onUnload() {
        this.setData({
            begin:0,
            list:[]
        })
    }
})