import api from '../../common/api';
import http from '../../common/http';
import utils from '../../common/utils';
var app = getApp()
Page({
  data: {
    code:'',
    coupon_cnt:'',
    coupon_cash_cnt:'',
    coupon_cash:[],
    coupon:[],
    pageIsShow:false
  },
  onLoad() {
    this.initData()
  },
  getCode(e) {
      this.setData({
          code:utils.trimStr(e.detail.value)
      })
  },
  convertCoupon() {
      if(!this.data.code){
        my.showToast({
            content:'请输入兑换码'
        });
        return
      }
      const _this = this;
      http.post({
          url:api.apiConvertCoupon(),
          data:{
              uuid:app.globalData.uuid,
              sign:app.globalData.sign,
              code:this.data.code
          }
      }).then((res)=>{
          if(res.status==0) {
            _this.initData()
          }else{
              my.showToast({
                  content:res.msg
              });
          }
      }).catch((err)=>{
          console.log(err)
      })
  },
  initData(){
    let _this = this;
    http.post({
      url:api.apiGetPreferential(),
      data:{
        uuid:app.globalData.uuid,
        sign:app.globalData.sign
      }
    }).then(res=>{
      if(res.status==0){
        _this.setData({
          coupon_cnt:parseInt(res.data.coupon_cnt),
          coupon_cash_cnt:parseInt(res.data.coupon_cash_cnt),
          coupon_cash:_this.filterData(res.data.coupon_cash),
          coupon:_this.filterData(res.data.coupon),
          pageIsShow:true
        })
      }else{
        my.showToast({
          content:res.msg
        })
      }
    }).catch(err=>{
      console(err)
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
      resItem.time = utils.toDate(item.expire_start_time)+' - '+utils.toDate(item.expire_end_time);
      resItem.money = parseInt(item.free_money);
      resItem.numCase = item.minimum;
      resItem.freeTime = parseInt(item.free_time/60);
      resItem.type = item.type;
      return resItem
    })
    return res
  },
  goCoupon(){
    my.navigateTo({
      url:'/page/coupon/coupon'
    });
  },
  goHongbao(){
    my.navigateTo({
      url:'/page/hongbao/hongbao'
    });
  },
  goCouponHistory() {
      my.navigateTo({
          url:'/page/couponHistory/couponHistory'
      });
  }
});
