class Tool {
    debounce(fn){
        let args = arguments[1]
        fn.tId && clearTimeout(fn.tId)
        fn.tId = setTimeout(()=>{
            fn(args)
        },700)
    }
    getCheckedItem(arr){
        let res = {}
        arr.map(item=>{
            if(item.checked){
                Object.assign(res,item)
            }
        })
        return res
    }
    initLegendData(arr){
        if(!arr.length){
            return []
        }
        arr.map((item,index)=>{
            if(index!=0){
                item.checked = false
            }
        })
        return arr
    }
    sortArrById(arr,key){
        if(!arr.length){
			return []
		}
		return arr.sort((m,n)=>{
			return m[key] - n[key]
		})
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
        console.log(arr)
        return arr
    }
    filterChartData(list,date){
        if(!list.length){
			return []
        }
        if(!date.length){
			return []
        }
        let dateSource = date.map(item=>{
            item = item.substring(5,7)+item.substring(8,10)
            return item
        })
        let res = []
        list.map(item=>{
            for(let i = 0;i<30;i++){
                let resItem = {}
                resItem.type = item.type;
                resItem.date = dateSource[i]
                resItem.value = parseFloat(item.value[i])
                res.push(resItem)
            } 
        })
        return res
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
    filterData(list,date){
        if(!list.length){
			return []
        }
        if(!date.length){
			return []
        }
        let dateSource = date.map(item=>{
            item = item.substring(5,7)+item.substring(8,10)
            return item
        })
        let labelList = list.map(item=>{
            if(item.type.indexOf('里程')!=-1){
                item = item.type+'(km)'
            }else if(item.type.indexOf('时长')!=-1){
                item = item.type+'(h)'
            }else{
                item = item.type
            } 
            return item
        })
        list.map(item=>{
            item.value.reverse()
        })
        let resData = {}
        resData.date = dateSource.reverse()
        resData.labelList = labelList
        resData.data = list
        let day = []
        resData.date.map(item=>{
            day.push(this.getDay(item))
        })
        resData.day = day
        return resData
    }
}
export default new Tool()