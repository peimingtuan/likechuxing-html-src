/**
 * Created by Administrator on 2018/5/28.
 */
/**
 * Created by Administrator on 2017/12/20.
 */
require('../css/public.css')
require('../css/faultWork/myfaultlist.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../../../../component/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import Loading from '../../../../component/loading'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
var loading = new Loading()//加载loading
//初始化加载图片
$(".faultList li .img1").attr("src", require("../image/mapb.png"));//网点类型
$(".sort_content img").attr("src", require("../image/faultWork/duigou.png"));//排序对勾
$(".check-map img").attr("src", require("../image/faultWork/checkmapicon.png"));//查看地图网点
$(".check-chartmap img").attr("src", require("../image/faultWork/hoticon.png"));//查看热力图
//$(".faultlist-map").removeClass("none");
//初始化故障工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    city_id: sessionStorage.getItem('city_id'),//权限城市id
    is_mine:'1',//本人工单
    type_id: '',//故障一级分类
    cate_id: '',//故障二级分类
    up_type_id: '',//上报故障一级分类
    up_cate_id: '',//上报故障二级分类
    source: '-1',//上报来源 0运维1客服2系统 -1全部
    biz_type: '-1',//网点类型0:合作1:非合作 -1:全部
    sort: '1',//排序类型
    page: 1, //页数
    lng: '',
    lat: '',
    limit: '10',//每页显示数量
    status: [0, 1, 2]//处理状态
};

