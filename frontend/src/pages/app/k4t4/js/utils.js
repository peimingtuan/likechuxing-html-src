class Utils{
    initPickerData() {
        const oDate = new Date();
        oDate.setDate(oDate.getDate()+1)
        let data = [
            {
                flex:1,
                className: 'slot2',
                textAlign:'center',
                values:['10:00','9:00','8:00','7:00','6:00','5:00'],
                defaultIndex:2
            },
            {
                flex:1,
                className: 'slot3',
                textAlign:'center',
                values:['上午']
            }
        ]
        let m = oDate.getMonth()+1
        let d = oDate.getDate()
        let curDate = m+'月'+d+'日';
        let arr = [];
        let obj = {};
        arr.push(curDate)
        obj.values = arr
        obj.flex =1;
        obj.textAlign = 'center'
        obj.className= 'slot1'
        data.unshift(obj)
        return data;
    }
    initTimeStamp(str){
        const oDate = new Date()
        let y = oDate.getFullYear()
        let m = oDate.getMonth()
        let d = oDate.getDate()+1
        let h = parseInt(str.split(':')[0])
        const iDate = new Date(y,m,d,h,0,0)
        return parseInt(Date.parse(iDate)/1000);
    }
    removeCarCnt(options,isType){
        let arr = options.slice();
        for(let i=0;i<arr.length;i++){
            arr[i].car_cnt = 1
        }
        if(isType){
            for(let i=0;i<arr.length;i++){
                if(parseInt(arr[i].biz_type)===1){
                    console.log(arr[i].address)
                    arr.splice(i,1)
                }
            }
        }
        return arr
    }
}
export default new Utils()