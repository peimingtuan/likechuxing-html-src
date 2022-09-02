/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/commonFile/changenetstatus.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Select} from '../../../../component/Select/index'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//接收URL参数
var name = FoundationTools.getUrlParam('name'),//来自网点搜索页的网点名称
    branch_name = FoundationTools.getUrlParam('branch_name'),//网点名称
    branch_id = FoundationTools.getUrlParam('branch_id'),//网点ID
    floor = FoundationTools.getUrlParam('floor'),//楼层
    parking_no = FoundationTools.getUrlParam('parking_no'),//车位号
    plate_no = FoundationTools.getUrlParam('plate_no'),
    type = FoundationTools.getUrlParam('type');//type为2来自故障工单更改网点，其他为车辆详情页面更改网点
if (plate_no) {
    if(type){//来自故障
        sessionStorage.setItem("typefrom", 2);//记录来源
    }else{//来自车辆详情
        sessionStorage.removeItem("typefrom");
    }
    sessionStorage.setItem("plate_no", plate_no);//存储车牌号或VIN号
    sessionStorage.setItem("branch_id", branch_id);//存储网点ID
    $(".choice-net").val(branch_name);
    $(".floors").val(floor);
    $(".carposinum").val(parking_no);
    $(".endworkname-submit button").addClass("endworkname-button");
}
var inputlength = 2;
//初始化查看楼层是否只有一个
if (sessionStorage.getItem('choicefloor')) {
    if (sessionStorage.getItem('choicefloor').split(',').length == 1) {
        $(".floors").val(sessionStorage.getItem('choicefloor'));
        if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
            $(".endworkname-submit button").addClass("endworkname-button");
        }
    }
}
if (name) {
    $(".choice-net").val(name);
    sessionStorage.setItem("branch_id", branch_id);//存储网点ID
    if(sessionStorage.getItem("typefrom")){
        type=2;
    }
}
//选择楼层弹框
$(".floors").on("click", function () {
    let choicefloor = sessionStorage.getItem('choicefloor');
    let array = [];
    if (!choicefloor && $(".floors").val()=='') {
        new Toast("请先选择网点名称");
        return false;
    }
    if(choicefloor){
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
                console.log(item);
                $(".floors").val(item.name);
            }
        })
    }
});

//网点名称跳转页面
$(".endwork-netname").on("click", function () {
    window.location.href = "../../endwork/index.html#/selectmapnet?type=3"
})
//激活提交按钮
$("body").on("click", function () {
    let index = 0;
    if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
        if ($(".car-state").val() != '') {
            inputlength = 1;
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
            inputlength = 1;
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
//提交按钮结束
var clicktag = 0;
$(".endworkname-submit button").on("click", function () {
    if ($(this).hasClass('endworkname-button')) {
        if (clicktag == 0) {
            clicktag = 1;
            let param = {
                mobile: sessionStorage.getItem("mobile"),
                car_info: sessionStorage.getItem("plate_no"),//车牌号或VIN
                branch_id: sessionStorage.getItem("branch_id"),//网点ID
                floor: $(".choice-floor .floors").val(),//楼层
                no: $(".carposinum").val()//车位号
            }
            $.ajax({
                type: "post",
                data: param,
                url: getApiUrl('/car/change-branch'),
                beforeSend: function () {

                },
                success: function (data) {
                    if (data.status == '0') {
                        if(type==2){//回故障工单更改网点详情
                            window.location.href = "../faultWork/faultdetail2.html";
                        }else{//回车辆详情
                            window.location.href = "../../manageOrderCardetail/index.html?plate_no=" + sessionStorage.getItem("plate_no");
                        }
                    } else {
                        new Toast(data.msg);
                    }
                }
            });
            setTimeout(function () {
                clicktag = 0;
            }, 2000);
        } else {
            new Toast("操作过于频繁")
        }
    }
});