//手动固定父元素的高，否则scroll不起作用
$('.faultList').height($(window).height() - $('.faultlist-content').height());
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
    //钉钉获取定位
    dd.device.geolocation.get({
        targetAccuracy: 200,
        coordinate: 1,
        withReGeocode: false,
        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result) {
            //存储当前位置的经纬度
            sessionStorage.setItem('locationsLng', result.longitude);
            sessionStorage.setItem('locationsLat', result.latitude);
            param.lng = result.longitude;
            param.lat = result.latitude;
            show(param)
        },
        onFail: function (err) {
            new Toast("获取定位失败")
        }
    });
    //刷新页面
    $(".faultlistRefle").on("click", function () {
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: true,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                let param = {
                    mobile: sessionStorage.getItem('mobile'),
                    city_id: sessionStorage.getItem('city_id'),//权限城市id
                    is_mine:'1',//本人工单
                    type_id: '',//故障一级分类
                    cate_id: '',//故障二级分类
                    up_type_id: '',//上报故障一级分类
                    up_cate_id: '',//上报故障二级分类
                    source: '',//上报来源 0运维1客服2系统 -1全部
                    biz_type: '',//网点类型0:合作1:非合作 -1:全部
                    sort: '1',//排序类型
                    page: 1, //页数
                    lng: sessionStorage.getItem('locationsLng'),
                    lat: sessionStorage.getItem('locationsLat'),
                    limit: '10',//每页显示数量
                    status: []//处理状态
                }
                $(".confirm-carstate .color").each(function () {//处理状态
                    param.status.push($(this).find("input").val());
                    if ($(this).find("input").val() == '') {
                        param.status = [0, 1, 2];
                        return false;
                    }
                });

                $(".confirm-talkstyle input").each(function () {//单选上报类型
                    if ($(this).is(':checked')) {
                        param.source = $(this).val();
                        return false;
                    }
                });

                //处理故障类型
                $(".faulttype-list li").each(function () {
                    if ($(this).find("span").hasClass("font-color")) {
                        param.type_id = $(this).find("input").val()//一级分类id
                    }
                });
                $(".faultchoice-list li").each(function () {
                    if ($(this).find("span").hasClass("font-color")) {
                        param.cate_id = $(this).find("input").val()//二级分类id
                    }
                });
                //上报故障类型
                $(".faulttype-list2 li").each(function () {
                    if ($(this).find("span").hasClass("font-color")) {
                        param.up_type_id = $(this).find("input").val()//一级分类id
                    }
                });
                $(".faultchoice-list2 li").each(function () {
                    if ($(this).find("span").hasClass("font-color")) {
                        param.up_cate_id = $(this).find("input").val()//二级分类id
                    }
                });
                //获取排序信息
                $(".sort-list li").each(function () {
                    if ($(this).hasClass("sort-color")) {
                        param.sort = $(this).find("input").val();
                    }
                });
                show(param);
                new Toast("刷新成功")
            },
            onFail: function (err) {
                new Toast("获取定位失败")
            }
        });
    })
});
function show(param) {
    param.status = param.status.join(',');
    param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
    myAjax.post(getApiUrl('/vehicle-fault/order-list'), param, function (data) {
        if (data.status == '0') {
            loading.destroy()//清除loading
            let str = '';
            if (data.data.length == 0) {
                new Toast("暂无数据")
            } else {
                for (var i = 0; i < data.data.length; i++) {
                    let strstart = data.data[i].vin.substring(0, 11),
                        strend = data.data[i].vin.substring(11, 17),
                        type_name = '',
                        cate_name = '';
                    if (data.data[i].status == '0') {
                        type_name = data.data[i].up_type_name;
                        cate_name = data.data[i].up_cate_name;
                    } else {
                        type_name = data.data[i].type_name;
                        cate_name = data.data[i].cate_name;
                    }
                    str += '<li><input type="hidden" value="' + data.data[i].id + '" class="trouble-Id"/><input type="hidden" value="' + data.data[i].status + '" class="status"/><input type="hidden" class="step" value="' + data.data[i].step + '" /><span>' + data.data[i].plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>故障' + data.data[i].id + '</span><br/><span>' + data.data[i].status_name + '</span>' +
                        '<span>' + data.data[i].brand_name + ' ' + data.data[i].model_name + '</span><span>' + type_name + '-' + cate_name + '</span><br/>';
                    if (data.data[i].biz_type == '0') {//合作网点
                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].branch_name + '</span><br/>';
                    } else if (data.data[i].biz_type == '1') {//非合作网点
                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].branch_name + '</span><br/>';
                    }
                    str += '<span class="time">处理时长：<font>' + data.data[i].last_time + '</font></span><br/><span>备注：<font>' + data.data[i].remark + '</font></span></li>';
                }
            }
            $(".faultList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.faultList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/vehicle-fault/order-list'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.length; i++) {
                                    let strstart = data.data[i].vin.substring(0, 11),
                                        strend = data.data[i].vin.substring(11, 17),
                                        type_name = '',
                                        cate_name = '';
                                    if (data.data[i].status == '0') {
                                        type_name = data.data[i].up_type_name;
                                        cate_name = data.data[i].up_cate_name;
                                    } else {
                                        type_name = data.data[i].type_name;
                                        cate_name = data.data[i].cate_name;
                                    }
                                    str += '<li><input type="hidden" value="' + data.data[i].id + '" class="trouble-Id"/><input type="hidden" value="' + data.data[i].status + '" class="status"/><input type="hidden" class="step" value="' + data.data[i].step + '" /><span>' + data.data[i].plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>故障' + data.data[i].id + '</span><br/><span>' + data.data[i].status_name + '</span>' +
                                        '<span>' + data.data[i].brand_name + ' ' + data.data[i].model_name + '</span><span>' + type_name + '-' + cate_name + '</span><br/>';
                                    if (data.data[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].branch_name + '</span><br/>';
                                    } else if (data.data[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].branch_name + '</span><br/>';
                                    }
                                    str += '<span class="time">处理时长：<font>' + data.data[i].last_time + '</font></span><br/><span>备注：<font>' + data.data[i].remark + '</font></span></li>';
                                }
                                that.changeContent(str);
                                cb(true)
                            } else {
                                new Toast("暂无数据")
                            }
                        });
                    }, 400)
                },
                pullUpLoad: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        index++;
                        param.page = index + 1;
                        myAjax.post(getApiUrl('/vehicle-fault/order-list'), param, function (data) {
                            if (data.data.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < data.data.length; i++) {
                                    let strstart = data.data[i].vin.substring(0, 11),
                                        strend = data.data[i].vin.substring(11, 17),
                                        type_name = '',
                                        cate_name = '';
                                    if (data.data[i].status == '0') {
                                        type_name = data.data[i].up_type_name;
                                        cate_name = data.data[i].up_cate_name;
                                    } else {
                                        type_name = data.data[i].type_name;
                                        cate_name = data.data[i].cate_name;
                                    }
                                    str += '<li><input type="hidden" value="' + data.data[i].id + '" class="trouble-Id"/><input type="hidden" value="' + data.data[i].status + '" class="status"/><input type="hidden" class="step" value="' + data.data[i].step + '" /><span>' + data.data[i].plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>故障' + data.data[i].id + '</span><br/><span>' + data.data[i].status_name + '</span>' +
                                        '<span>' + data.data[i].brand_name + ' ' + data.data[i].model_name + '</span><span>' + type_name + '-' + cate_name + '</span><br/>';
                                    if (data.data[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].branch_name + '</span><br/>';
                                    } else if (data.data[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].branch_name + '</span><br/>';
                                    }
                                    str += '<span class="time">处理时长：<font>' + data.data[i].last_time + '</font></span><br/><span>备注：<font>' + data.data[i].remark + '</font></span></li>';
                                }
                                that.appendContent(str);
                                cb(true)
                            }
                        });
                    }, 400)
                }
            })
        } else {
            new Toast(data.msg)
        }
    });
}

