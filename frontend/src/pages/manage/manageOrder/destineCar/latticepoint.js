/**
 * Created by Administrator on 2018/7/19.
 */
require('../css/public.css')
require('../css/destineCar/latticepoint.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//获取参数
var _car_info;
var plate_no = FoundationTools.getUrlParam("name");
if (plate_no) {
    _car_info = plate_no;
}
var _status = FoundationTools.getUrlParam("status");
var _desc = FoundationTools.getUrlParam("desc");

var _branch_id, _name, _floor, _no;

if (_status) {
    myAjax.post(getApiUrl("car/current-branch-info"), {
        car_info: _car_info,
        mobile: sessionStorage.getItem("mobile")
    }, function (result) {
        if (result.status == '0') {
            var data = result.data;

            _name = data.name;
            _branch_id = data.branch_id;
            _floor = data.floor;
            _no = data.no;
            _floor == 0 ? _floor = '地面' : _floor;

            $('#searchPlace').val(_name);
            $('#parking').val(_floor);
            $('#parkNumber').val(_no);
        } else {
            new Toast(result.msg)
        }
    })
}
var clicktag = 0;//控制连击变量
$('#subChange').click(function () {
    _floor = $("#parking").val();
    _no = $('#parkNumber').val();
    if (clicktag == 0) {
        clicktag=1;
        setTimeout(function () {
            clicktag = 0;
        }, 5000);
        if (_status) {
            if (_branch_id && _floor) {
                myAjax.post(getApiUrl("car/change-branch-and-status"), {
                    car_info: _car_info,
                    car_status: _status,
                    desc: _desc,
                    branch_id: _branch_id,
                    floor: _floor,
                    no: _no,
                    mobile: sessionStorage.getItem("mobile")
                }, function (result) {
                    if (result.status == '0') {
                        new Toast(result.msg)
                        setTimeout(function () {
                            window.location.href = '../../manageOrderCardetail/index.html?plate_no=' + plate_no;
                        }, 1000)
                    }else{
                        new Toast(result.msg)
                    }
                })
            } else if (!_branch_id) {
                $('#searchPlace').focus();
            } else {
                new Toast('请完整填写楼层车位号')
            }
        } else {
            if (_branch_id) {
                myAjax.post(getApiUrl("car/change-branch"), {
                    car_info: _car_info,
                    branch_id: _branch_id,
                    floor: _floor,
                    no: _no,
                    mobile: sessionStorage.getItem("mobile")
                }, function (result) {
                    if (result.status == '0') {
                        new Toast(result.msg)
                        setTimeout(function () {
                            window.location.href = '../../manageOrderCardetail/index.html?plate_no=' + plate_no;
                        }, 1000)
                    }else{
                        new Toast(result.msg)
                    }
                })
            } else if (!_branch_id) {
                $('#searchPlace').focus();
            }
        }
    }else{
        new Toast("操作过于频繁")
    }
});

myAjax.post(getApiUrl("car/branch-list"), {
    mobile: sessionStorage.getItem("mobile")
}, function (result) {
    var data = result.data;
    var sHtml = "";
    $.each(data, function (i) {
        sHtml += '<li id="' + data[i].id + '">' + data[i].name + '</li>';
    });
    $('#items').html(sHtml);
})

var input = $('#searchPlace');
input.keyup(function () {
    $("#spList").show();
    $("#items>li").hide();
    var $d = $("#items>li").filter(":contains('" + $.trim(input.val()) + "')");
    $d.show();
});
$("#items").on('click', 'li', function () {
    input.val($(this).text());
    _branch_id = $(this).attr('id');
    $('#spList').hide();
});

$('body').on('click', function (e) {
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.className != "search-box") {
        $('#spList').hide();
    }
});
