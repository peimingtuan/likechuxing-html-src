/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午5:32
 Description:
 Param:
 Return:
 *************************************************/
require('./css/index.less')
import $ from 'jquery'
import toast from '../../../component/toast'
import getUuid from '../../../component/manageApp_getUuidFromLocal'
import myAjax from '../../../component/myAjax'
import getApiUrl from './js/getApiUrl'
require('../../../js/polyfills')
import Loading from '../../../component/loading'

let loading = null

function loadData(data){
    $('.btn_con, .msg').remove()
    let total = {
        recomment_num:0,
        real_num:0,
        diff:0,
        available_num:0
    }
    let lines = data.map( (item, index) => {
        //total.recomment_num+=Number(item.recomment_num)
        total.real_num+=Number(item.real_num)
        total.diff+=Number(item.diff)
        //total.available_num+=Number(item.available_num)
        let str = '<tr class="item branches">'
        str += '<td>' + (index + 1) + '</td>'
        str += '<td class="branch_name">' + item.branch_name + '</td>'
        str += '<td>' + item.recomment_num + '</td>'
        //str += '<td>' + item.real_num + '</td>'
      let diff = -Number(item.diff)
        str += '<td class="' + (diff < 0 ? 'red' : '') + '">' + diff + '</td>'
        //str += '<td>' + item.available_num + '</td>'
        str += '</tr>'
        return str
    }).join('')
    let str_explain = '<tr class="item">' +
      '<td style="color:#777;text-align: left" colspan="6">' +
      '<p>调度说明：每日根据“需调入”列表，将车辆调入或调出测试网点，需确保早7:00前“需调入”列表值为0</p>' +
      '<p style="color:#444">当值显示为“正数”时，结果为调入车辆，使车数变为“0”;</p>' +
      '<p style="color:#444">当值显示为“负数”时，结果应调出车辆，使车数变为“0”;</p>' +
      '<p style="color:#444">当值显示为“0”时，结果为不需要进行车辆调度;</p>' +
      '<p>备注：将车辆调度完成后截图保存。</p></td></tr>'
    //let str_total = '<tr class="item"><td>总数</td><td>-</td><td>' + total.real_num + '</td><td>' + total.diff + '</td>'
    $('.table-body table').append( lines + str_explain)
    initCss()
}

function getData(){
  $('.item, .btn_con, .msg').remove()
    loading = new Loading()

    myAjax.post(getApiUrl('/dispatch/car'),login,function (res){
        loading.destroy()
        loading = null
        if(res.status === 0){
            loadData(res.data)
        }else{
            toast(res.msg)
        }
    })
}

function initCss(){
    $('.table-body').css({'paddingTop':$('.table-head').height()})

    let th = $('.thFreeze').show()
    $.each($('.thReal th'),function(index,item){
        let freeze = th.find('th').eq(index)
        let itemjq = $(item)
        freeze.css({
            'width': itemjq.width(),
            'height': itemjq.height()+2,
            'left': itemjq.offset().left
        })
    })
}

$('.refresh').click(getData)

$('#search_branch_name').on('input', function () {
    let value = $(this).val()
    //let value_arr = value.split('')
  let reg = new RegExp(value)
    if (value === '') {
        $("tr.branches").show()
    } else {
        $('tr.branches').hide()
        let branch_names = $('.branch_name')
        if (branch_names.length > 0) {
            branch_names.each(function () {
                let name = $(this).text()
                if(reg.test(name)){
                  $(this).parent().show()
                }
            })
        }
    }
})
let login = getUuid()

getData()
setInterval(function(){
  getData()
},30*1000)


