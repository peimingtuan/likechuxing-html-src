/**
 * Created by Administrator on 2018/3/1.
 */
require('../css/public.css')
require('../css/oilerSingle/deletework.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Select} from '../../../../component/Select/index'
import {Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//接收URL参数
var name = FoundationTools.getUrlParam('name'),
    branch_id= FoundationTools.getUrlParam('branch_id'),//选择的网点
    type = FoundationTools.getUrlParam('type');//1为加油，2为调度,3为充电
//解决来自充电工单进入搜索网点页面遗留问题
if(sessionStorage.getItem("peifromcharge")){
    type=3;
    sessionStorage.removeItem("peifromcharge");
}
var inputlength = 2;
//初始化查看楼层是否只有一个
if (sessionStorage.getItem('choicefloor')) {
    if (sessionStorage.getItem('choicefloor').split(',').length == 1) {
        $(".floors").val(sessionStorage.getItem('choicefloor'));
        if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
            $(".delete-btn button").addClass("delete-nextbutton");
        }
    }
}
if (name) {
    $(".choice-net").val(name);
    $("ul").removeClass("none");
    sessionStorage.setItem("branch_id",branch_id);
} else {
    $(".floors").val('');
    $("ul").addClass("none");
    sessionStorage.removeItem("carstatuschoice");
    $(".delete-btn button").removeClass("delete-nextbutton");
}
//车辆状态
var params = {
    mobile: sessionStorage.getItem("mobile"),
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
}
$.post(getApiUrl('/work-order/car-status'), params, function (data) {
    let array = [],
        car_statusstr='';
    if (data.status == '0') {
        array=data.data;
        for (var i = 0; i < array.length; i++) {
            if (array[i].id != '32') {
                if (array[i].id == sessionStorage.getItem("carstatuschoice")) {
                    $("ul").removeClass("none");
                    car_statusstr += '<span class="state color">' + array[i].name + '<input type="hidden" value="' + array[i].id + '"/></span>';
                } else {
                    car_statusstr += '<span class="state">' + array[i].name + '<input type="hidden" value="' + array[i].id + '"/></span>';
                }
            }
        }
        $(".confirm-carstate").html(car_statusstr);
    } else {
        new Toast(data.msg)
    }
    //点击选项变换颜色
    $(".confirm-carstate .state").on("click", function (event) {
        event.stopPropagation();//阻止事件冒泡
        if ($(this).hasClass("color")) {
            $(this).removeClass("color");
            $(".delete-btn button").removeClass("delete-nextbutton");
            $("ul").addClass("none");
        } else {
            $(".confirm-carstate .state").removeClass("color")
            $(this).addClass("color");
            //确认删除按钮激活
            $(".delete-btn button").addClass("delete-nextbutton");
            if ($(this).text() != "空闲" && $(this).text() != "长租空闲") {
                $("ul").addClass("none");
                $(".input-foucs").val("");//清空input框数据
            } else {
                $("ul").removeClass("none");
                $(".delete-btn button").removeClass("delete-nextbutton");
            }
        }
    });
    //网点名称跳转页面
    $(".endwork-netname").on("click", function () {
        if(type=='3'){//来自充电工单删除
            sessionStorage.setItem("peifromcharge", 1);
        }
        sessionStorage.setItem("carstatuschoice", $(".confirm-carstate .color").find("input").val());
        window.location.href = "../../endwork/index.html#/selectmapnet?type=4"
    });
    //激活提交按钮
    $("body").on("click", function () {
        if(!$(".delete-btn button").hasClass("delete-nextbutton")){
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
                $(".delete-btn button").addClass("delete-nextbutton");
            } else {
                $(".delete-btn button").removeClass("delete-nextbutton");
            }
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
            $(".delete-btn button").addClass("delete-nextbutton");
        } else {
            $(".delete-btn button").removeClass("delete-nextbutton");
        }
    });
//选择楼层弹框
    $(".floors").on("click", function () {
        let choicefloor = sessionStorage.getItem('choicefloor');
        let array = [];
        if (!choicefloor) {
            new Toast("请先选择网点名称");
            return false;
        }
        $.each(choicefloor.split(','), function (i, val) {
            //text = text + "Key:" + i + ", Value:" + val;
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
    });
//删除接口
    $(".delete-btn button").on("click", function (event) {
        event.stopPropagation();//阻止事件冒泡
        if ($(this).hasClass("delete-nextbutton")) {
            if(type=='3'){//3来自充电工单
                $.post(getApiUrl('/vehicle-charging/operate'), {
                    mobile: sessionStorage.getItem("mobile"),
                    order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                    item_id: '99',//操作项id
                    params:{
                        status: $(".confirm-carstate .color").find("input").val(),//车辆状态
                        branch_id: sessionStorage.getItem('branch_id') || '',//网点id
                        parking_floor: $(".choice-floor .floors").val() || '',//楼层
                        parking_no: $(".carposinum").val() || ''//车位号
                    }
                }, function (data) {
                    let result = data,
                        status = result.status,
                        msg = result.msg;
                    if (status == '0') {
                        new Toast("删除成功");
                        setTimeout(function () {
                            window.location.href = "../../manageOrderMain/index.html#/list";
                        }, 2000)
                    } else {
                        new Toast(msg);
                    }
                });
            }else{
                let param = {
                    mobile: sessionStorage.getItem("mobile"),
                    work_order_id: sessionStorage.getItem("id"),//工单id
                    car_id: sessionStorage.getItem("car_id"),//车辆id
                    car_status: $(".confirm-carstate .color").find("input").val(),//车辆状态
                    branch_id: sessionStorage.getItem('branch_id') || '',//网点id
                    parking_floor: $(".choice-floor .floors").val() || '',//楼层
                    PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                    type: '',//加油或调度
                    parking_no: $(".carposinum").val() || ''//车位号
                }
                if (type == '1') {
                    param.type = '1'
                } else if (type == '2'){
                    param.type = '2'
                }
                $.post(getApiUrl('/work-order/delete'), param, function (data) {
                    let result = data,
                        status = result.status,
                        msg = result.msg;
                    if (status == '0') {
                        new Toast("删除成功");
                        setTimeout(function () {
                            window.location.href = "../../manageOrderMain/index.html#/list";
                        }, 2000)
                    } else {
                        new Toast(msg);
                    }
                });
            }
        } else {
            if ($(".confirm-carstate .color").text() == "空闲" || $(".confirm-carstate .color").text() == "长租空闲") {
                new Toast("请填写完整的网点信息");
            } else {
                new Toast("请选择车辆状态");
            }
        }
    });
});
