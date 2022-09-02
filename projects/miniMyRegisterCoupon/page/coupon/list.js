import myAjax from '../../common/myAjax'
import getApiUrl from '../../common/getApiUrl'

const app = getApp()

Page({
  data: {
    list:[],
    show_footer:false
  },
  onLoad() {
    my.showLoading({
      content:'加载中...'
    })
    let that = this
    myAjax.post(getApiUrl('/coupon/list'),{
      uuid:app.globalData.uuid,
      sign:app.globalData.sign,
      status:0,
      begin:0
    },function(res){
      my.hideLoading();
      that.setData({
        show_footer:true
      })
      if(res.status === 0){
        if(res.data.length === 0){
          that.setData({
            isEmpty:true
          })
        }else{
          that.setData({
            list:res.data.map(item=>{
              item.des = item.des.split('/')
              return item
            })
          })
          console.log(that.list)
        }
        console.log(res)
      }
    })
  },
});
