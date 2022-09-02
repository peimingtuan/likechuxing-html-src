/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/2-下午3:18
 Description:
 Demo:
 Others:
 *************************************************/
require('./index.less')
require('../../../component/rem')
import format from '../../../js/function/format'
import getAppArguments from '../../../js/getAppArguments'
const costList_box = require('./template/costList.pug')
const balanceRules = require('./template/balanceRules.pug')
const iconExplain = require('./template/iconExplain.pug')
//require('../../../component/vconsole')

let appArguments = getAppArguments()

let html_str = ''
let costList = [
  {
    key:'parking_fee_out',
    text:(appArguments.app_version >= 2104 ? '预估停车费' : '代缴停车费')
  },
  {
    key:'parking_fee_in',
    text:'还车附加费'
  },
  {
    key:'balance_refund',
    text:'补偿余额'
  }
]

if(appArguments.parking_fee_out || appArguments.parking_fee_in || appArguments.balance_refund){
  costList.forEach(item => {
    if(appArguments[item.key]) item.value = format.money(appArguments[item.key]);
	})
	html_str += costList_box({data:costList})
}

html_str+=balanceRules(costList[0])
html_str+=iconExplain()

document.body.innerHTML = html_str + document.body.innerHTML


