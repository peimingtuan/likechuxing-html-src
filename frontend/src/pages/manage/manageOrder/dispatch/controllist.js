/**
 * Created by Administrator on 2018/5/28.
 */
/**
 * Created by Administrator on 2017/12/20.
 */
require('../css/public.css')
require('../css/dispatch/controllist.css')
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
ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
var loading = new Loading()//加载loading
//初始化加载图片
$(".control_bottom img").attr("src", require('../image/dispatch/close-btn.png'));
$(".controlsort-list img").attr("src", require('../image/dispatch/duigou.png'));
//初始化调度列表接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    city_id: sessionStorage.getItem('city_id'),//权限城市id
    sort: '1',//排序
    page: 1,//页数
    complete_status:[],//完成状态
    lng: '',
    lat: ''
};
//手动固定父元素的高，否则scroll不起作用
$('.controlList').height($(window).height() - $('.controlist-content').height());
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
            param.lng=result.longitude;
            param.lat=result.latitude;
            show(param)
        },
        onFail: function (err) {
            new Toast("钉钉获取当前定位失败")
        }
    });
    //刷新页面
    $(".controlContentRefle").on("click", function () {
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            city_id: sessionStorage.getItem('city_id'),//权限城市id
            sort: '1',//排序类型
            page: 1, //页数
            complete_status:[],//完成状态
            lng: '',
            lat: ''
        }
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
                param.lng=result.longitude;
                param.lat=result.latitude;
                //获取排序信息
                $(".controlsort-list li").each(function () {
                    if ($(this).hasClass("controlsort-color")) {
                        param.sort = $(this).find("input").val();
                    }
                });
                $(".confirm-carstate .color").each(function () {//完成状态
                    param.complete_status.push($(this).find("input").val());
                });
                show(param);
                new Toast("刷新成功")
            },
            onFail: function (err) {
                new Toast("钉钉获取当前定位失败")
            }
        });
    });
});
function show(param) {
    param.complete_status = param.complete_status.join(',');
    param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
    myAjax.post(getApiUrl('/car-dispatch/dispatch-list'), param, function (data) {
        if (data.status == '0') {
            loading.destroy()//清除loading
            let str = '';
            for (var i = 0; i < data.data.length; i++) {
                str += '<li><div class="div1"> <span class="net-id">' + data.data[i].branch_id + '</span><br/><span>' + data.data[i].branch_name + '</span></div>' +
                    '<div class="div2"><span>' + data.data[i].lin_recommend_car + '</span><br/><span class="advise">建议</span></div><div class="div3"><span>' + data.data[i].dispatch_num + '</span><br/><span class="need-dispatch">需调入</span></div></li>';
            }
            $(".controlList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.controlList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/car-dispatch/dispatch-list'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.length; i++) {
                                    str += '<li><div class="div1"> <span class="net-id">' + data.data[i].branch_id + '</span><br/><span>' + data.data[i].branch_name + '</span></div>' +
                                        '<div class="div2"><span>' + data.data[i].lin_recommend_car + '</span><br/><span class="advise">建议</span></div><div class="div3"><span>' + data.data[i].dispatch_num + '</span><br/><span class="need-dispatch">需调入</span></div></li>';
                                }
                                that.changeContent(str);
                                cb(true)
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
                        myAjax.post(getApiUrl('/car-dispatch/dispatch-list'), param, function (data) {
                            if (data.data.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < data.data.length; i++) {
                                    str += '<li><div class="div1"> <span class="net-id">' + data.data[i].branch_id + '</span><br/><span>' + data.data[i].branch_name + '</span></div>' +
                                        '<div class="div2"><span>' + data.data[i].lin_recommend_car + '</span><br/><span class="advise">建议</span></div><div class="div3"><span>' + data.data[i].dispatch_num + '</span><br/><span class="need-dispatch">需调入</span></div></li>';
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

//打开排序弹框
$(".controlSort").on("click", function () {
    $(".controlsort_window").removeClass("none");
});
//关闭排序弹框
$(".controlclose-sort").on("click", function () {
    $(".controlsort_window").addClass("none");
});
//默认排序
$(".controlnum-sort").on("click", function () {
    $(this).addClass("controlsort-color");
    $(this).find("img").removeClass("none");
    $(".controlrange-sort").removeClass("controlsort-color");
    $(".controlrange-sort img").addClass("none");
    $(".controlsort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        sort: '1',//排序类型
        page: 1, //页数
        complete_status:[],//完成状态
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    //获取排序信息
    param.sort = $(this).find("input").val();
    $(".confirm-carstate .color").each(function () {//完成状态
        param.complete_status.push($(this).find("input").val());
    });
    show(param);
});
//距离网点从近到远排序
$(".controlrange-sort").on("click", function () {
    $(this).addClass("controlsort-color");
    $(this).find("img").removeClass("none");
    $(".controlnum-sort").removeClass("controlsort-color");
    $(".controlnum-sort img").addClass("none");
    $(".controlsort_window").addClass("none");
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        sort: '1',//排序类型
        page: 1, //页数
        complete_status:[],//完成状态
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    //获取排序信息
    param.sort = $(this).find("input").val();
    $(".confirm-carstate .color").each(function () {//完成状态
        param.complete_status.push($(this).find("input").val());
    });
    show(param);
});
//查看地图跳转页面
$(".check-net").on("click", function () {
    window.location.href = "./dispatchmap.html";
});
//打开调度说明弹框
$(".show-dock").on("click", function () {
    $(".control_window").removeClass("none");
});
//关闭调度说明弹框
$(".control_bottom img").on("click", function () {
    $(".control_window").addClass("none");
});
//搜索页面跳转
$(".controlContentSelect").on("click", function () {
    location.href = "../carNetstock/netselect.html?type=2";
});
//打开筛选弹框
$(".controlContentFilter").on("click", function () {
    $(".dispatch_window").removeClass("none");
});
//关闭筛选弹框
$(".close-dispatch").on("click", function () {
    $(".dispatch_window").addClass("none");
});
//点击确定按钮关闭弹框
$(".carstate-sure").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        sort: '',//排序
        complete_status:[],//完成状态
        page: 1,//页数
        lng: sessionStorage.getItem('locationsLng'),
        lat: sessionStorage.getItem('locationsLat')
    }
    //获取排序信息
    $(".controlsort-list li").each(function () {
        if ($(this).hasClass("controlsort-color")) {
            param.sort = $(this).find("input").val();
        }
    });
    $(".confirm-carstate .color").each(function () {//完成状态
        param.complete_status.push($(this).find("input").val());
    });
    show(param);
    $(".dispatch_window").addClass("none");
});
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
//点击重置按钮
$(".carstate-reset").on("click", function () {
    $(".state").removeClass("color");
    $(".allcarstate").addClass("color");
});
//点击全部
$(".allcarstate").on("click", function () {
    $(".state").removeClass("color");
    $(this).addClass("color");
});