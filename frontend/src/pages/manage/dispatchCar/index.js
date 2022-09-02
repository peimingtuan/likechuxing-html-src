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

require('../../../js/polyfills')
import Loading from '../../../component/loading'

let loading = null

function loadData(data) {
    $('.btn_con, .msg').remove()
    let total = {
        recomment_num: 0,
        real_num: 0,
        diff: 0,
        available_num: 0
    }
    let lines = data.map((item, index) => {
        total.recomment_num += Number(item.recomment_num)
        total.real_num += Number(item.real_num)
        total.diff += Number(item.diff)
        total.available_num += Number(item.available_num)
        let str = '<tr class="item branches">'
        str += '<td>' + (index + 1) + '</td>'
        str += '<td class="branch_name">' + item.branch_name + '</td>'
        str += '<td>' + item.recomment_num + '</td>'
        str += '<td>' + item.real_num + '</td>'
        str += '<td class="' + (item.diff < 0 ? 'red' : '') + '">' + item.diff + '</td>'
        str += '<td>' + item.available_num + '</td>'
        str += '</tr>'
        return str
    }).join('')
    let str_explain = '<tr class="item"><td style="color:#999" colspan="6">建议车辆数为 \'-\' 的网点请按以往经验调度</td></tr>'
    let str_total = '<tr class="item"><td>总数</td><td>-</td><td>-</td><td>' + total.real_num + '</td><td>-</td><td>' + total.available_num + '</td>'
    $('.table-body table').append( str_total + lines + str_explain)
    initCss()
}

function getData() {
    loading = new Loading()
    $.post('https://webapi.likechuxing.com/data/branch', {}, function (res) {
        loading.destroy()
        loading = null
        if (res.status === 0) {
            loadData(res.data)
        } else {
            toast(res.msg)
        }
    })
}

function initCss() {
    $('.table-body').css({'paddingTop': $('.table-head').height()})

    let th = $('.thFreeze').show()
    $.each($('.thReal th'), function (index, item) {
        let freeze = th.find('th').eq(index)
        let itemjq = $(item)
        console.log(itemjq.offset())
        freeze.css({
            'width': itemjq.width(),
            'height': itemjq.height() + 2,
            'left': itemjq.offset().left
        })
    })
}

$('.refresh').click(function () {
    $('.item, .btn_con, .msg').remove()
    getData()
})

$('#search_branch_name').on('input', function () {
    let value = $(this).val()
    let value_arr = value.split('')
    if (value === '') {
        $("tr.branches").show()
    } else {
        $('tr.branches').hide()
        let branch_names = $('.branch_name')
        if (branch_names.length > 0) {
            branch_names.each(function () {
                let name = $(this).text()
                if(value_arr.some(item => new RegExp(item).test(name))) {
                    $(this).parent().show()
                }
            })
        }
    }
})

getData()