//请求处理故障类型配置数据
var arraymenu = [],//存储类型配置一级数据的id
    arraysecond = [];//存储类型配置的二级数据
myAjax.post(getApiUrl('/vehicle-fault/fault-type'), {
    mobile: sessionStorage.getItem('mobile'),
}, function (data) {
    if (data.status == '0') {
        let str = '<li class="li-first"><span class="font-color">全部</span><img class="" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value=""/></li>';
        for (var i = 0; i < data.data.length; i++) {
            arraymenu.push(data.data[i].id);
            arraysecond.push(data.data[i].child);
            str += '<li><span>' + data.data[i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + data.data[i].id + '"/></li>';
        }
        $(".faulttype-list").html(str);
    } else {
        new Toast(data.msg)
    }
});

//跳转搜索页
$(".faultlistSelect").on("click", function () {
    window.location.href = "../../manageOrderMain/index.html#/list";
});
//排序弹框
$(".faultlistSort").on("click", function () {
    $(".sort_window").removeClass("none");
});

//记录打开弹框前已筛选的值
var colorArray = [],
    readioArray = [],
    colorArray2 = [],
    colorArray3 = [],
    colorArray_2 = [],
    colorArray_3 = [],
    choice_type = '',
    choice = '',
    choice_type2 = '',
    choice2 = '';
//打开筛选弹框
$(".faultlistFilter").on("click", function () {
    colorArray = [];
    colorArray2 = [];
    colorArray3 = [];
    readioArray = [];
    colorArray_2 = [];
    colorArray_3 = [];
    choice_type = $(".choice-type").text();
    choice = $(".choice").text();
    choice_type2 = $(".choice-type2").text();
    choice2 = $(".choice2").text();
    $(".confirm-carstate span").each(function () {//多选框
        if ($(this).hasClass("color")) {
            colorArray.push($(this));
        }
    });
    $(".readios input").each(function () {//单选框
        if ($(this).is(':checked')) {
            readioArray.push($(this));
        }
    });
    $(".faulttype-list li").each(function () {//一级菜单
        if ($(this).find("span").hasClass("font-color")) {
            colorArray2.push($(this));
        }
    });
    $(".faultchoice-list li").each(function () {//二级菜单
        if ($(this).find("span").hasClass("font-color")) {
            colorArray3.push($(this));
        }
    });
    $(".faulttype-list2 li").each(function () {//一级菜单
        if ($(this).find("span").hasClass("font-color")) {
            colorArray_2.push($(this));
        }
    });
    $(".faultchoice-list2 li").each(function () {//二级菜单
        if ($(this).find("span").hasClass("font-color")) {
            colorArray_3.push($(this));
        }
    });
    $(".faultlist_window").removeClass("none");
});
//关闭筛选弹框
$(".close-faultlist").on("click", function () {
    $(".confirm-carstate span").removeClass("color");
    for (var i = 0; i < colorArray.length; i++) {
        colorArray[i].addClass("color");
    }
    for (var i = 0; i < readioArray.length; i++) {
        readioArray[i].prop("checked", true);
        if (readioArray[i].hasClass("talkstyle") && readioArray[i].val() == '-1') {
            $(".faulttype-report").addClass("none");
        }
    }
    $(".faulttype-list li").find("span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    for (var i = 0; i < colorArray2.length; i++) {//一级菜单
        colorArray2[i].find("span").addClass("font-color");
        colorArray2[i].find("img").removeClass("none");
    }
    $(".faultchoice-list li").find("span").removeClass("font-color");
    $(".faultchoice-list li img").addClass("none");
    for (var i = 0; i < colorArray3.length; i++) {//二级菜单
        colorArray3[i].find("span").addClass("font-color");
        colorArray3[i].find("img").removeClass("none");
    }
    $(".faulttype-list2 li").find("span").removeClass("font-color");
    $(".faulttype-list2 li img").addClass("none");
    for (var i = 0; i < colorArray_2.length; i++) {//一级菜单
        colorArray_2[i].find("span").addClass("font-color");
        colorArray_2[i].find("img").removeClass("none");
    }
    $(".faultchoice-list2 li").find("span").removeClass("font-color");
    $(".faultchoice-list2 li img").addClass("none");
    for (var i = 0; i < colorArray_3.length; i++) {//二级菜单
        colorArray_3[i].find("span").addClass("font-color");
        colorArray_3[i].find("img").removeClass("none");
    }
    $(".faulttype-list").addClass("none");
    $(".faultchoice-list").addClass("none");
    $(".faulttype").addClass("none");
    $(".faulttype-list2").addClass("none");
    $(".faultchoice-list2").addClass("none");
    $(".faulttype2").addClass("none");
    $(".faultlist_window").addClass("none");
    $(".choice-type").text(choice_type);
    $(".choice").text(choice);
    $(".choice-type2").text(choice_type2);
    $(".choice2").text(choice2);
})

//点击确定按钮关闭弹框
$(".carstate-sure").on("click", function () {
    choice_type = $(".choice-type").text();
    choice = $(".choice").text();
    $(".faulttype-list").addClass("none");
    $(".faultchoice-list").addClass("none");
    choice_type2 = $(".choice-type2").text();
    choice2 = $(".choice2").text();
    $(".faulttype-list2").addClass("none");
    $(".faultchoice-list2").addClass("none");
    $(".faulttype").addClass("none");
    $(".faulttype2").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        is_mine:'1',//本人工单
        type_id: '',//故障一级分类
        cate_id: '',//故障二级分类
        up_type_id: '',//上报故障一级分类
        up_cate_id: '',//上报故障二级分类
        source: '',//上报来源 0运维1客服2系统 -1全部
        biz_type: '',//网点类型0:合作1:非合作 -1:全部
        sort: '1',//排序类型
        page: 1, //页数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat'),
        limit: '10',//每页显示数量
        status: []//处理状态
    }
    $(".confirm-carstate .color").each(function () {//多选处理状态
        param.status.push($(this).find("input").val());
        if ($(this).find("input").val() == '') {
            param.status = [0, 1, 2];
            return false;
        }
    });
    $(".confirm-netstyle input").each(function () {//单选网点类型
        if ($(this).is(':checked')) {
            param.biz_type = $(this).val();
            return false;
        }
    });
    $(".confirm-talkstyle input").each(function () {//单选上报类型
        if ($(this).is(':checked')) {
            param.source = $(this).val();
            return false;
        }
    });

    //处理故障类型
    $(".faulttype-list li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.type_id = $(this).find("input").val()//一级分类id
        }
    });
    $(".faultchoice-list li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.cate_id = $(this).find("input").val()//二级分类id
        }
    });
    //上报故障类型
    $(".faulttype-list2 li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.up_type_id = $(this).find("input").val()//一级分类id
        }
    });
    $(".faultchoice-list2 li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.up_cate_id = $(this).find("input").val()//二级分类id
        }
    });
    //获取排序信息
    $(".sort-list li").each(function () {
        if ($(this).hasClass("sort-color")) {
            param.sort = $(this).find("input").val();
        }
    });
    show(param);
    $(".faultlist_window").addClass("none");
})

