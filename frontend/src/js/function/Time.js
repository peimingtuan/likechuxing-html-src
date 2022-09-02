/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: Time
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/14-上午11:32
 Description:
 Demo:
 Others:
 *************************************************/
const timeago = require('timeago.js')

export default class Time {
	constructor(second) {
		this.time = second === undefined ? new Date() : new Date(second * 1000)
        this.duration_local_dict = function(number, index, total_sec) {
            return [
                ['几秒钟', 'a while'],
                ['%s秒钟', 'in %s seconds'],
                ['1分钟', 'in 1 minute'],
                ['%s分钟', 'in %s minutes'],
                ['1小时', 'in 1 hour'],
                ['%s小时', 'in %s hours'],
                ['1天', 'in 1 day'],
                ['%s天', 'in %s days'],
                ['1周', 'in 1 week'],
                ['%s周', 'in %s weeks'],
                ['1个月', 'in 1 month'],
                ['%s个月', 'in %s months'],
                ['1年', 'in 1 year'],
                ['%s年', 'in %s years']
            ][index];
        };
		timeago.register('duration', this.duration_local_dict);
	}

	getTime(format) {
		return format.replace(/(Y{4}|YY|[MDHWhms]{1,2}|[Aac])/g, function () {
			switch (arguments[1]) {
				case 'YYYY':
					return this.time.getFullYear()
				case 'YY':
					return String(this.time.getFullYear()).substr(2, 2)
				case 'MM':
					let month = this.time.getMonth() + 1
					return month < 10 ? '0' + month : month
				case 'M':
					return this.time.getMonth() + 1
				case 'DD':
					let date = this.time.getDate()
					return date < 10 ? '0' + date : date
				case 'D':
					return this.time.getDate()
				case 'HH':
					let hours = this.time.getHours()
					return hours < 10 ? '0' + hours : hours
				case 'H':
					return this.time.getHours()
				case 'hh':
					let hours_12 = this.time.getHours()
					if (hours_12 > 12) {
						hours_12 = hours_12 - 12
					}
					return hours_12 < 10 ? '0' + hours_12 : hours_12
				case 'h':
					let hours_02 = this.time.getHours()
					return hours_02 > 12 ? hours_02 - 12 : hours_02
				case 'mm':
					let minute = this.time.getMinutes()
					return minute < 10 ? '0' + minute : minute
				case 'm':
					return this.time.getMinutes()
				case 'ss':
					let second = this.time.getSeconds()
					return second < 10 ? '0' + second : second
				case 's':
					return this.time.getSeconds()
				case 'A':
					return this.time.getHours() > 12 ? 'PM' : 'AM'
				case 'a':
					return this.time.getHours() > 12 ? 'pm' : 'an'
				case 'c':
					return this.time.getHours() > 12 ? '下午' : '上午'
				case 'W':
					return ['日','一','二','三','四','五','六'][this.time.getDay()]
			}
		}.bind(this))
	}

	fromNow(){
		return timeago().format(this.time, 'zh_CN')
	}

	duration(time){
		return timeago().format(new Date().getTime() - time*1000, 'duration')
	}

	duration2(time){
		let d = Math.floor(time/86400)
		let h = Math.floor(time%86400/3600)
		let m = Math.floor(time%3600/60)
		let str = ''
		if(d>0)
			str+=d+'天';
		if(h>0)
			str+=h+'小时';
		str+=m+'分钟';
		return str
	}
}