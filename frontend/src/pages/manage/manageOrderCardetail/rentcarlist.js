/**
 * Created by Administrator on 2017/12/20.
 */
//require('../../../component/vconsole')
require('../manageOrder/css/public.css')
require('./css/rentcarlist.css')
import $ from 'jquery'
import FoundationTools from '../manageOrder/js/functionAjax'
import getApiUrl from './js/getApiUrl'
import {Confirm,Toast} from '../manageOrder/common/LikeAlert/index'
import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
import PullUpDown from '../../../component/pullDonwRefresh/index'
import Loading from '../../../component/loading'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
var loading = new Loading()//加载loading
//加载图片
$(".sort_content img").attr("src", require("./images/duigou.png"));//排序对勾
//获取钉钉授权
import ddConfigs from '../manageOrder/js/ddConfigs'
//初始化加载数据
var param = {
    mobile: sessionStorage.getItem("mobile"),
    city_id: sessionStorage.getItem('city_id'),//权限城市id
    lng: '', //经度
    lat: '', //纬度
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
    sort:'1',//1是按距离2是按状态持续时间
    offset: 1, //页数
    limit: 10 //每页大小
}
//手动固定父元素的高，否则scroll不起作用
$('.rentcarList').height($(window).height() - $(".rentcar-content").height());
if (navigator.userAgent.indexOf("DingTalk") > 0) {
    ddConfigs.config()
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
                //存储当前省市
                sessionStorage.setItem('ddprovince', result.province);//省
                sessionStorage.setItem('ddcity', result.city);//市
                param.lng = result.longitude;
                param.lat = result.latitude;
                show(param);//初始化页面展示
            },
            onFail: function (err) {
                new Toast("钉钉获取当前定位失败")
            }
        });
        //刷新页面
        $(".rentcarRefle").on("click", function () {
            let param = {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem('city_id'),//权限城市id
                branch_type: [], //网点类型
                car_status: [], //车辆状态
                lng: '', //经度
                lat: '', //纬度
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                sort:'1',//1是按距离2是按状态持续时间
                offset: 1, //页数
                limit: 10 //每页大小
            };
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
                    //存储当前省市
                    sessionStorage.setItem('ddprovince', result.province);//省
                    sessionStorage.setItem('ddcity', result.city);//市
                    param.lng = result.longitude;
                    param.lat = result.latitude;
                    $(".confirm-netpoint .color").each(function () {
                        param.branch_type.push($(this).find("input").val());
                    });
                    $(".confirm-carstate .color").each(function () {
                        param.car_status.push($(this).find("input").val());
                    });
                    //增加单选
                    $(".confirm-style input").each(function () {
                        if ($(this).is(':checked')) {
                            param.power_type = $(this).val();
                            return false;
                        }
                    });
                    param.branch_type = param.branch_type.join(',');
                    param.car_status = param.car_status.join(',');
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
                    new Toast("钉钉获取当前定位失败")
                }
            });
        });
    });
} else {
//获取定位
    var geolocation;
    AMap.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonPosition: 'RB'
        });
        geolocation.getCurrentPosition(function (status, data) {
            if (status === 'complete') {
                param.lng = data.position.lng;
                param.lat = data.position.lat;
                show(param);
            } else {
                new Toast("获取当前定位失败")
                show(param);
            }
        });
    });
    //刷新页面
    $(".rentcarRefle").on("click", function () {
        let param = {
            mobile: sessionStorage.getItem("mobile"),
            city_id: sessionStorage.getItem('city_id'),//权限城市id
            branch_type: [], //网点类型
            car_status: [], //车辆状态
            lng: '', //经度
            lat: '', //纬度
            PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
            sort:'1',//1是按距离2是按状态持续时间
            offset: 1, //页数
            limit: 10 //每页大小
        };
        AMap.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonPosition: 'RB'
            });
            geolocation.getCurrentPosition(function (status, data) {
                if (status === 'complete') {
                    param.lng = data.position.lng;
                    param.lat = data.position.lat;
                    $(".confirm-netpoint .color").each(function () {
                        param.branch_type.push($(this).find("input").val());
                    });
                    $(".confirm-carstate .color").each(function () {
                        param.car_status.push($(this).find("input").val());
                    });
                    param.branch_type = param.branch_type.join(',');
                    param.car_status = param.car_status.join(',');
                    //获取排序信息
                    $(".sort-list li").each(function () {
                        if ($(this).hasClass("sort-color")) {
                            param.sort = $(this).find("input").val();
                        }
                    });
                    show(param);
                    new Toast("刷新成功")
                } else {
                    new Toast("获取当前定位失败")
                    show(param);
                }
            });
        });
    });
}