//点击选项变换颜色
$(".state").on("click", function () {
    if ($(".confirm-carstate .color").length > 1) {
        if ($(this).hasClass("color")) {
            $(this).removeClass("color");
        } else {
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allcarstate").removeClass("color");
});
//点击重置按钮
$(".carstate-reset").on("click", function () {
    $(".state").removeClass("color");
    $(".allcarstate").addClass("color");
    $(".readios .all").prop("checked", true);
    $(".faulttype-report").addClass("none");
    //一级菜单
    $(".faulttype-list li").find("span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faulttype-list .li-first").find("span").addClass("font-color");
    $(".faulttype-list .li-first img").removeClass("none");
    //二级菜单
    $(".faultchoice-list").html('<li><span class="font-color">全部</span><img class="" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value=""/></li>');
    reporttrouble(1);
    $(".faultchoice-list2").html('<li><span class="font-color">全部</span><img class="" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value=""/></li>');
    $(".choice-type").text("全部");
    $(".choice").text("全部");
    $(".choice-type2").text("全部");
    $(".choice2").text("全部");
    $(".faulttype").addClass("none");
    $(".faulttype2").addClass("none");
});
//点击全部
$(".allcarstate").on("click", function () {
    $(".state").removeClass("color");
    $(this).addClass("color");
});
//关闭排序弹框
$(".close-sort").on("click", function () {
    $(".sort_window").addClass("none");
});
//距离网点从近到远排序
$(".range-sort").on("click", function () {
    $(this).addClass("sort-color");
    $(this).find("img").removeClass("none");
    $(".timenum-sort").removeClass("sort-color");
    $(".timenum-sort img").addClass("none");
    $(".sort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        is_mine:'1',//本人工单
        type_id: '',//故障一级分类
        cate_id: '',//故障二级分类
        up_type_id: '',//上报故障一级分类
        up_cate_id: '',//上报故障二级分类
        source: '',//上报来源 0运维1客服2系统 -1全部
        biz_type: '',//网点类型0:合作1:非合作 -1:全部
        sort: '1',//排序类型
        page: 1, //页数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat'),
        limit: '10',//每页显示数量
        status: []//处理状态
    }
    $(".confirm-carstate .color").each(function () {//处理状态
        param.status.push($(this).find("input").val());
        if ($(this).find("input").val() == '') {
            param.status = [0, 1, 2];
            return false;
        }
    });

    $(".confirm-talkstyle input").each(function () {//单选上报类型
        if ($(this).is(':checked')) {
            param.source = $(this).val();
            return false;
        }
    });

    //处理故障类型
    $(".faulttype-list li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.type_id = $(this).find("input").val()//一级分类id
        }
    });
    $(".faultchoice-list li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.cate_id = $(this).find("input").val()//二级分类id
        }
    });
    //上报故障类型
    $(".faulttype-list2 li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.up_type_id = $(this).find("input").val()//一级分类id
        }
    });
    $(".faultchoice-list2 li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.up_cate_id = $(this).find("input").val()//二级分类id
        }
    });
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});
//处理时长从大到小
$(".timenum-sort").on("click", function () {
    $(this).addClass("sort-color");
    $(this).find("img").removeClass("none");
    $(".range-sort").removeClass("sort-color");
    $(".range-sort img").addClass("none");
    $(".sort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        is_mine:'1',//本人工单
        type_id: '',//故障一级分类
        cate_id: '',//故障二级分类
        up_type_id: '',//上报故障一级分类
        up_cate_id: '',//上报故障二级分类
        source: '',//上报来源 0运维1客服2系统 -1全部
        biz_type: '',//网点类型0:合作1:非合作 -1:全部
        sort: '1',//排序类型
        page: 1, //页数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat'),
        limit: '10',//每页显示数量
        status: []//处理状态
    }
    $(".confirm-carstate .color").each(function () {//处理状态
        param.status.push($(this).find("input").val());
        if ($(this).find("input").val() == '') {
            param.status = [0, 1, 2];
            return false;
        }
    });

    $(".confirm-talkstyle input").each(function () {//单选上报类型
        if ($(this).is(':checked')) {
            param.source = $(this).val();
            return false;
        }
    });

    //处理故障类型
    $(".faulttype-list li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.type_id = $(this).find("input").val()//一级分类id
        }
    });
    $(".faultchoice-list li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.cate_id = $(this).find("input").val()//二级分类id
        }
    });
    //上报故障类型
    $(".faulttype-list2 li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.up_type_id = $(this).find("input").val()//一级分类id
        }
    });
    $(".faultchoice-list2 li").each(function () {
        if ($(this).find("span").hasClass("font-color")) {
            param.up_cate_id = $(this).find("input").val()//二级分类id
        }
    });
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});
//一级菜单
$(".faulttype-list").on("click", "li", function () {
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(this).find("span").addClass("font-color");
    $(this).find("img").removeClass("none");
    $(".choice-type").text($(this).find("span").text());
    $(".choice").text("全部");
    //获取对应的二级菜单数据
    let str = '<li><span class="font-color">全部</span><img class="" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value=""/></li>';
    if ($(this).find("input").val() != '') {
        let index = arraymenu.indexOf($(this).find("input").val());
        for (var i = 0; i < arraysecond[index].length; i++) {
            str += '<li><span>' + arraysecond[index][i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + arraysecond[index][i].id + '"/></li>';
        }
    }
    $(".faultchoice-list").html(str);
});
//二级菜单
$(".faultchoice-list").on("click", "li", function () {
    $(".faultchoice-list li span").removeClass("font-color");
    $(".faultchoice-list li img").addClass("none");
    $(this).find("span").addClass("font-color");
    $(this).find("img").removeClass("none");
    $(".choice").text($(this).find("span").text());
    $(".faulttype-list").addClass("none");
    $(".faultchoice-list").addClass("none");
    $(".faulttype").addClass("none");//关闭二次弹框
});

//跳转详情页面
$(".faultList").on("click", "li", function () {
    //存储故障工单id
    sessionStorage.setItem("order_id", $(this).find(".trouble-Id").val());
    if ($(this).find(".status").val() == '2') {
        location.href = "./faultend.html"
    } else if ($(this).find(".status").val() == '0') {
        location.href = "./faultdetail2.html"
    } else if ($(this).find(".status").val() == '1') {
        if($(this).find(".step").val() == '2'){
            location.href = "./faultwork.html"
        }else if($(this).find(".step").val() > 2){
            location.href = "./faultdetail.html"
        }else{
            location.href = "./faultdetail2.html"
        }
    }
});

//处理故障类型筛选优化
$(".content .bold").on("click", function () {
    $(".faulttype2").addClass("none");
    $(".faulttype").removeClass("none");//打开一次弹框
    $(".faulttype-list").removeClass("none");
    $(".faultchoice-list").removeClass("none");
});

//查看地图网点
$(".check-map").on("click", function () {
     window.location.href = "./searchfaultmap.html";
});

//查看地图热力图
$(".check-chartmap").on("click", function () {
     window.location.href = "./chartmap.html";
});


//上报故障类型
//请求上报故障类型配置数据
var arraymenu2 = [],//存储类型配置一级数据的id
    arraysecond2 = [];//存储类型配置的二级数据
function reporttrouble(type) {
    arraymenu2 = [];
    arraysecond2 = [];//清空数据
    myAjax.post(getApiUrl('/vehicle-fault/fault-type'), {
        mobile: sessionStorage.getItem('mobile'),
        type: type
    }, function (data) {
        if (data.status == '0') {
            let str = '<li class="li-first"><span class="font-color">全部</span><img class="" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value=""/></li>';
            for (var i = 0; i < data.data.length; i++) {
                arraymenu2.push(data.data[i].id);
                arraysecond2.push(data.data[i].child);
                str += '<li><span>' + data.data[i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + data.data[i].id + '"/></li>';
            }
            $(".faulttype-list2").html(str);
        } else {
            new Toast(data.msg)
        }
    });
}
//上报故障类型筛选优化
$(".content2 .bold").on("click", function () {
    $(".faulttype").addClass("none");
    $(".faulttype2").removeClass("none");//打开二次弹框
    $(".faulttype-list2").removeClass("none");
    $(".faultchoice-list2").removeClass("none");
});

//一级菜单
$(".faulttype-list2").on("click", "li", function () {
    $(".faulttype-list2 li span").removeClass("font-color");
    $(".faulttype-list2 li img").addClass("none");
    $(this).find("span").addClass("font-color");
    $(this).find("img").removeClass("none");
    $(".choice-type2").text($(this).find("span").text());
    $(".choice2").text("全部");
    //获取对应的二级菜单数据
    let str = '<li><span class="font-color">全部</span><img class="" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value=""/></li>';
    if ($(this).find("input").val() != '') {
        let index = arraymenu2.indexOf($(this).find("input").val());
        for (var i = 0; i < arraysecond2[index].length; i++) {
            str += '<li><span>' + arraysecond2[index][i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + arraysecond2[index][i].id + '"/></li>';
        }
    }
    $(".faultchoice-list2").html(str);
    // $(".faultchoice-list2").removeClass("none")
});
//二级菜单
$(".faultchoice-list2").on("click", "li", function () {
    $(".faultchoice-list2 li span").removeClass("font-color");
    $(".faultchoice-list2 li img").addClass("none");
    $(this).find("span").addClass("font-color");
    $(this).find("img").removeClass("none");
    $(".choice2").text($(this).find("span").text());
    $(".faulttype-list2").addClass("none");
    $(".faultchoice-list2").addClass("none");
    $(".faulttype2").addClass("none");//关闭二次弹框
});


//上报来源筛选
$(".confirm-talkstyle input").on("click", function () {
    if ($(this).val() == '-1') {
        $(".faulttype-report").addClass("none");
    } else {
        $(".faulttype-report").removeClass("none");
        reporttrouble(Number($(this).val()) + 2);
    }
    $(".choice-type2").text("全部");
    $(".choice2").text("全部");
    $(".faultchoice-list2").html('');
    $(".faultchoice-list2").addClass("none");
});


//ios返回异常处理
var userAgent = navigator.userAgent,
    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (isiOS) {
    $(".faulttype-report").addClass("none");
    $(".readios .all").prop("checked", true);
}
