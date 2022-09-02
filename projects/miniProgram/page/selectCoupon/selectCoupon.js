import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
import onShareAppMessage from '../../common/shareAppMessage';
var app = getApp();

Page({
    onShareAppMessage,
    data:{
        isEmpty:false,
        is_reach_ceiling:false,
        list:[],
        key:0,
        fee_total:0,
        leftNum:'',
        descList:[
            '1.优惠券不同享、不找零；',
            '2.每个订单限用一个优惠券；',
            '3.每日可使用6次优惠（包含优惠券和红包）；',
            '4.优惠券需要在有效范围内使用，过期后自动作废；',
            '5.优惠券仅在可以满足其使用限制的订单中使用；',
            '6.免费用车券可抵扣订单中对应时产生的里程费和时长费，超过的时间正常收费；',
            '7.无法支付“不计免赔服务”费用。'
        ],
        chooseNum:0,
        isClick:true
    },
    onLoad(query) {
        this.setData({
            key:query.key,
            fee_total:query.fee_total,
            chooseNum: query.chooseNum
        })
        this.getList();
        console.log(this.data.chooseNum)
    },
    handleItem(key) {     
      if(this.data.isClick){
        this.setData({
          isClick:false
        })
        let arr = this.data.list.slice();
        if (arr[key].valid) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            coupon: arr[key],
            couponKey: key,
            couponVal: utils.switchNum(arr[key].money)
          })
          prevPage.getFee(() => {
            my.navigateBack();
          })
        }
      }
    },
    getList() {
        let self = this;
        let key = this.data.key;
        http.post({
            url:api.apiRentalCouponList(),
            data:{
                uuid:app.globalData.uuid,
                sign:app.globalData.sign,
                fee_total:self.data.fee_total,
                version:2
            }
        }).then((res)=>{
            if(res.status===0) {
                if(res.data.coupons.length) {
                    // 判断当天是否达到使用上限
                    if(res.data.is_reach_ceiling){
                        self.setData({
                            is_reach_ceiling:true
                        })
                    }
                    if(res.data.voucher.left_coupon_sum_cnt==-1){
                        self.setData({
                          leftNum: res.data.voucher.left_coupon_cnt - self.data.chooseNum
                        })
                    }else{
                       self.setData({
                         leftNum: res.data.voucher.left_coupon_sum_cnt - self.data.chooseNum
                        }) 
                    }

                    let arr = res.data.coupons;
                    let data =  self.filterData(arr)
                    for(let i = 0;i<data.length;i++) {
                        data[i].selected = false;
                        if(res.data.is_reach_ceiling){
                            data[i].valid = 0
                        }else{
                            data[i].valid = 1
                        }
                    }
                    if(key!='') {
                        data[key].selected = true;
                    }
                    self.setData({
                        isEmpty:false,
                        list:self.data.list.concat(data)
                    })
                    console.log(this.data.list)
                }else {
                    self.setData({
                        isEmpty:true,
                    })
                }
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
            resItem.id = item.id;
            resItem.name = item.name;
            resItem.case = item.instructions ;
            resItem.time = utils.toDate(item.expire_start_time)+' - '+utils.toDate(item.expire_end_time);
            resItem.money = parseInt(item.free_money);
            resItem.numCase = item.minimum;
            resItem.freeTime = parseInt(item.free_time/60);
            resItem.type = item.type;
            return resItem
        })
        return res
    },
    goNextPage() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length-2];
        prevPage.setData({
            coupon:{},
            couponKey:'',
            couponVal:'',
            isUsed:true
        })
        prevPage.getFee(()=>{
            my.navigateBack();
        })
    }
})