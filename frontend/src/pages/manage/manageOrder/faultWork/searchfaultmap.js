require('../css/public.css')
require('../css/faultWork/searchfaultmap.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//初始化加载图片
$(".current_location2 img").attr("src", require("../image/mapfg.png"));//定位icon
$(".refure-faultmap img").attr("src", require("../image/refre-icon.png"));//刷新
$(".navition-bottom .right img").attr("src", require('../image/dispatch/navition-icon.png'));
//接收url参数
var branch_id = FoundationTools.getUrlParam('branch_id'),
    name = FoundationTools.getUrlParam('name'),
    lng = FoundationTools.getUrlParam('lng'),
    lat = FoundationTools.getUrlParam('lat');
var loading = new Loading()//加载loading
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
dd.ready(function () {
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
            var map = new AMap.Map('faultmap-map', {
                resizeEnable: true,
                zoom: 13,
                center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
            });

        //初始化加载数据
            var param = {
                mobile: sessionStorage.getItem('mobile'),
                type_id: '',//故障一级分类
                cate_id: '',//故障二级分类
                up_type_id: '',//上报故障一级分类
                up_cate_id: '',//上报故障二级分类
                source: '-1',//上报来源 0运维1客服2系统 -1全部
                biz_type: '-1',//网点类型0:合作1:非合作 -1:全部
                lng: sessionStorage.getItem('locationsLng'),
                lat: sessionStorage.getItem('locationsLat'),
                status: '-1'//处理状态
            }
            if (name) {//来自搜索页面
                param.lng = lng;
                param.lat = lat;
                map.panTo([param.lng, param.lat])
            }
            var Array = [],
                faultnum=0,//故障网点数量
                faultnetid=1,
                smallicon = [],//存放小图标
                bigicon = [];//存放大图标
            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                var positionPicker = new PositionPicker({
                    position: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')],
                    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    iconStyle: {//自定义外观
                        url: require("../image/location.png"),//图片地址
                        size: [25, 50],  //要显示的点大小，将缩放图片
                        ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                    },
                    map: map
                });
                positionPicker.on('success', function (positionResult) {
                    param.lng = positionResult.position.lng;
                    param.lat = positionResult.position.lat;
                    netshow(param)
                });
                positionPicker.start();
            });

            function netshow(param) {
                myAjax.post(getApiUrl('/vehicle-fault/map-branch'), param, function (data) {
                    let result = data.data;
                    if (data.status == '0') {
                        // 使用clearMap方法删除所有覆盖物
                        map.clearMap();
                        Array = [];
                        smallicon = [];
                        bigicon = [];
                        faultnum++;
                        loading.destroy()//清除loading
                        if (result.length != '0') {
                            // $(".navition-bottom").addClass("none");
                            for (var i = 0; i < result.length; i++) {
                                let netpoint = [result[i].lng, result[i].lat];//当前网点位置信息
                                Array.push(netpoint);
                                addMarker(netpoint, result[i].num, result[i].biz_type, result[i].id);//小图标
                                addMarkerbig(netpoint, result[i].num, result[i].biz_type, result[i].id);//大图标
                                if (branch_id) {
                                    if( branch_id==result[i].id){
                                        faultnetid=2;
                                    }
                                }
                            }
                            if (branch_id) {
                                if( faultnum=='1'){
                                    if(faultnetid==1){
                                        new Toast("该网点没有故障车辆")
                                    }
                                }
                            }
                            //map.setFitView();
                        } else {
                            new Toast("附近十公里内没有停车网点");
                            //$(".navition-bottom").addClass("none");
                        }
                    } else {
                        new Toast(data.msg);
                    }
                    // 编写自定义函数,创建小图标标注
                    function addMarker(netpoint, num, biz_type, id) {
                        let classtype = '';
                        if (biz_type == '0') {//合作网点
                            classtype = 'marker-route2';
                        } else {//非合作网点
                            classtype = 'marker-route';
                        }
                        let marker = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + num + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        smallicon.push(marker);//存放小图标
                        if (branch_id) {
                            if (branch_id == id) {
                                marker.hide();
                            }
                        }
                        marker.on('touchend', function () {
                            for (let j = 0, len = smallicon.length; j < len; j++) {
                                smallicon[j].show();
                            }
                            let that = this;
                            that.hide();
                            let index = smallicon.indexOf(that);
                            for (let i = 0, len = smallicon.length; i < len; i++) {
                                bigicon[i].hide();
                            }
                            bigicon[index].show();
                            //$(".navition-bottom .net").text(branch_name);
                            //$(".navition-bottom .net_id").val(net_id);
                            //$(".navition-bottom .biz_type").val(biz_type);
                            //$(".navition-bottom .address").text(address);
                            //$(".navition-bottom .lng").val(netpoint[0]);
                            //$(".navition-bottom .lat").val(netpoint[1]);
                            //$(".navition-bottom").removeClass("none");
                        });
                    }

                    // 编写自定义函数,创建大图标标注
                    function addMarkerbig(netpoint, num, biz_type, id) {
                        let classtype = '';
                        if (biz_type == '0') {//合作网点
                            classtype = 'bigmarker-route2';
                        } else {//非合作网点
                            classtype = 'bigmarker-route';
                        }
                        let marker2 = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + num + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        bigicon.push(marker2);//存放大图标
                        marker2.hide();
                        if (branch_id) {
                            if (branch_id == id) {
                                marker2.show();
                            }
                        }
                        marker2.on('click', function () {

                        });
                    }
                });
            }

            //导航
            var driving;
            AMap.plugin(["AMap.Driving"], function () {
                var drivingOption = {
                    policy: AMap.DrivingPolicy.LEAST_TIME,
                    map: ''
                };
                driving = new AMap.Driving(drivingOption); //构造驾车导航类
            });
            //根据起终点坐标规划驾车路线
            $(".navition-icon").on("click", function () {
                driving.search(
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [$(this).parent().find(".lng").val(), $(this).parent().find(".lat").val()],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            });
            //定位
            $(".current_location2").on("click", function () {
                map.panTo([sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]);
            });

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
            $(".faultmap-search .filter").on("click", function () {
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
                    if(readioArray[i].hasClass("talkstyle")&&readioArray[i].val()=='-1'){
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
                $(".confirm-carstate span").each(function () {//单选处理状态
                    if ($(this).hasClass("color")) {
                        param.status = $(this).find("input").val();
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
                netshow(param)
                $(".faultlist_window").addClass("none");
            })

            //点击选项变换颜色
            $(".confirm-carstate").on("click", "span", function () {
                $(".confirm-carstate span").removeClass("color");
                $(this).addClass("color");
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
            //处理故障类型筛选优化
            $(".content .bold").on("click", function () {
                $(".faulttype2").addClass("none");
                $(".faulttype").removeClass("none");//打开一次弹框
                $(".faulttype-list").removeClass("none");
                $(".faultchoice-list").removeClass("none");
            });

        //上报故障类型
        //请求上报故障类型配置数据
            var arraymenu2 = [],//存储类型配置一级数据的id
                arraysecond2 = [];//存储类型配置的二级数据
            function reporttrouble(type) {
                arraymenu2=[];
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
                $(".faultchoice-list2").removeClass("none")
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


        },
        onFail: function (err) {
            new Toast("获取当前定位失败")
        }
    });
});

//跳转搜索网点页面
$(".net-enter").on("click", function () {
    window.location.href = "./searchfaultnet.html";
});

//刷新页面
$(".refure-faultmap").on("click", function () {
    window.location.reload();
});

//ios返回异常处理
var userAgent = navigator.userAgent,
    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (isiOS) {
    $(".faulttype-report").addClass("none");
    $(".readios .all").prop("checked",true);
}