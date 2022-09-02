import Icon from './icon'
class Tools {
	toDate(timeStamp){
		if(timeStamp==''){
			return ''
		}
		var oDate = new Date(timeStamp);
		return oDate.getFullYear()+'-'+ this.toFixed2(oDate.getMonth()+1)+'-'+this.toFixed2(oDate.getDate())
	}
	toFixed2(num){
		return num<10?'0'+num:num+'';
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
	filterJson(data){
		for (let i in data){
			if(data[i]==''){
				delete data[i]
			}
		}
		return data;
	}
	mergeArr(arr1,arr2,distance){
		let num = distance || 1
		arr2.map((item,index)=>{
			arr1.splice(num*(index+1)+index,0,item)
		})
		return arr1
	}
	filterYData(data,type){
	
		if(data.length==0){
			return [
				{
					name:'',
					type:'line',
					data:[]
				}
			]
		}
		let des = '';
		if(type=='count'){
			des = '数量'
		}else{
			des = '占比'
		}
		const yData = [];
		for(const key in data){
			if(data.hasOwnProperty(key)){
				const yItem = {
					name:key+des,
					type:'line',
					showSymbol:false,
					lineStyle:{
						width:1.5
					}	
				} 
				let arr = []
				const item = data[key];
				for(let i = 0;i<item.length;i++){
					arr.push(item[i][type])
				}
				yItem.data = arr
				yData.push(yItem)
			}			
		}
		
		let res = yData.map(item=>{
			if(type=='count'){
				item.yAxisIndex = 0
			}else{
				item.yAxisIndex = 1
			}
			return item
		})
		
		return res;
	}
	filterChartData(data,type,topType){
		let des = ''
		if(type=='count'){
			des="数量"
		}else{
			des='占比'
		}
		let res = [];
		for(const key in data){ 
			if (data.hasOwnProperty(key)) {
				const item = data[key]
				for(let i = 0;i<item.length;i++){
		
					item[i].type = key+des
					item[i].count = parseFloat(item[i].count)
					item[i].percent = parseFloat(item[i].percent)
					if(topType=='day'){
						item[i].x = item[i].hour
					}else{
						item[i].x = item[i].date
					}
					if(type=='count'){
						delete item[i].percent
					}else{
						delete item[i].count
					}
					res.push(item[i])
				}
				
			}
		}
		return res
	}
	filterLegendData(data,oldSelected){
		let arr =  data.map((item,index)=>{
			let arrItem = {
				name:item.name
			}
			if(index==0){
				arrItem.icon = "image://"+Icon.icon1
			}else if(index==1){
				arrItem.icon = "image://"+Icon.icon2
			}else if(index==2){
				arrItem.icon = "image://"+Icon.icon3
			}else if(index==3){
				arrItem.icon = "image://"+Icon.icon4
			}else if(index==4){
				arrItem.icon = "image://"+Icon.icon5
			}else if(index==5){
				arrItem.icon = "image://"+Icon.icon6
			}else if(index==6){
				arrItem.icon = "image://"+Icon.icon7
			}else if(index==7){
				arrItem.icon = "image://"+Icon.icon8
			}
			return arrItem
		})
		for(let key in oldSelected){
			for(let i = 0;i<arr.length;i++){
				if(oldSelected[key]){
					if(arr[i].name==key){
						let str = 'icon'+(i+1)
						arr[i].icon = "image://"+Icon[str]
					}
				}else{
					if(arr[i].name==key){
						arr[i].icon = "image://"+Icon.icon0
					}
				}
			}
		}
		return arr
	}
	initDay(num){
		let iDate = new Date(this.toSetDay(num))
		let m = this.toFixed2(iDate.getMonth()+1)
		let d = this.toFixed2(iDate.getDate())
		return m+d
	}
	initDayRes(){
		return {
			item1:this.initDay(0),
			item2:this.initDay(-1),
			item3:this.initDay(-2),
			item4:this.initDay(-3)
		}
	}
	initDate(){
		let iDate = new Date()
		let y = iDate.getFullYear()
		let m = this.toFixed2(iDate.getMonth()+1)
		let d = this.toFixed2(iDate.getDate())
		return y+m+d
	}
    createDateData(){
        let arr = []
        for(let i = 0;i<30;i++){
            let iDate = new Date(this.toSetDay(-i))
            let m = this.toFixed2(iDate.getMonth()+1)
            let d = this.toFixed2(iDate.getDate())
            arr.push(m+d)
        }
		let data = [
			{
				values:arr
			}
		]
        return data
    }
    createHourData(){
        let arr = []
        for(let i = 0;i<24;i++){
            arr.push(i+'点')
        }
        let data = [
			{
				values:arr,
				defaultIndex:8
			}
		]
        return data
	}
	sortArrById(arr,key){
		if(!arr){
			return []
		}
		return arr.sort((m,n)=>{
			return m[key] - n[key]
		})
	}
	sortStatus(arr,key){
		if(!arr){
			return []
		}
		arr.sort((m,n)=>{
			return m[key] - n[key]
		})
		arr.map((item,index)=>{
            if(item.id==2){
                let res = arr.splice(index,1)
                arr.unshift(res[0])
            }
		})
		return arr
	}
	sortCity(arr,key){
        if(!arr.length){
			return []
		}
		arr.sort((m,n)=>{
			return m[key] - n[key]
        })
        arr.map((item,index)=>{
            if(item.id==197){
                let guangzhou = arr.splice(index,1)
                arr.unshift(guangzhou[0])
            }
        })
        return arr
    }
	addYear(str){
		let y = new Date(this.toSetDay(-1)).getFullYear()
		return y+str
	}
	filterXData(data,hour){
		let per = this.getHour(hour)
		if(Object.keys(data).length==0){
			return []
		}
		let arr = []
		if (data.hasOwnProperty(per)) {
			const item = data[per];
			for(let i = 0;i<item.length;i++){
				arr.push(item[i]['date'])
			}
		}
		return arr
	}
	getHour(str){
		let index = str.indexOf('点')
		return str.substring(0,index);
	}
	getNextDay(v,step){
		let y = new Date().getFullYear();
		let str = y+'/'+v.substring(0,2)+'/'+v.substring(2,4)
		let stepNum = step || 1
		const oDate = new Date(str);
		oDate.setDate(oDate.getDate()-stepNum)
		let m = this.toFixed2(oDate.getMonth()+1)
		let d = this.toFixed2(oDate.getDate())
		return m+d
	}
	getNextHour(v,step){
		let stepNum = step || 1
		let hour = v.substring(0,v.length-1)
		let num = parseInt(hour)+stepNum
		if(num>23){
			num = 0
		}
		return num+'点'
	}
	initSelect(arr){
		if(!arr.length){
			return {}
		}
		let obj = {}
		arr.map(item=>{
			let key = item.name.substr(-2)
			if(key==='占比'){
				obj[item.name] = false
			}
		})
		return obj
	}
	initDateData(){
        const dd = new Date()
        let y = dd.getFullYear()
        let m = this.switchNum(dd.getMonth() + 1)
        let d = this.switchNum(dd.getDate())
        let h = this.switchNum(dd.getHours())
        let mi = this.switchNum(dd.getMinutes())
        let s = this.switchNum(dd.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' +s
    }
    switchNum(num){
        return num<10 ? '0'+num : num
	}
	getDay(str){
		let res = ''
		let m = str.substring(0,2)
		let currentM  = new Date().getMonth() + 1
		let currentY  = new Date().getFullYear()

		if(currentM==m){
		res = currentY +'-'+ m +'-'+ str.substring(2)
		}else{
		if(currentM==1){
			res = currentY-1+'-'+ m +'-'+ str.substring(2)
		}else{
			res = currentY +'-'+ m +'-'+ str.substring(2)
		}
		}
		const dd = new Date(res)
		return dd.getDay()
	}
	filterTableData(data,type){
		if(data.length==0){
			return {
				titleLabel:[],
                day:[],
                res:{
                    count1:[],
                    count2:[],
                    count3:[],
                    count4:[],
                    percent1:[],
                    percent2:[],
                    percent3:[],
                    percent4:[]
                }
			}
		}
		let leftLabel = []
		let day = []
		let titleLabel = Object.keys(data)
		let res = {}
		data[titleLabel[0]].map(item=>{
			leftLabel.push(item[type])
			if(type=='date'){
				day.push(this.getDay(item[type]))
			}
		})
		titleLabel.map((item,index)=>{
			let dataArray  = data[item]
			let num = index + 1
			res['count'+num] = []
			res['percent'+num] = []
			dataArray.map(i=>{
				res['count'+num].push(i.count)
				res['percent'+num].push(i.percent)
			})
		})
		return {
			leftLabel,
			titleLabel,
			res,
			day
		}
	}
	cloneObj(obj){
		return JSON.parse(JSON.stringify(obj)); 
	}
}
export default new Tools()