class Tool {
    initDatePickerData(server_time){
        let endTime = parseInt((1546185600 - new Date(server_time).getTime()/1000)/86400);       
        let arr = []
        for(let i = 3;i < endTime + 3;i++){
            let res = {}
            res.id = this.getDesignatedDay(i,server_time).time
            res.name = this.getDesignatedDay(i,server_time).des
            arr.push(res)
        }
        return arr
    }
    getDesignatedDay(AddDayCount,server_time){
        let count = AddDayCount || 0
        var dd = new Date(server_time); 
        dd.setDate(dd.getDate()+count);
        var y = dd.getFullYear();   
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
        var x = this.switchDay(dd.getDay())
        return {
            time:y+"/"+m+"/"+d,
            des:m+'月'+d+'日 '+x
        }
    }
    switchDay(x){
        switch(x){
            case 0:
                return '周日';
            case 1:
                return '周一';
            case 2:
                return '周二';
            case 3:
                return '周三';
            case 4:
                return '周四';
            case 5:
                return '周五';
            case 6:
                return '周六';
        }
    }
    getEndTime(str){
        var dd = new Date(str);  
        dd.setDate(dd.getDate()+30);
        var y = dd.getFullYear();   
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
        return y+"/"+m+"/"+d;
    }
    timeToTimestamp(time){
        var date = new Date(time)
        return date.getTime() / 1000
    }
    timestampToTime(timestamp,time){
        var dd = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var y = dd.getFullYear();   
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
        var x = this.switchDay(dd.getDay())
        return {
            time:y+"/"+m+"/"+d,
            des: m+'月'+d+'日'+x + " "+ time
        }
    }
    timestampToTime2(timestamp){
        var dd = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var y = dd.getFullYear();   
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
        return y+"/"+m+"/"+d
    }
    getHour(){
        let arr = []
        for(let i = 10;i < 19;i++){
            let res = {}
            res.id = i
            res.name = i+":00"
            arr.push(res)
        }
        return arr
    }
    getMonthDay(timestamp){
        var dd = new Date(timestamp * 1000);
        var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
        var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();
        return m+"月"+d+"日"
    }

    getAllDate(time){        
        let date = this.getToday(time) 
        switch (new Date(time*1000).getDay()) {
            case 1: date -=86400  ; break;
            case 2: date -=86400 *2  ; break;
            case 3: date -=86400 *3  ; break;
            case 4: date -=86400 *4  ; break;
            case 5: date -=86400 *5  ; break;
            case 6: date -=86400 *6  ; break;
            default:
                return date
        }
        return date
    }
    getToday(time){        
        return new Date(new Date(time * 1000).toDateString()).getTime()/1000 
    }
}
export default new Tool()