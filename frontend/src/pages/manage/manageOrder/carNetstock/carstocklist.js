/**
 * Created by Administrator on 2018/5/28.
 */
/**
 * Created by Administrator on 2017/12/20.
 */
require('../css/public.css')
require('../css/carNetstock/carstocklist.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import Loading from '../../../../component/loading'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
dd.error(function (error) {
    new Toast("钉钉授权失败，请关闭页面重新打开")
});
var loading = new Loading()//加载loading
//初始化加载图片
$(".netstockList li .img1").attr("src", require("../image/mapb.png"));//网点类型
$(".netstockList li .img2").attr("src", require("../image/carNetstock/daohang.png"));//导航
$(".sort_content img").attr("src", require("../image/carNetstock/duigou.png"));//排序对勾
//初始化列表接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    city_id: sessionStorage.getItem('city_id'),//权限城市id
    sort: '1',//排序类型
    page: 1, //页数
    car_num: '0',//超车数量
    lng: '',
    lat: '',
    property: [2],//网点属性
    biz_type: [-1]//网点类型
};

//手动固定父元素的高，否则scroll不起作用
$('.netstockList').height($(window).height() - $('.netstock-content').height()-$('.maps').height()-20);
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
            new Toast("钉钉获取定位失败")
        }
    });
    //刷新页面
    $(".netstockContentRefle").on("click", function () {
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            city_id: sessionStorage.getItem('city_id'),//权限城市id
            sort: '1',//排序类型
            page: 1, //页数
            car_num: '0',//超车数量
            lng: '',
            lat: '',
            property: [],//网点属性
            biz_type: []//网点类型
        }
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
                $(".confirm-carstate .color").each(function () {//超车数量
                    param.car_num = $(this).find("input").val();
                });
                $(".confirm-carnetstate .color").each(function () {//网点类型
                    param.biz_type.push($(this).find("input").val());
                });
                $(".confirm-carnetstate2 .color").each(function () {//网点属性
                    param.property.push($(this).find("input").val());
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
                new Toast("钉钉获取定位失败")
            }
        });
    })
});

