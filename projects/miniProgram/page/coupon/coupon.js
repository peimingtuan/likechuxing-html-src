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
            '1.优惠券不同享、不找零；',
            '2.每个订单限用一个优惠券；',
            '3.每日可使用6次优惠（包含优惠券和红包）；',
            '4.优惠券需要在有效范围内使用，过期后自动作废；',
            '5.优惠券仅在可以满足其使用限制的订单中使用；',
            '6.免费用车券可抵扣订单中对应时产生的里程费和时长费，超过的时间正常收费；',
            '7.无法支付“不计免赔服务”费用。'
        ]
    },
    onLoad() {
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
                version:2
            }
        }).then((res)=>{
            if(res.status===0) {
                let data =  self.filterData(res.data)
                self.setData({
                    list:self.data.list.concat(data),
                    begin:self.data.begin+10
                })
  
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