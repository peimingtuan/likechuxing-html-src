import onShareAppMessage from '../../common/shareAppMessage';
Page({
    onShareAppMessage,
    data:{
        longitude:0,
        latitude:0
    },
    onLoad() {
        my.getLocation({
          success:(res)=>{
              console.log(res)
            //   this.setData({
            //       longitude:res.longitude,
            //       latitude:res.latitude
            //   })
              my.openLocation({
                  longitude:116.298684,
                  latitude:40.044345,
                  name:'华夏科技大厦',
                  address:'西二旗地址'
              })
          }
        });
    }
})