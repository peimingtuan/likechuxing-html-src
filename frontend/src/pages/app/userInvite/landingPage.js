/**
 * Created by Administrator on 2018/2/11.
 */
require('./css/public.css')
require('./css/landingPage.css')
import $ from 'jquery'
import Login from '../../../component/login'
import toast from '../../../component/toast'
import toast2 from './comment/toast2/index'
import getActivityapiUrl from '../../../js/getActivityapiUrl'
import myAjax from '../../../component/myAjax'
import Format from '../../../js/function/format'
import parseURL from '../../../js/parseURL'
const query = parseURL(window.location.search).query
var strphone = query.mobile.substr(0,3)+"****"+query.mobile.substr(7);
//展示好友手机号
$(".contentInfo .p2 span").text(strphone);
//展示好友优惠码
$(".p3 span").text(query.favourCode);
//启用验证码
$('#phone').on('input', function () {
    if ($(this).val().length === 11) {
        if($(this).val()==query.mobile){
            toast2("可不能邀请自己啊");
            $(this).val("");
        }else{
            $('#getCode').addClass('disabled')
        }
    } else {
        $('#getCode').removeClass('disabled')
    }
});
//启用领奖卷
$('#code').on('input', function () {
    if ($(this).val().length === 4) {
        $('#verify').addClass('disabled')
    } else {
        $('#verify').removeClass('disabled')
    }
});
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
                $('#getCode').addClass('disabled')
                toast(res.msg)
            }
        })
    },
    verify: function (data) {
        //data.channel = query.hasOwnProperty('channel') ? query.channel : 'novemberAct'
        //添加优惠码字段
        data.share_code=query.favourCode;
        myAjax.post(getActivityapiUrl('/web/verify-code'), data, function (res) {
            if (res.status == 0) {
                login.init()
                $('#getCode').removeClass('disabled')
                $('#verify').removeClass('disabled')
                window.location.href = 'couponVoucher.html?' + Format.map2url({
                        uuid: res.data.uuid,
                        sign: res.data.sign,
                        new_user:res.data.new_user
                    })
            } else {
                toast(res.msg)
            }
        })
    }
})
