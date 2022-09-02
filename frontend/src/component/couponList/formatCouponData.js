/**
 * Created by garvey on 2017/9/14.
 */
import format from '../../js/function/format'

export default function (data) {
	return {
		id: data.id,
		name: data.name,
		type:Number(data.type),
		typeDesc:getTypeDesc(data.type),
		typeCut:Number(data.type) === 1 ? '(满' + data.use_condition + '可用)' : '',
		value: getValue(data),
		moneyClass:Number(data.type) === 2 ? 'money2':'money',
		time: tryTime(data),
		des: data.des.split('/').map( item => '<li>' + item + '</li>').join(''),
		uselessDesc: uselessDesc(data.coupon_status),
		valid: getValid(data)
	}
}

function getValue(data){
	if(Number(data.type) === 2){
		return '免费'
	}else{
		return Math.floor(data.value)
	}
}

function getTypeDesc(type){
  let typeDesc = '优<br/>惠<br/>券';
  switch (Number(type)){
    case 1:
      typeDesc = '满<br/>减<br/>券'
      break;
    case 2:
      typeDesc = '免<br/>费<br/>券'
      break;
    default:
      typeDesc = '通<br/>用<br/>券';
  }
  return typeDesc
}

function tryTime (data) {
	let time = ''
	if (data.hasOwnProperty('time')) {
		time = data.time.replace('有效', ' 有效')
	}
	if (data.hasOwnProperty('begin_time') && data.hasOwnProperty('end_time')) {
		time = format.time(data.begin_time, 9) + ' - ' + format.time(data.end_time, 9) + ' 有效'
	}
	return time
}

function uselessDesc (status) {
	let des = [
		'',
		'已使用',
		'已过期'
	]
	return !!status ? des[status] : ''
}

function getValid (data) {
	let valid = ''
	if (data.hasOwnProperty('valid') && +data.valid === 0) {
		valid = 'disabled'
	}
	return valid
}