//页面数据展示
function show(param) {
    $.post(getApiUrl('/work-order/car-list'), param, function (data) {
        loading.destroy()//清除loading
        var result = data,
            status = result.status,
            total = result.total,
            msg = result.msg,
            datalist = result.data,
            strstart = '',
            strend = '',
            img = '',
            img2 = '',//定义限行非限行图标
            str = '';
        var arrays = [];//存储网点id
        var className = '';//定义li类名
        var odd = false;//定义变量参数
        if (status == '0') {
            if(datalist.length==0){
                new Toast("暂无数据")
            }else{
                for (var i = 0; i < datalist.length; i++) {
                    if (arrays.length == '0') {
                        arrays.push(datalist[i].branch_id);
                        className = '';
                    } else {
                        if (datalist[i].branch_id == arrays[i - 1]) {
                            arrays.push(datalist[i].branch_id);
                            if (odd) {
                                className = 'color_li';
                                odd = true;
                            } else {
                                className = '';
                                odd = false;
                            }

                        } else {
                            arrays.push(datalist[i].branch_id);
                            if (odd) {
                                className = '';
                                odd = false;
                            } else {
                                className = 'color_li';
                                odd = true;
                            }
                        }
                    }
                    strstart = datalist[i].vin.substring(0, 11);
                    strend = datalist[i].vin.substring(11, 17);
                    str += "<li class='" + className + "'><input type='hidden' class='city_id' value='" + datalist[i].city_id + "'/><p>" + datalist[i].plate_no + " （<font class='font1'>" + strstart + "</font><font class='font2'>" + strend + "</font>）<input type='hidden' class='carplate_no' value='" + datalist[i].plate_no + "'/><br/><span>" + datalist[i].status_name + "</span>" +
                        "<span>约续航" + datalist[i].remain_km + "公里</span><span>" + datalist[i].brand_name + "</span><span>" + datalist[i].car_factory + "</span><br/>";
                    if (datalist[i].limit_record) {
                        let limit_record = datalist[i].limit_record;//限行情况
                        str += "<span class='span1'>今</span><span class='span1'>明</span><br/>";
                        if (datalist[i].plate_no.indexOf("粤A") != '-1' && datalist[i].plate_no != '') {
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
                    }
                    /*****@xurr 0831 添加24小时未动和远距离车辆****/
                    if (datalist[i].unmove_time) {
                        var not_time = datalist[i].unmove_time;
                        var	day_num = not_time[0];
                        var hour_num = not_time[1];
                        var min_num = not_time[2];
                        str += "<div class='not_time'><span>未动时长：</span><span class='not_content'><span class='fcec6e'> "+day_num+" </span>天<span class='fcec6e'> "+hour_num+" </span>小时<span class='fcec6e'> "+min_num+" </span>分</span></div>"
                    }
                    if (datalist[i].city_distance) {
                        str +="<div class='long_distance'><span>距离城市中心：</span><span class='long_content'><span class='fcec6e'> "+datalist[i].city_distance+" </span>KM</span></div>"
                    }
                    if (datalist[i].area) {
                        if (datalist[i].area == '1') {
                            img2 = '<img class="img2" src="' + require('./images/cityTraffic/traffic.png') + '" />';
                        } else {
                            img2 = '<img class="img2" src="' + require('./images/cityTraffic/notraffic.png') + '" />';
                        }
                    } else {
                        img2 = '';
                    }
                    if (datalist[i].biz_type == '0') {
                        img = require('./images/mapb.png');
                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a></p>";
                    } else if (datalist[i].biz_type == '1') {
                        img = require('./images/map-B.png');
                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a><br/>当前预计停车费" + datalist[i].park_fee + "元</p>";
                    } else if (datalist[i].biz_type == '2') {
                        img = require('./images/mapoiler.png');
                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a></p>";
                    }
                    //增加状态时长
                    str += "<span>状态时长："+datalist[i].during_sec+"</span><br/>";
                    if (datalist[i].last_desc == '') {
                        str += "</li>";
                    } else {
                        str += "<div class='bottom'><span class='span1'>备注：</span><span class='span2'>" + datalist[i].last_desc + "</span></div></li>";
                    }
                }
            }
            $(".rentcarList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.rentcarList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.offset = 1;
                        index = 0;
                        $.post(getApiUrl('/work-order/car-list'), param, function (data) {
                            let result = data,
                                status = result.status,
                                total = result.total,
                                msg = result.msg,
                                datalist = result.data,
                                strstart = '',
                                strend = '',
                                img = '';
                            arrays = [];//上拉清空存储网点数组
                            odd = false;//定义变量参数
                            if (datalist.length != 0) {
                                for (let i = 0; i < datalist.length; i++) {
                                    if (arrays.length == '0') {
                                        arrays.push(datalist[i].branch_id);
                                        className = '';
                                    } else {
                                        if (datalist[i].branch_id == arrays[i - 1]) {
                                            arrays.push(datalist[i].branch_id);
                                            if (odd) {
                                                className = 'color_li';
                                                odd = true;
                                            } else {
                                                className = '';
                                                odd = false;
                                            }

                                        } else {
                                            arrays.push(datalist[i].branch_id);
                                            if (odd) {
                                                className = '';
                                                odd = false;
                                            } else {
                                                className = 'color_li';
                                                odd = true;
                                            }
                                        }
                                    }
                                    strstart = datalist[i].vin.substring(0, 11);
                                    strend = datalist[i].vin.substring(11, 17);
                                    str += "<li class='" + className + "'><input type='hidden' class='city_id' value='" + datalist[i].city_id + "'/><p>" + datalist[i].plate_no + " （<font class='font1'>" + strstart + "</font><font class='font2'>" + strend + "</font>）<input type='hidden' class='carplate_no' value='" + datalist[i].plate_no + "'/><br/><span>" + datalist[i].status_name + "</span>" +
                                        "<span>约续航" + datalist[i].remain_km + "公里</span><span>" + datalist[i].brand_name + "</span><span>" + datalist[i].car_factory + "</span><br/>";
                                    if (datalist[i].limit_record) {
                                        let limit_record = datalist[i].limit_record;//限行情况
                                        str += "<span class='span1'>今</span><span class='span1'>明</span><br/>";
                                        if (datalist[i].plate_no.indexOf("粤A") != '-1' && datalist[i].plate_no != '') {
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
                                    }
                                    /*****@xurr 0831 添加24小时未动和远距离车辆****/
                                    if (datalist[i].unmove_time) {
                                        var not_time = datalist[i].unmove_time;
                                        var	day_num = not_time[0];
                                        var hour_num = not_time[1];
                                        var min_num = not_time[2];
                                        str += "<div class='not_time'><span>未动时长：</span><span class='not_content'><span class='fcec6e'> "+day_num+" </span>天<span class='fcec6e'> "+hour_num+" </span>小时<span class='fcec6e'> "+min_num+" </span>分</span></div>"
                                    }
                                    if (datalist[i].city_distance) {
                                        str +="<div class='long_distance'><span>距离城市中心：</span><span class='long_content'><span class='fcec6e'> "+datalist[i].city_distance+" </span>KM</span></div>"
                                    }
                                    if (datalist[i].area) {
                                        if (datalist[i].area == '1') {
                                            img2 = '<img class="img2" src="' + require('./images/cityTraffic/traffic.png') + '" />';
                                        } else {
                                            img2 = '<img class="img2" src="' + require('./images/cityTraffic/notraffic.png') + '" />';
                                        }
                                    } else {
                                        img2 = '';
                                    }
                                    if (datalist[i].biz_type == '0') {
                                        img = require('./images/mapb.png');
                                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a></p>";
                                    } else if (datalist[i].biz_type == '1') {
                                        img = require('./images/map-B.png');
                                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a><br/>当前预计停车费" + datalist[i].park_fee + "元</p>";
                                    } else if (datalist[i].biz_type == '2') {
                                        img = require('./images/mapoiler.png');
                                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a></p>";
                                    }
                                    //增加状态时长
                                    str += "<span>状态时长："+datalist[i].during_sec+"</span><br/>";
                                    if (datalist[i].last_desc == '') {
                                        str += "</li>";
                                    } else {
                                        str += "<div class='bottom'><span class='span1'>备注：</span><span class='span2'>" + datalist[i].last_desc + "</span></div></li>";
                                    }
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
                        param.offset = index + 1;
                        $.post(getApiUrl('/work-order/car-list'), param, function (data) {
                            let result = data,
                                status = result.status,
                                total = result.total,
                                msg = result.msg,
                                datalist = result.data,
                                img = '',
                                strstart = '',
                                strend = '';
                            if (datalist.length == 0) {
                                cb(false)
                            } else {
                                if ($(".rentcarList li").eq(index * 10 - 1).hasClass('color_li')) {
                                    className = 'color_li'
                                    odd = true;
                                } else {
                                    className = ''
                                    odd = false;
                                }
                                for (let i = 0; i < datalist.length; i++) {
                                    if (datalist[i].branch_id == arrays[index * 10 + i - 1]) {
                                        arrays.push(datalist[i].branch_id);
                                        if (odd) {
                                            className = 'color_li';
                                            odd = true;
                                        } else {
                                            className = '';
                                            odd = false;
                                        }

                                    } else {
                                        arrays.push(datalist[i].branch_id);
                                        if (odd) {
                                            className = '';
                                            odd = false;
                                        } else {
                                            className = 'color_li';
                                            odd = true;
                                        }
                                    }
                                    strstart = datalist[i].vin.substring(0, 11);
                                    strend = datalist[i].vin.substring(11, 17);
                                    str += "<li class='" + className + "'><input type='hidden' class='city_id' value='" + datalist[i].city_id + "'/><p>" + datalist[i].plate_no + " （<font class='font1'>" + strstart + "</font><font class='font2'>" + strend + "</font>）<input type='hidden' class='carplate_no' value='" + datalist[i].plate_no + "'/><br/><span>" + datalist[i].status_name + "</span>" +
                                        "<span>约续航" + datalist[i].remain_km + "公里</span><span>" + datalist[i].brand_name + "</span><span>" + datalist[i].car_factory + "</span><br/>";
                                    if (datalist[i].limit_record) {
                                        let limit_record = datalist[i].limit_record;//限行情况
                                        str += "<span class='span1'>今</span><span class='span1'>明</span><br/>";
                                        if (datalist[i].plate_no.indexOf("粤A") != '-1' && datalist[i].plate_no != '') {
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
                                    }
                                    /*****@xurr 0831 添加24小时未动和远距离车辆****/

                                    if (datalist[i].unmove_time) {
                                        var not_time = datalist[i].unmove_time;
                                        var	day_num = not_time[0];
                                        var hour_num = not_time[1];
                                        var min_num = not_time[2];
                                        str += "<div class='not_time'><span>未动时长：</span><span class='not_content'><span class='fcec6e'> "+day_num+" </span>天<span class='fcec6e'> "+hour_num+" </span>小时<span class='fcec6e'> "+min_num+" </span>分</span></div>"
                                    }
                                    if (datalist[i].city_distance) {
                                        str +="<div class='long_distance'><span>距离城市中心：</span><span class='long_content'><span class='fcec6e'> "+datalist[i].city_distance+" </span>KM</span></div>"
                                    }
                                    if (datalist[i].area) {
                                        if (datalist[i].area == '1') {
                                            img2 = '<img class="img2" src="' + require('./images/cityTraffic/traffic.png') + '" />';
                                        } else {
                                            img2 = '<img class="img2" src="' + require('./images/cityTraffic/notraffic.png') + '" />';
                                        }
                                    } else {
                                        img2 = '';
                                    }
                                    if (datalist[i].biz_type == '0') {
                                        img = require('./images/mapb.png');
                                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a></p>";
                                    } else if (datalist[i].biz_type == '1') {
                                        img = require('./images/map-B.png');
                                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a><br/>当前预计停车费" + datalist[i].park_fee + "元</p>";
                                    } else if (datalist[i].biz_type == '2') {
                                        img = require('./images/mapoiler.png');
                                        str += "</p><p>" + img2 + "<img src='" + img + "'/><a>" + datalist[i].branch_addr + "</a></p>";
                                    }
                                    //增加状态时长
                                    str += "<span>状态时长："+datalist[i].during_sec+"</span><br/>";
                                    if (datalist[i].last_desc == '') {
                                        str += "</li>";
                                    } else {
                                        str += "<div class='bottom'><span class='span1'>备注：</span><span class='span2'>" + datalist[i].last_desc + "</span></div></li>";
                                    }
                                }
                                that.appendContent(str);;
                                cb(true)
                            }
                        });
                    }, 400)
                }
            })
        } else {
            new Toast(msg)
        }
    });
    //跳转车辆详情页
    $(".rentcarList").on("click", "li", function () {
        let plateNumber;
        if ($(this).find(".carplate_no").val() == '') {
            plateNumber = $(this).find(".font2").text();//vin后六位
        } else {
            plateNumber = $(this).find(".carplate_no").val();//车牌号
        }
        window.location.href = "./index.html?plate_no=" + plateNumber;
    });
    //跳转车辆当前位置页面
    $(".rentcarList").on("click", "a", function (event) {
        event.stopPropagation();//阻止事件冒泡
        let plateNumber;
        if ($(this).parent().parent().find(".carplate_no").val() == '') {
            plateNumber = $(this).parent().parent().find(".font2").text();
        } else {
            plateNumber = $(this).parent().parent().find(".carplate_no").val();
        }
        window.location.href = "../manageOrder/oilerSingle/carLocation.html?name=" + plateNumber;
    });
}
//初始化加载图片
$(".mapb").attr("src", require('./images/mapb.png'));
$(".map-b").attr("src", require('./images/map-B.png'));
$(".mapoiler").attr("src", require('./images/mapoiler.png'));
//初始化车辆筛选类型配置接口
var params = {
    mobile: sessionStorage.getItem("mobile"),
    city_id: sessionStorage.getItem('city_id'),//权限城市id
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
}
$.post(getApiUrl('/work-order/car-select-config'), params, function (data) {
    var deployresult = data,
        deployresultstatus = deployresult.status,
        deployresultmsg = deployresult.msg,
        deployresultdatalist = deployresult.data;
    if (deployresultstatus == '0') {
        if (deployresultdatalist != '') {
            var branch_type = deployresultdatalist.branch_type,//网点类型
                car_status = deployresultdatalist.car_status,//车辆状态
                branch_typestr = '<span class="allnet color">' + branch_type[0].name + '<input type="hidden" value=""/></span>',
                car_statusstr = '<span class="allcarstate color">' + car_status[0].name + '<input type="hidden" value=""/></span>';
            for (var i = 1; i < branch_type.length; i++) {
                branch_typestr += '<span class="net">' + branch_type[i].name + '<input type="hidden" value="' + branch_type[i].id + '"/></span>';
            }
            $(".confirm-netpoint").html(branch_typestr);
            for (var i = 1; i < car_status.length; i++) {
                let bracket;
                if (car_status[i].num === '') {
                    bracket = '';
                } else {
                    bracket = '(' + car_status[i].num + ')';
                }
                car_statusstr += '<span class="state">' + car_status[i].name + bracket + '<input type="hidden" value="' + car_status[i].id + '"/></span>';
            }
            $(".confirm-carstate").html(car_statusstr);
            //点击选项变换颜色
            $(".confirm-netpoint .net").on("click", function () {
                if ($(".confirm-netpoint .color").length > 1) {
                    if ($(this).hasClass("color")) {
                        $(this).removeClass("color");
                    } else {
                        $(this).addClass("color");
                    }
                } else {
                    $(this).addClass("color");
                }
                $(".allnet").removeClass("color");
            });
            $(".confirm-carstate .state").on("click", function () {
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
            //点击全部
            $(".allnet").on("click", function () {
                $(".confirm-netpoint .net").removeClass("color");
                $(this).addClass("color");
            });
            $(".allcarstate").on("click", function () {
                $(".confirm-carstate .state").removeClass("color");
                $(this).addClass("color");
            });
            //点击重置按钮
            $(".confirm-bottom .confirm-reset").on("click", function () {
                $(".confirm-netpoint .net").removeClass("color");
                $(".allnet").addClass("color");
                $(".confirm-carstate .state").removeClass("color");
                $(".allcarstate").addClass("color");
                $(".confirm-style .all").prop("checked", true);
            });
        }
    } else {
        new Toast(deployresultmsg)
    }
});
//跳转搜索页面
$(".rentcarSelect").on("click", function () {
    window.location.href = "../endwork/index.html#/rentlistsearch";
})
//记录打开弹框前已筛选的值
var colorArray = [];
//打开筛选弹框
$(".rentcarFilter").on("click", function () {
    colorArray = [];
    $(".confirm-content span").each(function () {
        if ($(this).hasClass("color")) {
            colorArray.push($(this));
        }
    });
    $(".confirm_window").removeClass("none");
})
//关闭筛选弹框
$(".close-confirm").on("click", function () {
    $(".confirm-content span").removeClass("color");
    for (var i = 0; i < colorArray.length; i++) {
        colorArray[i].addClass("color");
    }
    $(".confirm_window").addClass("none");
})
//点击确认按钮后关闭弹框
$(".confirm-sure").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem("mobile"),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        branch_type: [], //网点类型
        car_status: [], //车辆状态
        lng: sessionStorage.getItem('locationsLng'), //经度
        lat: sessionStorage.getItem('locationsLat'), //纬度
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        sort:'1',//1是按距离2是按状态持续时间
        offset: 1, //页数
        limit: 10 //每页大小
    };
    $(".confirm-netpoint .color").each(function () {
        param.branch_type.push($(this).find("input").val());
    });
    $(".confirm-carstate .color").each(function () {
        param.car_status.push($(this).find("input").val());
    });
    //增加单选
    $(".confirm-style input").each(function () {
        if ($(this).is(':checked')) {
            param.power_type = $(this).val();
            return false;
        }
    });
    param.branch_type = param.branch_type.join(',');
    param.car_status = param.car_status.join(',');
    //获取排序信息
    $(".sort-list li").each(function () {
        if ($(this).hasClass("sort-color")) {
            param.sort = $(this).find("input").val();
        }
    });
    show(param);
    $(".confirm_window").addClass("none");
});

//新增排序弹框
//排序弹框
$(".rentcarSort").on("click", function () {
    $(".sort_window").removeClass("none");
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
        mobile: sessionStorage.getItem("mobile"),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        branch_type: [], //网点类型
        car_status: [], //车辆状态
        lng: sessionStorage.getItem('locationsLng'), //经度
        lat: sessionStorage.getItem('locationsLat'), //纬度
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        sort:'1',//1是按距离2是按状态持续时间
        offset: 1, //页数
        limit: 10 //每页大小
    }
    $(".confirm-netpoint .color").each(function () {
        param.branch_type.push($(this).find("input").val());
    });
    $(".confirm-carstate .color").each(function () {
        param.car_status.push($(this).find("input").val());
    });
    //增加单选
    $(".confirm-style input").each(function () {
        if ($(this).is(':checked')) {
            param.power_type = $(this).val();
            return false;
        }
    });
    param.branch_type = param.branch_type.join(',');
    param.car_status = param.car_status.join(',');
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
        mobile: sessionStorage.getItem("mobile"),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        branch_type: [], //网点类型
        car_status: [], //车辆状态
        lng: sessionStorage.getItem('locationsLng'), //经度
        lat: sessionStorage.getItem('locationsLat'), //纬度
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        sort:'1',//1是按距离2是按状态持续时间
        offset: 1, //页数
        limit: 10 //每页大小
    }
    $(".confirm-netpoint .color").each(function () {
        param.branch_type.push($(this).find("input").val());
    });
    $(".confirm-carstate .color").each(function () {
        param.car_status.push($(this).find("input").val());
    });
    //增加单选
    $(".confirm-style input").each(function () {
        if ($(this).is(':checked')) {
            param.power_type = $(this).val();
            return false;
        }
    });
    param.branch_type = param.branch_type.join(',');
    param.car_status = param.car_status.join(',');
    //获取排序信息
    param.sort = $(this).find("input").val();
    show(param);
});

//ios返回异常处理
var userAgent = navigator.userAgent,
    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if (isiOS) {
    $(".readios .all").prop("checked", true);
}