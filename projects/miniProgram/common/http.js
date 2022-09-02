import api from './api';
import getVerification from './getVerification';
import filterList from './filterList';

let app = getApp()

class Http {
  constructor() {
    this.prevTime = 0;
    this.prevUrl = '';

    // 本地时间和服务器时间的偏移量 offset=server-local
    this.time_offset = 0;

    let _this = this;
    this.getting = new Promise((resolve, reject) => {
      my.httpRequest({
        url: api.apiGetTimeStamp(),
        method: 'GET',
        success: (res) => {
          if (res.status === 200) {
            let now = Math.floor(new Date().getTime() / 1000);
            _this.time_offset = res.data.data.timestamp - now;
            resolve()
          } else {
            reject(res.msg)
          }
        },
      });
    })
  }

  /*
  //获取时间差
  getTimeStamp() {

      let p1 = new Promise((resolve,reject)=>{

          my.httpRequest({
              url: api.apiGetTimeStamp(),
              method:'GET',
              success: (res) => {

                  if(res.status===200) {
                      let now = Math.floor(new Date().getTime()/1000);
                      let time_offset = res.data.data.timestamp - now;
                      resolve(time_offset)
                  }else{
                      reject(res.msg)
                  }
              },
          });
      })
      return p1;//返回获取时间戳的promise对象
  }
  */

  async post(params) {


    await this.getting

    let options = params || {};
    let url = options.url || '';
    let _data = options.data || {};
    let _this = this
    if (url == '') {
      console.log('请求url不能为空');
    }
    let p2 = new Promise((resolve, reject) => {

      //请求拦截
      let postTime = Math.floor(new Date().getTime() / 1000);
      let postUrl = url;

      if (this.prevTime != 0) {
        let postOffsetTime = postTime - this.prevTime;

        if (postOffsetTime < 2 && postUrl == this.prevUrl && filterList.list.indexOf(url) != -1) {
            console.log('3s内不能同时请求同一个接口两次')
            reject()
            return false;
        }
      }
      this.prevTime = postTime
      this.prevUrl = postUrl

      let data = Object.assign({}, _data)
      if (data.hasOwnProperty('user_channel')) {
        data.channel = data.user_channel || '';
        delete data.user_channel;
      }
      data.user_version = 'alixcx_2203';
      data.client_time = Math.floor(new Date().getTime() / 1000) + _this.time_offset;
      data.verification = getVerification(data);

      my.httpRequest({
        url: url,
        method: 'POST',
        data: encodeFormData(data),
        success: (res) => {
          if (res.data.status == 6001) {
            my.reLaunch({
              url: '/page/reLogin/reLogin'
            });
            return
          }
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
    return p2;//返回post的promise对象
  }
}

function encodeFormData(data) {
  if (!data) return ''
  var pairs = []
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue
    if (typeof data[name] === 'function') continue
    if (data[name] === null || data[name] === undefined) {
      data[name] = ''
    }
    var value = data[name].toString();
    name = encodeURIComponent(name.replace(' ', ''))
    value = encodeURIComponent(value.replace(' ', ''));
    pairs.push(name + '=' + value);
  }
  return pairs.join('&');
}

export default new Http()