import getApiUrl from './getApiUrl.js'
import getVerification from './getVerification.js'

class Ajax {
  constructor() {
    this.time_offset = null
    this.server_time = 0
    this.list = []

    my.httpRequest({
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
    data.activity_id = 3
    data.user_version = 'h5_2108'
    data.client_time = Math.floor(new Date().getTime() / 1000) + (this.time_offset || 0)
    data.verification = getVerification(data)
    return data
  }

  postNow(url, _data, cb) {
    my.httpRequest({
      url:url,
      method:'POST',
      data:this.getFullData(_data),
      header:{
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success:function(res){
        if(res.data.status === 6001){
          my.reLaunch({
            url:'/pages/index/index'
          })
          my.showToast({
            content:'登录信息已过期'
          })
        }else{
          cb(res.data)
        }
      }.bind(this)
    })
  }
}

export default new Ajax()