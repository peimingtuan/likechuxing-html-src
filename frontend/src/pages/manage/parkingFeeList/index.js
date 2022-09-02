/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index.js
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/23-下午6:12
 Description:
 Demo:
 Others:
 *************************************************/
require('./css/index.less')
import getUuid from '../../../component/manageApp_getUuidFromLocal'
import $ from 'jquery'
import toast from '../../../component/toast'
import getApiUrl from './js/getApiUrl'
import Loading from '../../../component/loading'
import Time from '../../../js/function/Time'
require('../../../js/polyfills')

const carBox = require('./template/carBox.pug')
const leaveBox = require('./template/leaveBox.pug')

let login = getUuid()
let page = 1
let loading = null
let list = []
bindAction()
function bindAction(){
    $('.boxToggle').click(function () {
        $(this).toggleClass('active')
        $('.inputBox').slideToggle(400,'linear')
        $('.list').toggleClass('active')
    })

    $('#search').click(function(){
        if(loading !== null){
            return
        }
        loading = new Loading()
        page = 1
        search()
    })

    $('.list').on('click', '.leave', function(){
        let id = $(this).attr('data-id')
        let data = {
            plate_no:list.find(item => item.id === id).plate_no.replace(/\s（\w*）/, ''),
            id: id
        }
        $('body').append(leaveBox(data))

        $('.leaveBox').click(function(e){
            e.preventDefault()
            e.stopPropagation()
            return false
        })
        $('#leave_btn').click(function(){
            let money = $('#money').val()
            if(money === ''){
                toast('停车费不能为空')
                return
            }
            let car = list.find(item => item.id === $(this).attr('data-id'))
            let data ={
                money,
                city_id:localStorage.getItem('city_id'),
                remark:$('#remark').val(),
                car_id:car.car_id,
                begin_status: car.begin_status,
                branch_id: car.branch_id
            }
            let loading = new Loading()
            post(getApiUrl('/a2b/parking-out'), data, function(){
                loading.destroy()
                toast('提交成功')
                $('.mask').remove()
                $('#search').click()
            })
        })
        $('.mask').on('click', function(){
            $(this).remove()
        }).on('touchmove', function(e){
            e.stopPropagation()
            e.preventDefault()
            return false
        })
    }).on('click', '#loadMore', function(){
        if(loading !== null){
            return
        }
        loading = new Loading()
        page++
        search()
    })

    $('#reset').click(function(){
        $('#plateQuery').val('')
        $('#vinQuery').val('')
        $('#branchQuery').val('')
        $('#order').val('5_desc')
        $('#carStatus').val(0)
    })
}

function search(){
    post(getApiUrl('/a2b/time-list'),getQueryData(),function(res){
        loading.destroy()
        loading = null
        $('.msgBox #cache_time').text('数据更新：'+new Time(res.data.cache_time).fromNow())
        $('.msgBox #total').text('共'+res.data.total_count+'条数据')
        if(res.data.page === '1'){
            list = res.data.data
        }else{
            list = list.concat(res.data.data)
        }
        $('.list').children().remove()
        let lastLi = ''
        if(res.data.total_count > list.length){
            lastLi = '<li class="btn_con"><button class="white_btn" id="loadMore">加载更多</button></li>'
        }else{
            lastLi = '<li class="msg">没有更多数据了</li>'
        }
        $('.list').append(list.map(item => {
            let vin = ''
            let plate_no = item.plate_no.replace(/（[^）]*）/, function(match){
                vin = match.replace(/[（）]/g,'')
                return ''
            })
            let limit = ''
            switch(item.limit_today+item.limit_tomor){
                case '00':
                    limit = ''
                    break;
                case '10':
                    limit = ' - (今日)'
                    break;
                case '11':
                    limit = ' - (今日明日)'
                    break;
                case '01':
                    limit = ' - (明日)'
            }

            item.compose = plate_no.trim() + ' - (' + vin.substr(-6) + ')' + limit
            return carBox(item)
        }).join('')).append(lastLi)

    })
}

function post(url, data, cb) {
    $.post(url, Object.assign(data,login), function(res){
        if(res.status === 0){
            cb(res)
        }else{
            if(loading !== null){
                loading.destroy()
                loading = null
            }
            $('.list').children().remove()
            $('.msgBox #cache_time').text('')
            $('.msgBox #total').text('')
            toast(res.msg)
        }
    })
}

function getQueryData(){
    let carStatus = $('#carStatus').val()
    let orderStr = $('#order').val()
    let data = {
        plate_no:$('#plateQuery').val(),
        vin:$('#vinQuery').val(),
        status:carStatus==='0'?'':Number(carStatus),
        branch:$('#branchQuery').val(),
        order:{
            column:orderStr.substr(0,1),
            dir:orderStr.substr(2,4)
        },
        page:page,
        page_size:20
    }
    for (let k in data){
        if(data[k] === ''){
            delete data[k]
        }
    }
    return data
}