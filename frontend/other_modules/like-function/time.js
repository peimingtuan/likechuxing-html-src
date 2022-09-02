/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: time
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018/11/19-2:19 PM
 * Description:
 *
 *************************************************/

const time = {

  /**
   * @param {string} date 可以通过Date.parse()的字符串
   * @return {number} 时间戳 秒
   **/
  getTimestamp:function (date) {

    if(date){

      let  millisecond = Date.parse(date)

      if(millisecond !== 0 && !millisecond)throw new Error('date string is not a legal date format')

      return Math.floor(new Date(millisecond).getTime() / 1000)

    }else{

      return Math.floor(new Date().getTime() / 1000)

    }
  },

  /**
   * @param {string/number} second 需要计算的秒数
   * @return {string} 可读的时间段字符串
   **/
  duration:function(second){

    if(second === undefined)throw new Error('param second is required')

    let str = ''

    if(second >= 86400){
      let day = Math.floor(second/86400)
      second = second%86400
      str+=day + ' 天 '
    }

    if(second >= 3600){
      let hour = Math.floor(second/3600)
      second = second%3600
      str+=hour + ' 小时 '
    }

    if(second >= 60){
      let minute = Math.floor(second/60)
      str+=minute + ' 分钟'
    }

    // 不足1分钟的按1分钟显示
    if(str === '')str+='1 分钟'

    return str
  },

  /**
   * @param {string} format 时间格式，如"YYYY-MM-DD"
   * @param {string/date} _time 可以被new Date()解析的时间格式
   * @return {string} 格式化好的时间字符串
   **/
  formatTime(format = "YYYY-MM-DD HH:mm:ss",_time) {

    let time = null
    if(_time && !_time instanceof Date) {
      let millisecond = Date.parse(_time)
      if (!millisecond && millisecond !== 0) throw new Error('formatTime expect a Date')
      time = new Date(_time)
    }else{
      time = new Date()
    }

    return format.replace(/(Y{4}|YY|[MDHWhms]{1,2}|[Aac])/g, function (matchString) {
      switch (matchString) {
        case 'YYYY':
          return time.getFullYear()
        case 'YY':
          return String(time.getFullYear()).substr(2, 2)
        case 'MM':
          let month = time.getMonth() + 1
          return month < 10 ? '0' + month : month
        case 'M':
          return time.getMonth() + 1
        case 'DD':
          let date = time.getDate()
          return date < 10 ? '0' + date : date
        case 'D':
          return time.getDate()
        case 'HH':
          let hours = time.getHours()
          return hours < 10 ? '0' + hours : hours
        case 'H':
          return time.getHours()
        case 'hh':
          let hours_12 = time.getHours()
          if (hours_12 > 12) hours_12 = hours_12 - 12
          return hours_12 < 10 ? '0' + hours_12 : hours_12
        case 'h':
          let hours_02 = time.getHours()
          return hours_02 > 12 ? hours_02 - 12 : hours_02
        case 'mm':
          let minute = time.getMinutes()
          return minute < 10 ? '0' + minute : minute
        case 'm':
          return time.getMinutes()
        case 'ss':
          let second = time.getSeconds()
          return second < 10 ? '0' + second : second
        case 's':
          return time.getSeconds()
        case 'A':
          return time.getHours() > 12 ? 'PM' : 'AM'
        case 'a':
          return time.getHours() > 12 ? 'pm' : 'am'
        case 'c':
          return time.getHours() > 12 ? '下午' : '上午'
        case 'W':
          return ['日', '一', '二', '三', '四', '五', '六'][time.getDay()]
      }
    })
  }

}

export {
  time
}