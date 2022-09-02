import api from './api';
import getVerification from './getVerification';

class Ajax {
	constructor () {
		this.time_offset = null;
		this.list = [];

        //获取时间戳
        let self = this;
        my.httpRequest({
          url: api.apiGetTimeStamp(),
          method:'GET',
          success: (res) => {
            var now = Math.floor(new Date().getTime()/1000);
			self.time_offset = res.data.data.timestamp - now;
            self.list.forEach( item => {
				self.postNow(...item);
			})
			self.list.length = 0;
          },
        });
	}

	post (url, filePath,fileName,fileType, data, cb) {
		if (this.time_offset === null) {
			this.list.push([url, filePath,fileName,fileType, data, cb]);
		} else {
			this.postNow(url, filePath,fileName,fileType, data, cb);
		}
	}

	postNow (url, filePath,fileName,fileType, _data, cb) {
		let data = Object.assign({}, _data)
		if (data.hasOwnProperty('user_channel')){
			data.channel = data.user_channel || '';
			delete data.user_channel;
		}
		data.user_version = 'alixcx_2109';
		data.client_time = Math.floor(new Date().getTime()/1000) + (this.time_offset || 0);
		data.verification = getVerification(data);
        my.uploadFile({
          url: url,
          filePath:filePath,
          fileName:fileName,
          fileType:fileType,
          formData:data,
          success: (res) => {
			  console.log(res)
				let json = JSON.parse(res.data)
			    if(json.status == 6001) {
					my.reLaunch({
						url: '/page/reLogin/reLogin'
					});
					return
				}
            cb(JSON.parse(res.data));
          },
          fail:(err)=>{
              console.log(err)
          }
        });
	}
}

function encodeFormData (data) {
	if (!data) return ''
	var pairs = []
	for (var name in data) {
		if (!data.hasOwnProperty(name)) continue
		if (typeof data[name] === 'function') continue
		if (data[name] === null || data[name] === undefined){
			data[name] = ''
		}
		var value = data[name].toString();
		name = encodeURIComponent(name.replace(' ', '+'))
		value = encodeURIComponent(value.replace(' ', '+'));
		pairs.push(name + '=' + value);
	}
	return pairs.join('&');
}

export default new Ajax()