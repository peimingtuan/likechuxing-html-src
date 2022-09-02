/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey
 Version: 1.0.0
 Date: 2017/11/14-下午6:59
 Description:
 Demo:
 Others:
 *************************************************/
require('./css/index.less')
import Login from '../../../component/login'
import getActivityapiUrl from '../../../js/getActivityapiUrl'
import myAjax from '../../../component/myAjax'
import toast from '../../../component/toast'
import Format from '../../../js/function/format'
import parseURL from '../../../js/parseURL'
import $ from 'jquery'
import downloadBar from './component/downloadFooter'
import footer from './component/footer'
import downloadUrl from '../../../component/downloadUrl'

import banner from './template/banner.pug'
import login_box from './template/login.pug'
import box from './template/box.pug'
import box_title from './template/box_title.pug'
import box_content from './template/box_content.pug'
import Umeng from '../../../component/umeng'
new Umeng(1271491256)

const query = parseURL(window.location.search).query
const channel = query.hasOwnProperty('channel') ? query.channel : 'baidu_tuiguang'
let channel_type = ""

$("body").append(
    banner({channel_type: channel_type})
).append(
    box({
        title: box_title({icon_class: 'icon_4', title: '公司介绍'}),
        content: box_content({type: 4, channel_type: channel_type})
    })

).append(
    box({
        title: box_title({icon_class: 'icon_3', title: '使用流程'}),
        content: box_content({type: 3, channel_type: channel_type})
    })
).append(
    box({
        title: box_title({icon_class: 'icon_2', title: '选择车型'}),
        content: box_content({type: 2, channel_type: channel_type})
    })
).append(
    box({
        title: box_title({icon_class: 'icon_1', title: '注册说明'}),
        content: box_content({type: 1, channel_type: channel_type}) + login_box()
    })
).append(
    footer()
).append(
    downloadBar
)

$('.toYYB').click(function(){
    window._czc.push(["_trackEvent","download",channel]);
    window.location.href = downloadUrl.yingyongbao
})


$('#phone').on('input', function () {
    if ($(this).val().length === 11) {
        $('#getCode').removeClass('disabled')
    } else {
        $('#getCode').addClass('disabled')
    }
})
$('#code').on('input', function () {
    if ($(this).val().length === 4) {
        $('#verify').removeClass('disabled')
    } else {
        $('#verify').addClass('disabled')
    }
})
let login = new Login({
    phone: document.querySelector('#phone'),
    getCodeBtn: document.querySelector('#getCode'),
    code: document.querySelector('#code'),
    verifyBtn: document.querySelector('#verify'),
    getCode: function (phone, cb) {
        // send ajax request to get verifyCode,execute cb() when succeed
        myAjax.post(getActivityapiUrl('/login/get-code'), {
            phone: phone
        }, function (res) {
            if (res.status == 0) {
                toast('发送成功')
                cb()
            } else {
                $('#getCode').removeClass('disabled')
                toast(res.msg)
            }
        })
    },
    verify: function (data) {
        window._czc.push(["_trackEvent","getCoupon",channel]);
        data.channel = channel
        myAjax.post(getActivityapiUrl('/web/verify-code'), data, function (res) {
            if (res.status == 0) {
                login.init()
                $('#getCode').addClass('disabled')
                $('#verify').addClass('disabled')
                window.location.href = 'coupons.html?' + Format.map2url({
                    uuid: res.data.uuid,
                    sign: res.data.sign
                })
            } else {
                toast(res.msg)
            }
        })
    }
})
