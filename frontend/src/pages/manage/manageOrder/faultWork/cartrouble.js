/**
 * Created by Administrator on 2018/6/11.
 */
require('../css/public.css')
require('../css/faultWork/cartrouble.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//初始化加载图片
$(".img1").attr("src", require("../image/faultWork/rightlength.png"));
$(".img2").attr("src", require("../image/faultWork/leftlength.png"));
$(".finsh_trouble img").attr("src", require("../image/faultWork/success.png"));
//获取车辆问题详情
myAjax.post(getApiUrl('/vehicle-problem/problem-detail'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id:sessionStorage.getItem('order_id'),//工单id
    car_id: sessionStorage.getItem('car_id')//车辆id
}, function (data) {
    if (data.status == '0') {
        $("body").removeClass("none");
        let strleft = '',
            strcenter = '',
            strright = '',
            str2 = '',
            str3 = '',
            leftlength = 0,
            centerlength = 0,
            rightlength = 0;
        if (data.data instanceof Array) {
            $("body").css("background","#f6f6f6");
            $(".finsh_trouble").removeClass("none");
            $(".deal-trouble").removeClass("none");
            $(".troule-btn button").text("返回");
            $(".troule-btn button").addClass("addcolor");
            $(".troule-btn button").on("click", function () {
                location.href="./faultdetail.html";
            });
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].type == '1') {//上部
                    if (data.data[i].position == '1') {//左
                        leftlength++;
                        strleft += '<li><span><font class="font1">' + data.data[i].name + '</font><font>(' + data.data[i].report_cnt + ')</font></span></li>';
                    } else if (data.data[i].position == '2') {//中
                        centerlength++;
                        strcenter += '<li><span><font class="font1">' + data.data[i].name + '</font><font>(' + data.data[i].report_cnt + ')</font></span></li>';
                    } else if (data.data[i].position == '3') {//右
                        rightlength++;
                        strright += '<li><span><font class="font1">' + data.data[i].name + '</font><font>(' + data.data[i].report_cnt + ')</font></span></li>';
                    }
                } else if (data.data[i].type == '2') {//中部
                    str2 += '<span><font class="font1">' + data.data[i].name + '</font><font>(' + data.data[i].report_cnt + ')</font></span>';
                } else if (data.data[i].type == '3') {//下部
                    str3 += '<span><font class="font1">' + data.data[i].name + '</font><font>(' + data.data[i].report_cnt + ')</font></span>';
                }
            }
            let array = [leftlength, centerlength, rightlength];

            function sort(arr) {
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = 0; j < arr.length - i - 1; j++) {
                        if (arr[j] < arr[j + 1]) {
                            let hand = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = hand;
                        }
                    }
                }
                return arr;
            }

            sort(array);
            $(".outer-trouble").css("height", array[0] * 1.4 + "rem");
            $(".left-ul").html(strleft);
            $(".center-ul").html(strcenter);
            $(".right-ul").html(strright);
            $(".inner-trouble").html(str2);
            $(".other-trouble").html(str3);
            if (strleft == '' && strcenter == '' && strright == '') {
                $(".outer").addClass("none");
            }
            if (str2 == '') {
                $(".inner").addClass("none");
            }
            if (str3 == '') {
                $(".other").addClass("none");
            }
        }else{
            for (var i = 0; i < data.data.parts.length; i++) {
                let classtype = '';
                if (data.data.parts[i].broken_level == '1') {//需要立即处理
                    classtype = 'check-color';
                }
                if (data.data.parts[i].type == '1') {//上部
                    if (data.data.parts[i].position == '1') {//左
                        leftlength++;
                        strleft += '<li><span class="' + classtype + '"><input type="hidden" value="' + data.data.parts[i].part_id + '" /><font class="font1">' + data.data.parts[i].part_name + '</font><font>(' + data.data.parts[i].report_cnt + ')</font><img class="img3 none" src="' + require("../image/faultWork/checked.png") + '"/></span></li>';
                    } else if (data.data.parts[i].position == '2') {//中
                        centerlength++;
                        strcenter += '<li><span class="' + classtype + '"><input type="hidden" value="' + data.data.parts[i].part_id + '" /><font class="font1">' + data.data.parts[i].part_name + '</font><font>(' + data.data.parts[i].report_cnt + ')</font><img class="img3 none" src="' + require("../image/faultWork/checked.png") + '"/></span></li>';
                    } else if (data.data.parts[i].position == '3') {//右
                        rightlength++;
                        strright += '<li><span class="' + classtype + '"><input type="hidden" value="' + data.data.parts[i].part_id + '" /><font class="font1">' + data.data.parts[i].part_name + '</font><font>(' + data.data.parts[i].report_cnt + ')</font><img class="img3 none" src="' + require("../image/faultWork/checked.png") + '"/></span></li>';
                    }
                } else if (data.data.parts[i].type == '2') {//中部
                    str2 += '<span class="' + classtype + '"><input type="hidden" value="' + data.data.parts[i].part_id + '" /><font class="font1">' + data.data.parts[i].part_name + '</font><font>(' + data.data.parts[i].report_cnt + ')</font><img class="img3 none" src="' + require("../image/faultWork/checked.png") + '"/></span>';
                } else if (data.data.parts[i].type == '3') {//下部
                    str3 += '<span class="' + classtype + '"><input type="hidden" value="' + data.data.parts[i].part_id + '" /><font class="font1">' + data.data.parts[i].part_name + '</font><font>(' + data.data.parts[i].report_cnt + ')</font><img class="img3 none" src="' + require("../image/faultWork/checked.png") + '"/></span>';
                }
            }
            let array = [leftlength, centerlength, rightlength];

            function sort(arr) {
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = 0; j < arr.length - i - 1; j++) {
                        if (arr[j] < arr[j + 1]) {
                            let hand = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = hand;
                        }
                    }
                }
                return arr;
            }

            sort(array);
            $(".outer-trouble").css("height", array[0] * 1.4 + "rem");
            $(".left-ul").html(strleft);
            $(".center-ul").html(strcenter);
            $(".right-ul").html(strright);
            $(".inner-trouble").html(str2);
            $(".other-trouble").html(str3);
            if (strleft == '' && strcenter == '' && strright == '') {
                $(".outer").addClass("none");
            }
            if (str2 == '') {
                $(".inner").addClass("none");
            }
            if (str3 == '') {
                $(".other").addClass("none");
            }
            //点击选项变换颜色
            $(".solve-trouble").on("click", "span", function () {
                if ($(".solve-trouble .check-color2").length > 0) {
                    if ($(this).hasClass("check-color2")) {
                        $(this).removeClass("check-color2");
                        $(this).find("img").addClass("none");
                    } else {
                        $(this).addClass("check-color2");
                        $(this).find("img").removeClass("none");
                    }
                } else {
                    $(this).addClass("check-color2");
                    $(this).find("img").removeClass("none");
                }
                if ($(".solve-trouble .check-color2").length > 0) {
                    $(".troule-btn button").addClass("addcolor");//点亮按钮
                } else {
                    $(".troule-btn button").removeClass("addcolor");//置灰按钮
                }
            });
            //已处理
            $(".troule-btn button").on("click", function () {
                if ($(this).hasClass("addcolor")) {
                    let array = [],
                        str = '';
                    $(".solve-trouble span").each(function () {
                        if ($(this).hasClass("check-color2")) {
                            array.push($(this).find(".font1").text())
                        }
                    });
                    if(array.length<9){
                        for (var i = 0; i < array.length; i++) {
                            str += '<span>' + array[i] + '</span>';
                        }
                    }else{
                        for (var i = 0; i < 9; i++) {
                            str += '<span>' + array[i] + '</span>';
                        }
                        str += '<span>...</span>';
                    }
                    $(".sure_content .center").html(str);
                    $(".sure_content .title span").text(array.length);//清除问题记录条数
                    //打开弹框
                    $(".sure_window").removeClass("none");
                }
            });
        }
    } else {
        new Toast(data.msg)
    }
});

//取消弹框
$(".alert-cancel").on("click", function () {
    $(".sure_window").addClass("none");
});

//确认弹框
$(".alert-sure").on("click", function () {
    $(".sure_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        order_id: sessionStorage.getItem('order_id'),
        item_id: '5',
        params: {
            car_id: sessionStorage.getItem('car_id')//车辆id
        }
    }
    let array = [];
    $(".solve-trouble span").each(function () {
        if ($(this).hasClass("check-color2")) {
            array.push($(this).find("input").val())
        }
    });
    param.params.car_parts = array.toString();
    myAjax.post(getApiUrl('/vehicle-fault/operate'), param, function (data) {
        if (data.status == '0') {
            location.href = "./faultdetail.html";
        } else {
            new Toast(data.msg)
        }
    });
});
