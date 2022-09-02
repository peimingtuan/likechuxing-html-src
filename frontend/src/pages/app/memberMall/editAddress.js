/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: editAddress
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午6:05
 Description:
 Param:
 Return:
 *************************************************/
//require('../../../component/vconsole')
require('./css/editAddress.less')
require('./js/common')
import $ from 'jquery'
import Regular from '../../../js/Regular'
import '../../../../other_modules/polyfills/index'
import {Alert, Toast, Loading,Confirm} from '../../../../other_modules/vue-plugins/like-base/'
import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData();
import AreaSelect from './component/AreaSelect'

// autoTextarea
(function ($) {
  $.fn.autoTextarea = function (options) {
    var defaults = {
      maxHeight: null,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
      minHeight: $(this).height() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
    };
    var opts = $.extend({}, defaults, options);
    return $(this).each(function () {
      $(this).bind("paste cut keydown keyup focus blur", function () {
        var height, style = this.style;
        this.style.height = opts.minHeight + 'px';
        if (this.scrollHeight > opts.minHeight) {
          if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
            height = opts.maxHeight;
            style.overflowY = 'scroll';
          } else {
            height = this.scrollHeight;
            style.overflowY = 'hidden';
          }
          style.height = height + 'px';
        }
      });
    });
  };
})($);

let inputs = []
init()

function init() {
  $('body').height(window.innerHeight)

  $('.value').each(function (index, item) {
    inputs.push(item)
  })

  $("#address").autoTextarea({
    maxHeight: 220,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
  }).width($('.add_label').width() - 90)

  $('.box').on('input', function () {
    checkBtn()
  })

  $('.close').on('click', function () {
    $(this).parent().find('.value').val('')
    checkBtn()
  })

  let defaultData = false
  if(memberMallData.state.area){
    defaultData = memberMallData.state.area
    $('#area').text(defaultData)
  }
  $('.area').on('click', function(){
    new AreaSelect($('#area').text(), function(add){
      $('#area').text(add)
      checkBtn()
    })
  })

  $('#submit').on('click', function () {
    if (!$(this).hasClass('disabled')) {
      let address = {
        name: $('#name').val().replace(/[^\u4e00-\u9fa5]/g,''),
        phone: $('#phone').val(),
        area:$('#area').text(),
        address: $('#address').val().replace(/^\s+|\s+$/g,'')
      }

      if (!address.name) {
        Toast('请填写收件人真实姓名')
        return
      }

      if(/[a-zA-Z0-9]/.test(address.name)){
        Toast('请填写收件人真实姓名')
        return
      }
      if(address.name.length === 1){
        Toast('请填写收件人真实姓名')
        return
      }
      if(['先生','小姐','女士','太太'].some(item=>new RegExp(item).test(address.name))){
        Toast('请填写收件人真实姓名')
        return
      }
      if(address.name.length === 2){
        if(['生','哥','弟','姐','妹'].includes(address.name.substring(1,2))){
          Toast('请填写收件人真实姓名')
          return
        }
      }


      if (!Regular.phone.test(address.phone)) {
        Toast('请输入正确的手机号')
        return
      }
      if(!address.area){
        Toast('请选择收货区域')
        return
      }
      if(!address.address){
        Toast('收货地址不能为空')
        return
      }

      memberMallData.save(address)

      window.location.replace(window.location.href.replace('editAddress.html', 'goodsDetail.html'))
    }
  })

  let address = memberMallData.getAddress()
  if (address) {
    $('#name').val(address.name)
    $('#phone').val(address.phone)
    $('#address').val(address.address).focus().blur()

    checkBtn()
  }
}

function checkBtn() {
  let btn = $('#submit')
  if (inputs.every(item => {
      let empty = ($(item).val() === "" && $(item).text() === '');
      let close = $(item).parent().parent().find('.close')
      if (empty) {
        close.hide()
      } else {
        close.show()
      }
      return !empty
    })) {
    btn.removeClass('disabled')
  } else {
    btn.addClass('disabled')
  }
}

