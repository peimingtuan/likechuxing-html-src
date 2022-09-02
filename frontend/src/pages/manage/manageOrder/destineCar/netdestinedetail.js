/**
 * Created by Administrator on 2018/7/17.
 */
require('../css/public.css')
require('../css/destineCar/netdestinedetail.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import ddTalk from '../js/ddTalk'
//require('../../../../component/vconsole')
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//获取url参数
var branch_id = FoundationTools.getUrlParam('branch_id'),//网点id
    lng = FoundationTools.getUrlParam('lng'),//网点经纬度
    lat = FoundationTools.getUrlParam('lat'),//网点经纬度
    biz_type = FoundationTools.getUrlParam('biz_type'),//网点类型
    address = FoundationTools.getUrlParam('address'),//网点地址
    choicetype = FoundationTools.getUrlParam('choicetype'),//可调入网点车辆类型
    is_transfer = FoundationTools.getUrlParam('is_transfer'),//待改状态车辆
    current_counts = FoundationTools.getUrlParam('current_counts');//网点车辆数
//初始化加载图片
$(".netdestine-content .img2").attr("src", require("../image/carNetstock/daohang.png"));//导航
if (biz_type == '0') {
    $(".netdestine-content .img1").attr("src", require("../image/mapb.png"));//合作网点
} else {
    $(".netdestine-content .img1").attr("src", require("../image/map-B.png"));//非合作网点类型
}
$(".netdestine-content .net-name font").text(address);
//初始化我的加油工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    is_transfer: '0',//是否可调入1:是0:否2:待改状态车辆
    branch_id: branch_id//网点id
};
if (is_transfer) {
    document.title = "待改状态车辆";
    param.is_transfer = '2';
}
//手动固定父元素的高，否则scroll不起作用
$('.netdestineList').height($(window).height() - $('.netdestine-content').height());
show(param)
function show(param) {
    if (choicetype) {
        param.is_transfer = '1';
        if (choicetype != '0') {
            if (choicetype == '1') {
                param.is_local = '1';
            } else {
                param.drive_day = choicetype;
            }
        }
    }
    myAjax.post(getApiUrl('/limit-line/branch-cars'), param, function (data) {
        if (data.status == '0') {
            let str = '',
                strstart = '',
                strend = '';
            //展示头部
            if (current_counts) {
                $(".netdestine-content .right font").text(current_counts);
            } else {
                $(".netdestine-content .right font").text(data.data.length);
            }
            $(".netdestine-content").removeClass("none");
            if (data.data.length == 0) {
                new Toast("暂无数据")
            } else {
                for (var i = 0; i < data.data.length; i++) {
                    strstart = data.data[i].vin.substring(0, 11);
                    strend = data.data[i].vin.substring(11, 17);
                    let line = '';
                    if (data.data[i].current_parking_no != '') {
                        line = '-';
                    }
                    str += '<li><input type="hidden" value="' + strend + '" class="plate_no"/><span>' + data.data[i].plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>' + data.data[i].current_parking_floor + line + data.data[i].current_parking_no + '</span><br/><span>' + data.data[i].status_name + '</span>' +
                        '<span>' + data.data[i].brand_name + ' ' + data.data[i].model_name + '</span><span>' + data.data[i].color + '</span><span>约续航' + data.data[i].remain_km + '公里</span><br/><span class="span1">今</span><span class="span1">明</span><br/>';
                    let limit_record = data.data[i].limit_record;
                    if (data.data[i].plate_no.indexOf("粤A") != '-1' && data.data[i].plate_no != '') {
                        for (var j = 0; j < limit_record.length; j++) {
                            str += '<span class="span1 opencar">开</span>';
                        }
                    } else {
                        for (var j = 0; j < limit_record.length; j++) {
                            if (limit_record[j].limit == '0') {//0不限行，1限行,2表示不确定
                                str += '<span class="span1 opencar">开</span>'
                            } else if (limit_record[j].limit == '1') {
                                str += '<span class="span1 stopcar">停</span>'
                            } else if (limit_record[j].limit == '2') {
                                str += '<span class="span1 waitingcar">待</span>'
                            }
                        }
                    }
                    str += '</li>';
                }
            }
            $(".netdestineList").html(str);
            //上拉，下拉获取数据
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.netdestineList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        myAjax.post(getApiUrl('/limit-line/branch-cars'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.length; i++) {
                                    strstart = data.data[i].vin.substring(0, 11);
                                    strend = data.data[i].vin.substring(11, 17);
                                    let line = '';
                                    if (data.data[i].current_parking_no != '') {
                                        line = '-';
                                    }
                                    str += '<li><input type="hidden" value="' + strend + '" class="plate_no"/><span>' + data.data[i].plate_no + '(<font class="font1">' + strstart + '</font>' + strend + ')</span><span>' + data.data[i].current_parking_floor + line + data.data[i].current_parking_no + '</span><br/><span>' + data.data[i].status_name + '</span>' +
                                        '<span>' + data.data[i].brand_name + ' ' + data.data[i].model_name + '</span><span>' + data.data[i].color + '</span><span>约续航' + data.data[i].remain_km + '公里</span><br/><span class="span1">今</span><span class="span1">明</span><br/>';
                                    let limit_record = data.data[i].limit_record;
                                    if (data.data[i].plate_no.indexOf("粤A") != '-1' && data.data[i].plate_no != '') {
                                        for (var j = 0; j < limit_record.length; j++) {
                                            str += '<span class="span1 opencar">开</span>';
                                        }
                                    } else {
                                        for (var j = 0; j < limit_record.length; j++) {
                                            if (limit_record[j].limit == '0') {//0不限行，1限行,2表示不确定
                                                str += '<span class="span1 opencar">开</span>'
                                            } else if (limit_record[j].limit == '1') {
                                                str += '<span class="span1 stopcar">停</span>'
                                            } else if (limit_record[j].limit == '2') {
                                                str += '<span class="span1 waitingcar">待</span>'
                                            }
                                        }
                                    }
                                    str += '</li>';
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
                    cb(false)
                }
            });
        } else {
            new Toast(data.msg)
        }
    });
}
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
dd.error(function (error) {
    new Toast("钉钉授权失败，请关闭页面重新打开")
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
            $(".navigation-icon").on("click", function () {
                driving.search(
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [lng, lat],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            });
        },
        onFail: function (err) {
            new Toast("钉钉获取定位失败")
        }
    });
});

//跳转车辆详情页面
$(".netdestineList").on("click", "li", function () {
    window.location.href = "../../manageOrderCardetail/index.html?plate_no=" + $(this).find(".plate_no").val();
});