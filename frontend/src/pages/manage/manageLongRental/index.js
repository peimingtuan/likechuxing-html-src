
/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/1/26-下午3:17
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.less')
import $ from 'jquery'
import toast from '../../../component/toast'
import getApiUrl from './js/getApiUrl'
import Loading from '../../../component/loading'
import Time from '../../../js/function/Time'

import getUuid from '../../../component/manageApp_getUuidFromLocal'

require('../../../js/polyfills')
require('../../../component/rem')

const all_city = [
  [197, '广州市'],
  [202, '佛山市'],
  [214, '中山市'],
  [213, '东莞市'],
  [74, '南京市'],
  [169, '武汉市'],
  [183, '长沙市'],
  [235, '成都市']
]
const duration = (function getTimes () {
  let today = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
  let start = today - 86400 * 2
  let end = today + 86400 * 2
  return [start, end]
})()
console.log(duration)
let data = [
  ['', 'k2', 'ga5', 'ev', '捷达', '桑塔纳', '富康', '金杯'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1'],
  ['西二旗三区网点', '3', '4', '2', '4', '6', '0', '1']
]

let login = getUuid()
init()

function init () {
  let select_city = $('#city')
  all_city.forEach(item => {
    select_city.append('<option value="' + item[0] + '">' + item[1] + '</option>')
  })
  if (all_city.indexOf(Number(login.city_id)) > -1) {
    select_city.val(login.city_id)
  }

  let select_date = $('#date')
  let date = ['前天', '昨天', '今天', '明天', '后天']
  let index = 0
  for (let i = duration[0]; i <= duration[1]; i += 86400) {
    select_date.append('<option value="' + i + '">' + date[index] + new Time(i).getTime('M月D日') + '</option>')
    index++
  }
  let tomorrow = new Date(new Date().toDateString()).getTime() / 1000 + 86400
  if (tomorrow >= duration[0] && tomorrow <= duration[1]) {
    select_date.val(tomorrow)
  }

  select_date.on('change', getData)
  select_city.on('change', getData)

  getData()
}

function getData () {

  let loading = new Loading()
  post(getApiUrl('/rental/long-rental-model'), {
    uuid: login.uuid,
    sign: login.sign,
    city_id: $('#city').val(),
    s_time: $('#date').val()
  }, function (res) {
    loading.destroy()
    loadTable(res.data)
  })
}

function loadTable (data) {
  if (data.length === 0) {
    toast('数据为空')
    $('.list').empty()
    return
  }
  let title = data.shift()
  title.shift()
  let total = []
  $('.list').html(data.map(item => {
    title.forEach((model, index) => {
      total[index] = total[index] ? total[index] + Number(item[index + 1]) : Number(item[index + 1])
    })
    let str = ''
    let name = item.shift()
    str += '<li class="item"><div class="name fs15">' + name + '</div><div class="cars fs13">'
    str += item.map((num, index) => {
      if (num > 0) {
        return '<span class="model">' + title[index] + ':' + num + '</span>'
      } else {
        return ''
      }
    }).join('')
    str += '</div></li>'
    return str
  }).join('')).prepend('<li class="item"><div class="name fs15">当前城市总计</div><div class="cars fs13">' + title.map((model, index) => '<span class="model">' + model + ':' + total[index] + '</span>').join('') + '</div></li>',)
  console.log(total)
}

function post (url, data, cb) {
  $.post(url, data, function (res) {
    if (res.status === 0) {
      cb(res)
    } else {
      toast(res.msg)
    }
  })
}



