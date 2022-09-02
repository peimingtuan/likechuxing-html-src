class Tool {
    debounce(fn){
        let args = arguments[1]
        fn.tId && clearTimeout(fn.tId)
        fn.tId = setTimeout(()=>{
            fn(args)
        },700)
    }
    timestampToDate(timestamp){
        let dd = new Date(timestamp)
        let y = dd.getFullYear()
        let m = this.addStr(dd.getMonth() + 1)
        let d = this.addStr(dd.getDate())
        return y + '-' + m + '-' + d
    }
    addStr(n){
        return n < 10 ? '0'+n : n
    }
    toSetDay(AddDayCount){
		var  dd = new Date();
		dd.setDate(dd.getDate()+AddDayCount)
		return dd;
    }
    initDate(v){
		let iDate = v||new Date()
		let y = iDate.getFullYear()
		let m = this.toFixed2(iDate.getMonth()+1)
		let d = this.toFixed2(iDate.getDate())
		return y + '-'+ m +'-' + d
    }
    toFixed2(num){
		return num<10?'0'+num:num+'';
	}
    checkPhone(phone){
        if(!(/^1[34578]\d{9}$/.test(phone))){
            return false
        }else{
            return true
        }
    }
    checkPhones(phonesStr){
        let arr = phonesStr.split('、')
        for(let i = 0 ;i < arr.length;i++){
            if(!this.checkPhone(arr[i])){
                return false
            }
        }
        return true
    }
    checkCarNum(str){
        return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str)
    }
    checkCarNums(carNum){
        let arr = carNum.split('、')
        for(let i = 0 ;i < arr.length;i++){
            if(!this.checkCarNum(arr[i])){
                return false
            }
        }
        return true
    }
    initImg(arr){
        let res = []
        if(arr.length==0){
            return res
        }
        arr.map((item,index)=>{
            let arrItem = {}
            arrItem.id = 'item'+index
            arrItem.url = item
            res.push(arrItem)
        })
        return res
    }
}
export default new Tool()