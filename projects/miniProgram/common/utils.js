class Utils{
    formatTime(data) {//秒转分钟小时
        let second = parseInt(data);
        let hour = parseInt(second/3600);
        let minute = parseInt((second%3600)/60);
        let res = {
            hour:hour,
            minute:minute
        }
        return res;      
    }
    toTime(timestamp) {
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate()<10 ? '0'+date.getDate():date.getDate()) + ' ';
        let h = (date.getHours()<10 ? '0'+date.getHours():date.getHours()) + ':';
        let m = (date.getMinutes()<10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        let s = (date.getSeconds()<10 ? '0'+date.getSeconds():date.getSeconds());
        return Y+M+D+h+m+s;
    }
    toHourMinute(timestamp) {
        let date = new Date(timestamp * 1000);
        let h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
        let m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()) ;
        return h+m;
    }
    switchNum(data) {
        return parseFloat(data).toFixed(2);
    }
    trimStr(str) {
        return str.replace(/\s+/g,""); 
    }
    toDate(timestamp) {
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        let D = (date.getDate()<10 ? '0'+date.getDate():date.getDate());
        return Y+M+D;
    }
}
export default new Utils();