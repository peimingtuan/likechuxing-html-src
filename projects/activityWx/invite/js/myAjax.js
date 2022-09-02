import getApiUrl from './getApiUrl.js'
import getVerification from './getVerification.js'

class Ajax {
  constructor() {
    this.time_offset = null
    this.server_time = 0
    this.list = []

    wx.request({
      url:getApiUrl('/time/get'),
      success:function (res) {
        res = res.data
        let now = Math.floor(new Date().getTime() / 1000)
        this.server_time = res.data.timestamp
        this.time_offset = res.data.timestamp - now
        this.list.forEach(item => {
          this.postNow(...item)
        })
        this.list.length = 0
      }.bind(this)
    })
  }

  post(url, data, cb) {
    if (this.time_offset === null) {
      this.list.push([url, data, cb])
    } else {
      this.postNow(url, data, cb)
    }
  }

  getFullData(_data){
    let data = Object.assign({}, _data)
    if (data.hasOwnProperty('user_channel')) {
      data.channel = data.user_channel || ''
      delete data.user_channel
    }
    //data.source = 1
    data.user_version = 'h5_2100'
    data.client_time = Math.floor(new Date().getTime() / 1000) + (this.time_offset || 0)
    data.verification = getVerification(data)
    return data
  }

  postNow(url, _data, cb) {
    wx.request({
      url:url,
      method:'POST',
      data:this.getFullData(_data),
      header:{
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success:function(res){
        if(res.data.status === 6001){
          wx.reLaunch({
            url:'/pages/activity/present'
          })
          wx.showToast({
            title:'登录信息已过期',
            icon:'none'
          })
        }else{
          cb(res.data)
        }
      }.bind(this)
    })
  }
}

export default new Ajax()