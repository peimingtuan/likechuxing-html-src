/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: scoreDetail
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/12/15-下午5:58
 Description:
 Param:
 Return:
 *************************************************/
require('./css/scoreDetail.less')
require('./js/common')
import Loading from '../../../component/loading'
import $ from 'jquery'
import myAjax from '../../../component/myAjax/withJq'
import Time from '../../../js/function/Time'
import getApiUrl from "./js/getApiUrl";
import MemberMallData from './js/MemberMallData'
let memberMallData = new MemberMallData();

const emptyBox = require('./component/EmptyList/index.pug')
const scoreDetailBox = require('./template/scoreDetailBox.pug')
import PullUpDown from '../../../component/pullDonwRefresh'

const user = memberMallData.getUser()
let queryData = {
    uuid: user.uuid,
    sign: user.sign,
    page: 1
}

let loading = new Loading()
let pullUpDown = null
if (user) {
    getData(function (data) {
        if (data.length === 0) {
            $('body').append(emptyBox({type: 'note', text: '当前暂无收支记录'}))
        } else {
            $('.listContainer').height($(window).height())

            pullUpDown = new PullUpDown({
                listClassName: 'scoreList',
                parent: document.querySelector('.listContainer'),
                pullDownRefresh: function (cb) {
                    queryData.page = 1
                    getData(function (data) {
                        cb()
                        pullUpDown.changeContent(getDetailBoxStr(data))
                    })
                },
                pullUpLoad: function (cb) {
                    queryData.page++
                    getData(function (data) {
                        if (data.length === 0) {
                            cb(false)
                            return
                        }
                        pullUpDown.appendContent(getDetailBoxStr(data))
                        cb(true)
                    })
                }
            })

            setTimeout(function(){
                pullUpDown.changeContent(getDetailBoxStr(data))
            }, 100)
        }
    })
}

function getDetailBoxStr(data) {
    return data.map(item => {
        item.new_score = item.new
        item.format_time = new Time(item.create_at).getTime('YYYY-MM-DD HH:mm')
        item.point = item.point > 0 ? '+' + item.point : item.point
        return scoreDetailBox(item)
    }).join('')
}

function getData(cb) {
    myAjax.post(getApiUrl('point/trade-list'), queryData, function (res) {
        if (loading) {
            loading.destroy()
            loading = null
        }
        cb(res.data)
    })
}