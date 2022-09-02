/**
 * Created by garvey on 2017/9/6.
 */
require('./css/style.less')
import Loading from '../../../../component/loading/index'
import toast from '../../../../component/toast/index'
import parseURL from '../../../../js/parseURL'
import myAjax from '../../../../component/myAjax/withJq'
import getApiUrl from '../../../../js/getApiUrl'
import formatCouponData from '../../../../component/couponList/formatCouponData'

let couponBox = require('../../../../component/couponList/couponBox.pug')
require('../../../../component/couponList/coupon.less')
import $ from 'jquery'
import AppMutual from '../../../../component/AppMutual/index'

const appMutual = new AppMutual()
require('../../../../js/polyfills')

let loading = new Loading()
let coupons = []
let query

checkUuid()

function checkUuid() {
  query = parseURL(window.location.href).query
  if (!query.hasOwnProperty('uuid') || !query.hasOwnProperty('sign')) {
    toast('抱歉，app开小差了')
    $('.empty').show()
    loading.destroy()
    return
  }

  getData(query)
}

function getData(query) {
  myAjax.post(getApiUrl('/rental/coupon-list'), query, function (result) {
    loading.destroy()
    if (result.status === 0) {
      if (result.data.coupons.length > 0) {
        if (result.data.is_reach_ceiling == 1) {
          $('.tips').show()
          result.data.coupons.forEach(item => {
            item.valid = 0
          })
        } else {
          $('.tips').text('优惠券每天限用3张').show()
        }
        loadTemplate(result.data.coupons)
      } else {
        $('.empty').show()
      }
    } else {
      toast(result.msg)
      $('.empty').show()
    }
  })
}

function loadTemplate(data) {
  let str = data.map(item => {
    coupons.push(item)
    return couponBox(formatCouponData(item))
  }).join('')
  $('.coupon_list').append(str).on('click', '.coupon_box', function () {
    if ($(this).hasClass('disabled')) {
      return
    }

    $('.coupon_box.active').removeClass('active')
    $(this).addClass('active')
    let coupon = coupons.find(cou => cou.id === $(this).attr('data-id'))

    sendCoupon(coupon.id, coupon.value)
    //sendCoupon(coupon.id, coupon.value.replace(/\.\d*$/, ''))
  })
  if (query.hasOwnProperty('select_coupon_id')) {
    $('.coupon_box[data-id="' + query.select_coupon_id + '"]').addClass('active')
  }
}

document.querySelector('.btn').addEventListener('click', function () {
  sendCoupon(0, 0)
})

function sendCoupon(id, value){
  let loading = new Loading()
  myAjax.post(getApiUrl('/rental/visit'), {
    uuid: query.uuid,
    sign: query.sign,
    coupon_id: id,
    coupon_value: value
  }, function(res){
    loading.destroy()
    appMutual.sendCoupon(id, value)
    if(res.status !== 0){
      toast(res.status)
    }
  })
}


