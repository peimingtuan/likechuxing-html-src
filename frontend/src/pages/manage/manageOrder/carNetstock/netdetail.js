/**
 * Created by Administrator on 2018/5/28.
 */
/**
 * Created by Administrator on 2017/12/20.
 */
require('../css/public.css')
require('../css/carNetstock/netdetail.css')
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
//获取url参数
var branch_id = FoundationTools.getUrlParam('branch_id'),//网点id
    lng = FoundationTools.getUrlParam('lng'),//网点经纬度
    lat = FoundationTools.getUrlParam('lat'),//网点经纬度
    biz_type = FoundationTools.getUrlParam('biz_type'),//网点类型
    address = FoundationTools.getUrlParam('address'),//网点地址
    current_counts = FoundationTools.getUrlParam('current_counts');//网点车辆数
//waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
var loading = new Loading()//加载loading
//初始化加载图片
$(".netdetail-content .img2").attr("src", require("../image/carNetstock/daohang.png"));//导航
if (biz_type == '0') {
    $(".netdetail-content .img1").attr("src", require("../image/mapb.png"));//合作网点
} else {
    $(".netdetail-content .img1").attr("src", require("../image/map-B.png"));//非合作网点类型
}
$(".netdetail-content .net-name font").text(address);
$(".netdetail-content .right font").text(current_counts);
//展示头部
$(".netdetail-content").removeClass("none");
//初始化我的加油工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    branch_id: branch_id,//网点id
    page: 1 //页数
};
//手动固定父元素的高，否则scroll不起作用
$('.netdetailList').height($(window).height() - $('.netdetail-content').height() - $(".netdetail-nextbtn").height());
var color_type = 1;//控制未发现车辆显示，隐藏按钮
show(param)
function show(param) {
    param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
    myAjax.post(getApiUrl('/branch-car-stock/branch-cars'), param, function (data) {
        if (data.status == '0') {
            loading.destroy()//清除loading
            let str = '',
                strstart = '',
                strend = '',
                fourLimit = '',
                chengdu = '',
                desc = '';
            for (var i = 0; i < data.data.length; i++) {
                strstart = data.data[i].vin.substring(0, 11);
                strend = data.data[i].vin.substring(11, 17);
                chengdu = data.data[i].chengdu_limit_record;
                fourLimit = data.data[i].limit_record;
                desc = data.data[i].des;
//              desc = 'zuihouyishhdhdhdhd';
//              fourLimit = [{ 'day':'27','limit':0},{'day':'28','limit':0},{'day':'29','limit':2},{'day':'30','limit':1},{'day':'31','limit':0}];
                let line = '';
                if (data.data[i].current_parking_no != '') {
                    line = '-';
                }
                let colorname = '';
                if (color_type == 1) {
                    colorname = 'none';
                }
                str += '<li><input type="hidden" class="car_vin" value="' + strend + '" /><input type="hidden" class="car_id" value="' + data.data[i].car_id + '" /><input type="hidden" class="plate_no" value="' + data.data[i].plate_no + '" /><span>' + data.data[i].plate_no + ' (' + strend + ')</span>  <span>' + data.data[i].current_parking_floor + line + data.data[i].current_parking_no + '</span><br/><span>' + data.data[i].status + '</span>' +
                    '<span>' + data.data[i].model_name + '</span><span>' + data.data[i].color + '</span><span>约续航' + data.data[i].remain_km + '公里</span><br/>';

                if (chengdu == '1') {//今日限行
                    str += '<p class="limit limit1">今日限行</p>'
                } else if (chengdu == '2') {//明日限行
                    str += '<p class="limit limit2">明日限行</p>'
                }
                if (fourLimit) {
                    str += "<div class='three_title'><b class='span1'>今</b><b class='span1'>明</b></div><div class='three_type'>";

                    for (var j = 0; j < fourLimit.length; j++) {
                        if (fourLimit[j].limit == '0') {//0不限行，1限行,2表示不确定
                            str += '<b class="span1 is_drive">开</b>'
                        } else if (fourLimit[j].limit == '1') {
                            str += '<b class="span1 is_park">停</b>'
                        } else if (fourLimit[j].limit == '2') {
                            str += '<b class="span1 is_stay">待</b>'
                        }
                    }
                    str += '</div>';
                }
                str += '<span>状态时长：' + data.data[i].during_sec + '</span><br/><span>停车时长：' + data.data[i].time + '</span><span class="car-notnet  right ' + colorname + '">车辆未在网点</span><br/>';
                if (biz_type != '0') {
                    str += '<span>预计停车费：<font>' + data.data[i].fee + '</font>元</span>';
                }
                if (desc && desc != '') {
                    str += '<p class="dot_line"></p><p class="move_note"><span class="note_titles fc33">备注：</span><span class="fc66 note_con">' + desc + '</span></p></li>'
                }
            }
            $(".netdetailList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.netdetailList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/branch-car-stock/branch-cars'), param, function (data) {
                            if (data.data.length != 0) {
                                for (var i = 0; i < data.data.length; i++) {
                                    strstart = data.data[i].vin.substring(0, 11);
                                    strend = data.data[i].vin.substring(11, 17);
                                    chengdu = data.data[i].chengdu_limit_record;
                                    fourLimit = data.data[i].limit_record;
                                    desc = data.data[i].des;
                                    let line = '';
                                    if (data.data[i].current_parking_no != '') {
                                        line = '-';
                                    }
                                    let colorname = '';
                                    if (color_type == 1) {
                                        colorname = 'none';
                                    }
                                    str += '<li><input type="hidden" class="car_vin" value="' + strend + '" /><input type="hidden" class="car_id" value="' + data.data[i].car_id + '" /><input type="hidden" class="plate_no" value="' + data.data[i].plate_no + '" /><span>' + data.data[i].plate_no + '  (' + strend + ')</span>  <span>' + data.data[i].current_parking_floor + line + data.data[i].current_parking_no + '</span><br/><span>' + data.data[i].status + '</span>' +
                                        '<span>' + data.data[i].model_name + '</span><span>' + data.data[i].color + '</span><span>约续航' + data.data[i].remain_km + '公里</span><br/>';

                                    if (chengdu == '1') {//今日限行
                                        str += '<p class="limit limit1">今日限行</p>'
                                    } else if (chengdu == '2') {//明日限行
                                        str += '<p class="limit limit2">明日限行</p>'
                                    }
                                    if (fourLimit) {
                                        str += "<div class='three_title'><b class='span1'>今</b><b class='span1'>明</b></div><div class='three_type'>";

                                        for (var j = 0; j < fourLimit.length; j++) {
                                            if (fourLimit[j].limit == '0') {//0不限行，1限行,2表示不确定
                                                str += '<b class="span1 is_drive">开</b>'
                                            } else if (fourLimit[j].limit == '1') {
                                                str += '<b class="span1 is_park">停</b>'
                                            } else if (fourLimit[j].limit == '2') {
                                                str += '<b class="span1 is_stay">待</b>'
                                            }
                                        }
                                        str += '</div>';
                                    }
                                    str += '<span>状态时长：' + data.data[i].during_sec + '</span><br/><span>停车时长：' + data.data[i].time + '</span><span class="car-notnet  right ' + colorname + '">车辆未在网点</span><br/>';
                                    if (biz_type != '0') {
                                        str += '<span>预计停车费：<font>' + data.data[i].fee + '</font>元</span>';
                                    }
                                    if (desc && desc != '') {
                                        str += '<p class="dot_line"></p><p class="move_note"><span class="note_titles fc33">备注：</span><span class="fc66 note_con">' + desc + '</span></p></li>'
                                    }
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
                        myAjax.post(getApiUrl('/branch-car-stock/branch-cars'), param, function (data) {
                            if (data.data.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < data.data.length; i++) {
                                    strstart = data.data[i].vin.substring(0, 11);
                                    strend = data.data[i].vin.substring(11, 17);
                                    chengdu = data.data[i].chengdu_limit_record;
                                    fourLimit = data.data[i].limit_record;
                                    desc = data.data[i].des;
                                    let line = '';
                                    if (data.data[i].current_parking_no != '') {
                                        line = '-';
                                    }
                                    let colorname = '';
                                    if (color_type == 1) {
                                        colorname = 'none';
                                    }
                                    str += '<li><input type="hidden" class="car_vin" value="' + strend + '" /><input type="hidden" class="car_id" value="' + data.data[i].car_id + '" /><input type="hidden" class="plate_no" value="' + data.data[i].plate_no + '" /><span>' + data.data[i].plate_no + '  (' + strend + ')</span>  <span>' + data.data[i].current_parking_floor + line + data.data[i].current_parking_no + '</span><br/><span>' + data.data[i].status + '</span>' +
                                        '<span>' + data.data[i].model_name + '</span><span>' + data.data[i].color + '</span><span>约续航' + data.data[i].remain_km + '公里</span><br/>';

                                    if (chengdu == '1') {//今日限行
                                        str += '<p class="limit limit1">今日限行</p>'
                                    } else if (chengdu == '2') {//明日限行
                                        str += '<p class="limit limit2">明日限行</p>'
                                    }
                                    if (fourLimit) {
                                        str += "<div class='three_title'><b class='span1'>今</b><b class='span1'>明</b></div><div class='three_type'>";

                                        for (var j = 0; j < fourLimit.length; j++) {
                                            if (fourLimit[j].limit == '0') {//0不限行，1限行,2表示不确定
                                                str += '<b class="span1 is_drive">开</b>'
                                            } else if (fourLimit[j].limit == '1') {
                                                str += '<b class="span1 is_park">停</b>'
                                            } else if (fourLimit[j].limit == '2') {
                                                str += '<b class="span1 is_stay">待</b>'
                                            }
                                        }
                                        str += '</div>';
                                    }
                                    str += '<span>状态时长：' + data.data[i].during_sec + '</span><br/><span>停车时长：' + data.data[i].time + '</span><span class="car-notnet  right ' + colorname + '">车辆未在网点</span><br/>';
                                    if (biz_type != '0') {
                                        str += '<span>预计停车费：<font>' + data.data[i].fee + '</font>元</span>';
                                    }
                                    if (desc && desc != '') {
                                        str += '<p class="dot_line"></p><p class="move_note"><span class="note_titles fc33">备注：</span><span class="fc66 note_con">' + desc + '</span></p></li>'
                                    }
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
//跳转导航页面
$(".navigation-icon").on("click", function () {
    window.location.href = "./netlocation.html?branch_id=" + branch_id;
});
//发现未记录车辆
$(".find-norecordcar").on("click", function () {
    $(".net-contentwindow2").removeClass("none");
    $('.plate-num').val('');//清空数据
    $('.plate-num').focus();
});
//确认
$(".qure2").on("click", function () {
    if ($(".plate-num").val() == '') {
        new Toast("车牌号不能为空")
        return false;
    }
    myAjax.post(getApiUrl('/branch-car-stock/create-report'), {
        mobile: sessionStorage.getItem("mobile"),
        plate_no: $(".plate-num").val(),
        branch_id: branch_id //网点id
    }, function (data) {
        if (data.status == '0') {
            $(".net-contentwindow2").addClass("none");
            new Toast("提交成功");
        } else {
            new Toast(data.msg);
        }
    });
});
//关闭弹框
$(".cancel2").on("click", function () {
    $(".net-contentwindow2").addClass("none");
});
//车辆未在网点
var car_id = '';
$(".netdetailList").on("click", ".car-notnet", function (event) {
    event.stopPropagation();//阻止事件冒泡
    $(".net-content1 .plate font").text($(this).parent().find(".plate_no").val())
    $(".net-contentwindow1").removeClass("none");
    car_id = $(this).parent().find(".car_id").val();
});
//确认
$(".qure").on("click", function () {
    myAjax.post(getApiUrl('/branch-car-stock/create-report'), {
        mobile: sessionStorage.getItem("mobile"),
        car_id: car_id,
        branch_id: branch_id //网点id
    }, function (data) {
        if (data.status == '0') {
            $(".net-contentwindow1").addClass("none");
            new Toast("提交成功");
        } else {
            new Toast(data.msg);
        }
    });
});
//关闭弹框
$(".cancel").on("click", function () {
    $(".net-contentwindow1").addClass("none");
});

//网点网点车辆报错
$(".netdetail-nextbtn button").on("click", function () {
    if ($(this).hasClass("submit-info")) {
        color_type = 1;
        $(this).removeClass("submit-info");
        $(this).text("网点车辆数据报错");
        $(".find-norecordcar").addClass("none");
        loading = new Loading()//加载loading
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            branch_id: branch_id,//网点id
            page: 1 //页数
        };
        show(param)
        //$(".netdetailList .car-notnet").addClass("none");
    } else {
        color_type = 2;
        $(this).addClass("submit-info");
        $(this).text("报错完成");
        $(".find-norecordcar").removeClass("none");
        loading = new Loading()//加载loading
        let param = {
            mobile: sessionStorage.getItem('mobile'),
            branch_id: branch_id,//网点id
            page: 1 //页数
        };
        show(param)
        //$(".netdetailList .car-notnet").removeClass("none");
    }
});

//跳往车辆详情页
$(".netdetailList").on("click", "li", function () {
    let plateNumber = $(this).find(".plate_no").val();
    if (plateNumber == '') {
        plateNumber = $(this).find(".car_vin").val();
    }
    location.href = "../../manageOrderCardetail/index.html?plate_no=" + plateNumber;
});