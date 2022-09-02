import { Toast } from 'mint-ui';

class Tools {
	toDate(timeStamp){
		if(timeStamp==''){
			return ''
		}
		var oDate = new Date(timeStamp);
		return oDate.getFullYear()+'-'+ this.toFixed2(oDate.getMonth()+1)+'-'+this.toFixed2(oDate.getDate())
	}
	toFixed2(num){
		return num<10?'0'+num:num;
	}
	compareTime(v1,v2){
		let n1 = Math.round(new Date(v1) / 1000);
		let n2 = Math.round(new Date(v2) / 1000);
		if(n1-n2>0){
			return true
		}else{
			return false
		}
	}
	toSetDay(AddDayCount){
		var  dd = new Date();
		dd.setDate(dd.getDate()+AddDayCount)
		return dd;
	}
	getUrlQuery(url){
		let
		res = {
			query: {}
		},
		reg = /([^?=&]+)=([^?=&]+)/g;

		url.split('#')[0].replace(reg, function () {
			res.query[arguments[1]] = arguments[2];
		})
		let index = url.indexOf('?');
		res.origin = index === -1 ? url : url.substr(0, index);
		return res;
	}

	getCookieQuery(){
		let query = {
			uuid:this.getCookie('uuid'),
			sign:this.getCookie('sign')
		}

		if(!query.uuid){
			Toast('未获取到登录信息')
		}

		return {
			query
    }
	}
  getCookie(cname)
  {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return decodeURIComponent(c.substring(name.length,c.length));
    }
    return "";
  }

	filterJson(data){
		for (let i in data){
			if(data.hasOwnProperty(i)){
				let element = data[i]
				if(element==''||element=='全部'){
					delete data[i]
				}
			}
		}
		return data;
	}
	fliterXData(arr){
		return arr.map(item=>{
			item = item.split('-')[1]+'-'+item.split('-')[2]
			return item
		})
	}
	filterYData(arr){
		if(!arr){
			return []
		}	
		return arr.map((item,index)=>{
			if(item.hasOwnProperty('type')){
				if(item.type=='line'){	
					item.symbol ='circle'
					item.symbolSize = 6
					item.yAxisIndex = 1
				}else{
					item.yAxisIndex = 0
				}
				
			}else{
				item.type = 'line'
				item.yAxisIndex = 0
				item.symbol ='circle'
				item.symbolSize = 6
			}
			item.clickable = true;
			item.label = {
				show:false
			}
			return item
		})
	}
	fliterFunnelData(arr){
		if(!arr){
			return []
		}
		let data = []
		arr.map((item)=>{
			data.push(item)
		})
		return data
	}
	initPreviewData(data){
		if(!data.data.xData){
			return {
				arr:[],
				label:[]
			}
		}
		let xData = this.fliterXData(data.data.xData);
		let yData = data.data.yData;
		let arr = []
		let label = []
		for(let i = 0;i<xData.length;i++){
			let item = {}
			let col = []
			item.label = xData[i]
			for(let j = 0;j<yData.length;j++){
				col.push(yData[j].data[i])
			} 
			item.col = col
			arr.push(item)
		}
		for(let i = 0;i<yData.length;i++){
			label.push(yData[i].name)
		}
		return {
			arr,
			label
		}
	}
}
export default new Tools()