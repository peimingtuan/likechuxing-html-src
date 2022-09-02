/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/schedulingJob/enddispatchwork.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Select} from '../../../../component/Select/index'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//接收URL参数
var name = FoundationTools.getUrlParam('name');
var inputlength = 3;
//初始化查看楼层是否只有一个
if (sessionStorage.getItem('choicefloor')) {
    if (sessionStorage.getItem('choicefloor').split(',').length == 1) {
        $(".floors").val(sessionStorage.getItem('choicefloor'));
    }
}
if (name != '') {
    $(".choice-net").val(name);
} else {
    $(".floors").val('');
}
if (sessionStorage.getItem('branch_types') == '2' || name == '工具车') {//选择的是加油站或工具车
    $(".endwork-floor").addClass("none");
    inputlength = 1;
}
//选择楼层弹框
$(".floors").on("click", function () {
    let choicefloor = sessionStorage.getItem('choicefloor');
    let array = [];
    if (!choicefloor) {
        new Toast("请先选择网点名称");
        return false;
    }
    $.each(choicefloor.split(','), function (i, val) {
        let text = {
            name: ''
        };
        text.name = val;
        array.push(text);
    });
    new Select({
        name: '楼层',
        options: array,
        callback: function (item) {
            $(".floors").val(item.name);
        }
    })
});
//更改车辆状态
var array1 = [],
    array2 = [];
$.post(getApiUrl('/work-order/car-status'), {
    mobile: sessionStorage.getItem("mobile")
}, function (data) {
    if (data.status == '0') {
        array1=data.data;
        for(var i=0;i<array1.length;i++){
            if (name == '工具车') {//去掉空闲
                if(array1[i].id!='32' && array1[i].id!='1'){//去掉故障
                    array2.push(array1[i]);
                }
            }else{
                if(array1[i].id!='32'){//去掉故障
                    array2.push(array1[i]);
                }
            }
        }
    } else {
        new Toast(data.msg)
    }
});
var clicktag = 0;
$(".endwork-state").on("click", function () {
    if (clicktag == 0) {
        clicktag = 1;
        new Select({
            name: '更改车辆状态',
            id: '车辆id',
            options: array2,
            callback: function (item) {
                $(".car-state").val(item.name);
                $(".car-stateid").val(item.id);
            }
        })
    } else {
        new Toast("操作过于频繁")
    }
    setTimeout(function () {
        clicktag = 0;
    }, 2000)
});
//网点名称跳转页面
$(".endwork-netname").on("click", function () {
    sessionStorage.setItem("deletework", 1);
    window.location.href = "./networkname2.html"
})
//激活提交按钮
$("body").on("click", function () {
    let index = 0;
    if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
        if ($(".car-state").val() != '') {
            inputlength = 2;
        }
    }
    $(".input-foucs").each(function () {
        if ($(this).val() != '') {
            index++;
        }
    })
    if (index > inputlength) {
        $(".endworkname-submit button").addClass("endworkname-button");
    } else {
        $(".endworkname-submit button").removeClass("endworkname-button");
    }
});
$(".carposinum").on("input", function () {
    let index = 0;
    if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
        if ($(".car-state").val() != '') {
            inputlength = 2;
        }
    }
    $(".input-foucs").each(function () {
        if ($(this).val() != '') {
            index++;
        }
    })
    if (index > inputlength) {
        $(".endworkname-submit button").addClass("endworkname-button");
    } else {
        $(".endworkname-submit button").removeClass("endworkname-button");
    }
});
//提交按钮结束加油工单
var clicktag = 0;
$(".endworkname-submit button").on("click", function () {
    if ($(this).hasClass('endworkname-button')) {
        if ($(".car-stateid").val() == '32' || $(".car-stateid").val() == '31' || $(".car-stateid").val() == '33' || $(".car-stateid").val() == '25' || $(".car-stateid").val() == '23' || $(".car-stateid").val() == '20') {//状态为故障，维修，保养，保险,车辆整备，办公用车
            if ($(".void_writeinfo").val() == "") {
                new Toast("请填写备注信息");
                return false;
            }
        }
        if (clicktag == 0) {
            clicktag = 1;
            // 禁用按钮防止重复提交
            let loading = new Loading()//加载loading
            var time = window.setTimeout(function () {
                clicktag = 0;
                loading.destroy()//清除loading
                new Toast("请在我的工单界面确认该工单是否已完成！")
                setTimeout(function () {
                    window.location.href = "../schedulingJob/mywork.html";
                }, 2000);
            }, 10000);
            let param = {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
                work_order_id: sessionStorage.getItem('id'), //工单id
                car_id: sessionStorage.getItem('car_id'), //车辆id
                branch_id: sessionStorage.getItem('branch_id'),//网点id
                parking_floor: $(".choice-floor .floors").val(),//楼层
                parking_no: $(".carposinum").val(),//车位号
                branch_type: sessionStorage.getItem('branch_types'),//网点类型1网点，2加油站
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                type: '2',//结束调度工单
                comment: $(".void_writeinfo").val(),//备注信息
                car_status: $(".endwork-state .car-stateid").val() //车辆状态id
            }
            if (name == '工具车') {
                param.is_tool_car = '1'
            } else {
                param.is_tool_car = '2'
            }
            postshow(param);
            function postshow(param) {
                $.ajax({
                    type: "post",
                    data: param,
                    url: getApiUrl('/work-order/over'),
                    beforeSend: function () {

                    },
                    success: function (data) {
                        if (data.status == '0') {
                            new Toast("请拉门确认已锁门");
                            setTimeout(function () {
                                window.location.href = "../commonFile/jobend.html?type=2";
                            }, 2000)
                        } else if (data.status == '10011') {
                            loading.destroy()//清除loading
                            window.clearTimeout(time);//去掉定时器
                            clicktag = 0;
                            $(".net-contentwindow1 .top").text("车机里程为0，禁止上线，请更改其他状态");
                            $(".net-contentwindow1 .bottom").html("<span class='cance2'>取消</span>");
                            $(".net-contentwindow1").removeClass("none");
                        } else if (data.status == '10012') {
                            loading.destroy()//清除loading
                            window.clearTimeout(time);//去掉定时器
                            clicktag = 0;
                            $(".net-contentwindow1 .top").text("车机里程为0，请检查车机");
                            $(".net-contentwindow1 .bottom").html('<span class="cancel">取消</span><span class="qure">继续提交</span>');
                            $(".net-contentwindow1").removeClass("none");
                            $(".net-contentwindow1").on("click", ".qure", function () {
                                param.force_commit = '1';
                                postshow(param);
                                loading = new Loading()//加载loading
                            });
                        } else if (data.status == '10013') {
                            new Toast(data.msg);
                            setTimeout(function () {
                                window.location.href = "../commonFile/jobend.html?type=2";
                            }, 2000)
                        } else {
                            new Toast(data.msg);
                        }
                    }
                });
            }
        }
    }
});

//关闭弹框
$(".close-icon").on("click", function () {
    $(".net-contentwindow1").addClass("none");
});
$(".net-contentwindow1").on("click", ".cancel", function () {
    $(".net-contentwindow1").addClass("none");
});
$(".net-contentwindow1").on("click", ".cance2", function () {
    $(".net-contentwindow1").addClass("none");
});