function show(param) {
    param.property = param.property.join(',');
    param.biz_type = param.biz_type.join(',');
    param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
    myAjax.post(getApiUrl('/branch-car-stock/branch'), param, function (data) {
        if (data.status == '0') {
            loading.destroy()//清除loading
            let str = '';
            if(data.data.length==0){
                new Toast("暂无数据")
            }else{
                for (var i = 0; i < data.data.length; i++) {
                    str += '<li class="netlist"><input type="hidden" value="' + data.data[i].id + '" class="net-Id"/><input type="hidden" value="' + data.data[i].lng + '" class="lng"/><input type="hidden" value="' + data.data[i].lat + '" class="lat"/><input type="hidden" value="' + data.data[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data[i].current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data[i].address + '" class="address"/><span>' + data.data[i].name + '</span><br/><span class="netlocation"><span class="circle"></span>当前车辆<font>' + data.data[i].current_counts + '</font>台</span>' +
                        '<span><span class="circle"></span>已超车：<font>' + data.data[i].over_counts + '</font>台</span><br/>';
                    if (data.data[i].biz_type == '0') {//合作网点
                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                    } else if (data.data[i].biz_type == '1') {//非合作网点
                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                    }
                    str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
                }
            }
            $(".netstockList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.netstockList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/branch-car-stock/branch'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.length; i++) {
                                    str += '<li class="netlist"><input type="hidden" value="' + data.data[i].id + '" class="net-Id"/><input type="hidden" value="' + data.data[i].lng + '" class="lng"/><input type="hidden" value="' + data.data[i].lat + '" class="lat"/><input type="hidden" value="' + data.data[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data[i].current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data[i].address + '" class="address"/><span>' + data.data[i].name + '</span><br/><span class="netlocation"><span class="circle"></span>当前车辆<font>' + data.data[i].current_counts + '</font>台</span>' +
                                        '<span><span class="circle"></span>已超车：<font>' + data.data[i].over_counts + '</font>台</span><br/>';
                                    if (data.data[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    } else if (data.data[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    }
                                    str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
                                }
                                that.changeContent(str);
                                cb(true)
                            }else{
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
                        myAjax.post(getApiUrl('/branch-car-stock/branch'), param, function (data) {
                            if (data.data.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < data.data.length; i++) {
                                    str += '<li class="netlist"><input type="hidden" value="' + data.data[i].id + '" class="net-Id"/><input type="hidden" value="' + data.data[i].lng + '" class="lng"/><input type="hidden" value="' + data.data[i].lat + '" class="lat"/><input type="hidden" value="' + data.data[i].biz_type + '" class="biz_type"/><input type="hidden" value="' + data.data[i].current_counts + '" class="current_counts"/><input type="hidden" value="' + data.data[i].address + '" class="address"/><span>' + data.data[i].name + '</span><br/><span class="netlocation"><span class="circle"></span>当前车辆<font>' + data.data[i].current_counts + '</font>台</span>' +
                                        '<span><span class="circle"></span>已超车：<font>' + data.data[i].over_counts + '</font>台</span><br/>';
                                    if (data.data[i].biz_type == '0') {//合作网点
                                        str += '<span><img src="' + require("../image/mapb.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    } else if (data.data[i].biz_type == '1') {//非合作网点
                                        str += '<span><img src="' + require("../image/map-B.png") + '" class="img1"/>' + data.data[i].address + '</span>';
                                    }
                                    str += '<span class="navigation-icon"><img src="' + require("../image/carNetstock/daohang.png") + '" class="img2"/>导航</span></li>';
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
    //跳转当前网点车辆库存页
    $(".netstockList").on("click", "li", function () {
        window.location.href = "./netdetail.html?branch_id=" + $(this).find(".net-Id").val() + "&lng=" + $(this).find(".lng").val() + "&lat=" + $(this).find(".lat").val() + "&biz_type=" + $(this).find(".biz_type").val() + "&current_counts=" + $(this).find(".current_counts").val() + "&address=" + $(this).find(".address").val();
    });
    //跳转导航页面
    $(".netstockList").on("click", ".navigation-icon", function (event) {
        event.stopPropagation();//阻止事件冒泡
        window.location.href = "./netlocation.html?branch_id=" + $(this).parent().find(".net-Id").val();
    });
}
//跳转搜索页
$(".netstockContentSelect").on("click", function () {
    window.location.href = './netselect.html'
});
//排序弹框
$(".netstockSort").on("click", function () {
    $(".sort_window").removeClass("none");
});
//记录打开弹框前已筛选的值
var colorArray = [];
//打开筛选弹框
$(".netstockContentFilter").on("click", function () {
    colorArray = [];
    $(".confirm-carstock span").each(function () {
        if ($(this).hasClass("color")) {
            colorArray.push($(this));
        }
    });
    $(".carstock_window").removeClass("none");
});
//关闭筛选弹框
$(".close-carstock").on("click", function () {
    $(".confirm-carstock span").removeClass("color");
    for (var i = 0; i < colorArray.length; i++) {
        colorArray[i].addClass("color");
    }
    $(".carstock_window").addClass("none");
})

//点击确定按钮关闭弹框
$(".carstate-sure").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        sort: '1',//排序类型
        page: 1, //页数
        car_num: '0',//超车数量
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat'),
        property: [],//网点属性
        biz_type: []//网点类型
    }
    $(".confirm-carstate .color").each(function () {//超车数量
        param.car_num = $(this).find("input").val();
    });
    $(".confirm-carnetstate .color").each(function () {//网点类型
        param.biz_type.push($(this).find("input").val());
    });
    $(".confirm-carnetstate2 .color").each(function () {//网点属性
        param.property.push($(this).find("input").val());
    });
    //获取排序信息
    $(".sort-list li").each(function () {
        if ($(this).hasClass("sort-color")) {
            param.sort = $(this).find("input").val();
        }
    });
    show(param);
    $(".carstock_window").addClass("none");
})
//点击选项变换颜色
$(".state").on("click", function () {
    if ($(".confirm-carstate .color").length > 0) {
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
$(".nettype").on("click", function () {
    if ($(".confirm-carnetstate .color").length > 1) {
        if ($(this).hasClass("color")) {
            $(this).removeClass("color");
        } else {
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allnettype").removeClass("color");
});
$(".nettype2").on("click", function () {
    if ($(".confirm-carnetstate2 .color").length > 1) {
        if ($(this).hasClass("color")) {
            $(this).removeClass("color");
        } else {
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allnettype2").removeClass("color");
});

//点击重置按钮
$(".carstate-reset").on("click", function () {
    $(".nettype").removeClass("color");
    $(".allnettype").addClass("color");
    $(".nettype2").removeClass("color");
    $(".allnettype2").addClass("color");
    $(".state").removeClass("color");
    $(".allcarstate").addClass("color");
});
//点击全部
$(".allcarstate").on("click", function () {
    $(".state").removeClass("color");
    $(this).addClass("color");
});
$(".allnettype").on("click", function () {
    $(".nettype").removeClass("color");
    $(this).addClass("color");
});
$(".allnettype2").on("click", function () {
    $(".nettype2").removeClass("color");
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
    $(".num-sort").removeClass("sort-color");
    $(".num-sort img").addClass("none");
    $(".sort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        sort: '1',//排序类型
        page: 1, //页数
        car_num: '',//超车数量
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat'),
        property: [],//网点属性
        biz_type: []//网点类型
    }
    $(".confirm-carstate .color").each(function () {//超车数量
        param.car_num = $(this).find("input").val();
    });
    $(".confirm-carnetstate .color").each(function () {//网点类型
        param.biz_type.push($(this).find("input").val());
    });
    $(".confirm-carnetstate2 .color").each(function () {//网点属性
        param.property.push($(this).find("input").val());
    });
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});
//超车数量从大到小
$(".num-sort").on("click", function () {
    $(this).addClass("sort-color");
    $(this).find("img").removeClass("none");
    $(".range-sort").removeClass("sort-color");
    $(".range-sort img").addClass("none");
    $(".sort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        sort: '1',//排序类型
        page: 1, //页数
        car_num: '',//超车数量
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat'),
        property: [],//网点属性
        biz_type: []//网点类型
    }
    $(".confirm-carstate .color").each(function () {//超车数量
        param.car_num = $(this).find("input").val();
    });
    $(".confirm-carnetstate .color").each(function () {//网点类型
        param.biz_type.push($(this).find("input").val());
    });
    $(".confirm-carnetstate2 .color").each(function () {//网点属性
        param.property.push($(this).find("input").val());
    });
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});
//查看网点地图
$('.maps p').on("click", function () {
    window.location.href = '../../endwork/index.html#/netcarmap';
})
