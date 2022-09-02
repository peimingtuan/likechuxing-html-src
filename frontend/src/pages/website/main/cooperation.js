/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: cooperation
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/3/19-下午2:33
 Description:
 Param:
 Return:
 *************************************************/
require('./js/common')
require('./css/cooperation.less')
import autoBannerHeight from './js/autoBannerHeight'
import areaData from './js/data/china-area-code.json'
import $ from 'jquery'
import Regular from '../../../js/Regular'
import animateCss from '../../../css/animates/animateCss'
import getUrl from './js/getUrl'
import Loading from '../../../component/loading'

autoBannerHeight()
bindActions()

function bindActions() {
  // 公司名称
  $('#company_name').on('blur', function () {
    errBox(this, this.value === '' ? '您的公司名称输入有误' : '')
  })

  // 省
  $('.province').append(getAreaList('86').map(item => '<option value="' + item.key + '">' + item.name + '</option>').join('')).on('change', function () {
    let code = $(this).val()
    if (code === '0') {
      errBox(this, '您的所在地选择有误')
    } else {
      errBox(this)
      let list = getAreaList(code)
      let city = $('.city').empty()
      errBox(city[0])
      if (list.length <= 1 || code === '86') {
        city.addClass('disabled').empty().append('<option value="0">选择城市</option>' )
      } else {
        city.removeClass('disabled').empty().append('<option value="0">选择城市</option>' + list.map(item => '<option value="' + item.key + '">' + item.name + '</option>').join(''))
      }
    }
  })

  // 市
  $('.city').on('change', function () {
    if (this.options.length > 1 && this.value === '0') {
      errBox(this, '城市选择有误')
    } else {
      errBox(this)
    }
  })

  // 公司地址
  $('#address').on('blur', function () {
    errBox(this, this.value === '' ? '您的详细地址输入有误' : '')
  })

  // 姓名
  $('#name').on('blur', function () {
    errBox(this, this.value === '' ? '您的姓名输入有误' : '')
  })

  // 电话
  $('#phone').on('blur', function () {
    errBox(this, !(Regular.phone.test(this.value) || Regular.tel.test(this.value)) ? '您的电话输入有误' : '')
  })

  // 职位
  $('#position').on('blur', function () {
    errBox(this, this.value === '' ? '您的职位输入有误' : '')
  })

  // 方式
  $('.coopWays').on('click', function (e) {
    if ($(e.target).hasClass('coopWay')) {
      let checked = $(e.target).attr('data-checked')

      errBox($('.coopWays')[0], checked === '1' ? '请至少选择一项合作方向以便我们派专人联系您' : '')
      if(checked === '0'){
        $('.coopWay').attr('data-checked','0')
      }
      $(e.target).attr('data-checked', checked === '1' ? '0' : '1')
    }
    check()
  })

  $('.cooperation input').on('input', check)
  $('.cooperation select').on('change', check)

  $('#submit').on('click', function () {
    if ($(this).hasClass('disabled')) {
      return
    }

    let data = {}
    data.company_name = $('#company_name').val()
    let city = $('.city option:checked').val()
    let city_str = $('.city option:checked').text()
    if(city_str==='选择城市')city_str='';
    let pro = $('.province option:checked').val()
    let pro_str = $('.province option:checked').text()
    if(pro_str==='选择省份')pro_str=''
    data.city_code = /\d{6}/.test(city) ? city : pro
    data.city_string = pro_str+','+city_str
    data.address = $('#address').val()
    data.name = $('#name').val()
    data.phone = $('#phone').val()
    data.position = $('#position').val()
    let coopWay = []
    $('.coopWay').each((index, item) => {
      if ($(item).attr('data-checked') === '1') {
        coopWay.push($(item).attr('data-value'))
      }
    })
    data.cooperation = coopWay.join('^')

    let loading = new Loading()
    $.post(getUrl('/index/cooperation'), data, function(){
      loading.destroy()
      $('.infoWindow').show()
    })

  })

  $('#closeInfoWindow').on('click', function () {
    animateCss.once($('.infoWindow .mask')[0], 'fadeOut')
    animateCss.once($('.infoWindow .box')[0], 'zoomOut', function () {
      $('.infoWindow').hide()

      $('#company_name').val('')
      $('.city').addClass('disabled').empty().append('<option value="0">选择城市</option>' )
      $('.province').val('0')
      $('#address').val('')
      $('#name').val('')
      $('#phone').val('')
      $('#position').val('')
      $('.coopWay').each(function(index,item){
        $($(item).attr('data-checked', '0'))
      })
      check()
    })
  })
}

function check() {
  let illegal = 0
  // 公司名称
  let company_name = $('#company_name').val()
  if (company_name === '') {
    illegal++
  }

  // 省
  let province = $('.province').val()
  if (province === '0') {
    illegal++
  }

  // 公司地址
  let address = $('#address').val()
  if (address === '') {
    illegal++
  }

  // 姓名
  let name = $('#name').val()
  if (name === '') {
    illegal++
  }

  // 电话
  let phone = $('#phone').val()
  if (!(Regular.phone.test(phone) || Regular.tel.test(phone))) {
    illegal++
  }

  // 职位
  let position = $('#position').val()
  if (position === '') {
    illegal++
  }

  // 方式
  let coopWay = []
  $('.coopWay').each((index, item) => {
    if ($(item).attr('data-checked') === '1') {
      coopWay.push($(item).attr('data-value'))
    }
  })
  if (coopWay.length === 0) {
    illegal++
  }

  if (illegal === 0) {
    $('#submit').removeClass('disabled')
  } else {
    $('#submit').addClass('disabled')
  }
}

function errBox(el, msg) {
  let _msg = msg || ''
  $(el).parent().attr('data-err', _msg)
}

function getAreaList(key) {
  let _key = String(key)
  let _list = []
  let _data = areaData[_key]
  for (let k in _data) {
    _list.push({
      key: k,
      name: areaData[key][k]
    })
  }
  return _list
}