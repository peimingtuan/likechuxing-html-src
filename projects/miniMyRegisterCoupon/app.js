import myAjax from './common/myAjax'
import getApiUrl from './common/getApiUrl'

App({
  globalData:{
    open_id:'',
    auth_token:'',
    uuid:'1502274754196764',
    sign:'SFNEXBJDNFV5RJV62FDJT46XQZ8DVDXV',
    lat:'',
    lng:'',
    city_id:0,
    city_name:'',
    channel:8928
  },
  onLaunch(options) {
    if(options.query && options.query.channel){
      this.globalData.channel = options.query.channel
    }
  },
  getLocation(cb){
      my.getLocation({
        type: 1,
        success: (res) => {
          this.globalData.lng = res.longitude;
          this.globalData.lat = res.latitude;
          this.globalData.city_name = res.city;

          if(this.globalData.city_id===0){
            this.getCityId(cb)
          }else{
            cb()
          }
        },
        fail: (err) => {
          let errCode = err.error
          switch (errCode) {
            case 2001:
            my.confirm({
              content:'需要获取您的位置来参与活动',
              success: (res) => {
                this.getLocation(cb)
              },
            });
            break;
            case 2002:
            my.showToast({
              content:'请检查网络'
            });
            break;
            case 2003:
            my.showToast({
              content:'定位失败，请稍后重试'
            });
            break;
          }
        }
      })
  },
  getCityId(cb){
    let that = this
    myAjax.post(getApiUrl('/describe/get-cityid'),{
      user_lat: this.globalData.lat,
      user_lng: this.globalData.lng,
      city_name:this.globalData.city_name
    },function(res){
      if(res.status === 0){
        that.globalData.city_id = res.data.city_id
        cb()
      }
    })
  },
  getOpenId(){
    let that = this
    my.getAuthCode({
      scopes:'auth_base',
      success:function(res){
        myAjax.post(getApiUrl('/alipay-login/auth'),{
          auth_code:res.authCode,
          type:2,
          auth_type:1
        },function(res){
          if(res.status === 0){
            that.globalData.open_id=res.data.bind_info.openid
            that.globalData.auth_token = res.data.bind_info.auth_token
            if(res.data.user_info){
              that.globalData.uuid = res.data.user_info.uuid,
              that.globalData.sign = res.data.user_info.sign
            }
          }
        })
      }
    })
  }
});
