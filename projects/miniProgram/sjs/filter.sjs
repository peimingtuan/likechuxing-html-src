var filter = {
    numTofixed:function(str) {
        if(parseFloat(str)) {
            return  parseFloat(str).toFixed(2)
        }else{
            return '0.00'
        } 
    },
    timestampToDate:function(s) {
        var timestamp = parseInt(s);
        var oDate = null;
        if(typeof(timestamp)!=='number'){
            oDate = getDate();
        }else{
            oDate = getDate(timestamp*1000);
        }

        var year = oDate.getFullYear();
        var month = this.switchNum(oDate.getMonth()+1);
        var date = this.switchNum(oDate.getDate());
        var hour = this.switchNum(oDate.getHours());
        var minute = this.switchNum(oDate.getMinutes());
        var second = this.switchNum(oDate.getSeconds());
        return {
            date:year+'-'+month+" - "+date,
            time:year+'-'+month+"-"+date+" "+hour+":"+minute+":"+second
        }
    },
    secondToHour:function(s) {
        var hour = parseInt(s/3600);
        var minute = parseInt(s/60);
        return {
            minute,
            hour,
            ms:this.switchNum(hour)+':'+this.switchNum(minute)
        }
    },
    switchNum:function(num) {
        return num < 10 ? '0' + num : num
    },
    switchClass(status){
        let num = parseInt(status);
        switch(num){
            case 100:
                return 'cancel';
                break;
            case 101:
                return 'cancel';
                break;
            case 102:
                return 'finish';
                break;
            case 103:
                return 'cancel';
                break;
            default:
                return ''
        }
    }
}
export default filter