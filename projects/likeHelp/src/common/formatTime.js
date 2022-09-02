/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: formatTime
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/22-下午2:33
 Description:
 Param:
 Return:
 *************************************************/
const formatTime =  function (s, type) {
  /*
   s:timestamp,second;
   type:
   0:2016-07-08 09:40:52  Default
   1:2016-7-8 9:40:42;
   2:2016年7月8日 09:40
   3:2016年7月8日 星期三 09:23
   4:09-16 09:17
   5:1月21日
   6:2016/07/08
   7:2017-01-01
   8:2017-01-01 12:09
   9:2017.01.02
   */
  let time = new Date(Number(s) * 1000);
  let string = "";
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  let hour = time.getHours();
  let min = time.getMinutes();
  let sec = time.getSeconds();
  let week = time.getDay();
  switch (Number(type)) {
    case 0:
      string = year + "-" + month + "-" + date + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec);
      break;
    case 1:
      string = year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
      break;
    case 2:
      string = year + "年" + month + "月" + date + "日 " + addZero(hour) + ":" + addZero(min);
      break;
    case 3:
      let week_list = ["日", "一", "二", "三", "四", "五", "六"];
      string = year + "年" + month + "月" + date + "日 星期" + week_list[week] + " " + addZero(hour) + ":" + addZero(min);
      break;
    case 4:
      string = addZero(month) + "-" + addZero(date) + " " + addZero(hour) + ":" + addZero(min);
      break;
    case 5:
      string = month + "月" + date + "日";
      break;
    case 6:
      string = year + "/" + addZero(month) + "/" + addZero(date);
      break;
    case 7:
      string = year + "-" + addZero(month) + "-" + addZero(date);
      break;
    case 8:
      string = year + "-" + addZero(month) + "-" + addZero(date) + " " + addZero(hour) + ":" + addZero(min);
      break;
    case 9:
      string = year + "." + addZero(month) + "." + addZero(date);
      break;
    default:
      string = year + "-" + month + "-" + date + " " + addZero(hour) + ":" + addZero(min) + ":" + addZero(sec);
  }
  return string;

  function addZero(num) {
    return num >= 10 ? num : "0" + num;
  }
}

const during = function(s){
  let d = Math.floor(s/86400)
  let h = Math.floor(s%86400/3600)
  let m = Math.floor(s%3600/60)
  let sec = Math.floor(s%60)
  let str = ' '
  d>0 && (str+=d+' 天 ');
  h>0 && (str+=h+' 小时 ');
  m>0 && (str+=m+' 分钟 ');
  str+=sec+' 秒'
  return str
}

export {
  formatTime,
  during
}
