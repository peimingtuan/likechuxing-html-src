/**
 * Created by Administrator on 2018/6/6.
 */
require('../css/public.css')
require('../css/faultWork/faultdetail.css')
require('../css/lost_goods_window.less')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取钉钉授权
import ddConfigs from '../js/ddConfigs'
ddConfigs.config()
//调取钉钉接口
dd.error(function (error) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
//初始加载图片
$(".faultdetail-content .location img").attr("src", require("../image/faultWork/location2.png"));
$(".faultdetail-content .daoh").attr("src", require("../image/faultWork/daohang.png"));
$(".open-show").attr("src", require("../image/faultWork/merge.png"));//更换自配件关闭
// 遗失物品列表
let lost_arr = []
//开关车门
var carparam = {
    mobile: sessionStorage.getItem("mobile"),
    car_info: ''
}
//转维修工单
var car_id,order_id;
var netlng,netlat;
//获取故障工单详情
myAjax.post(getApiUrl('/vehicle-fault/order-detail'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        if (data.data.is_rental == '1' || data.data.spec_type=='2') {//is_rental是否是租赁中故障工单0不是1是;spec_type0 正常工单 1 租聘中 2 蓝牙问题
            $(".fault-flow .more").addClass("none");
        }
        netlng=data.data.branch_lng;
        netlat=data.data.branch_lat;//该网点的经纬度
        //展示页面
        $(".body").removeClass("none");
        //存储故障工单车辆详情
        sessionStorage.setItem("resultData3", JSON.stringify(data.data));
        //存储车辆id
        sessionStorage.setItem("car_id", data.data.car_id);
        car_id = data.data.car_id;
        order_id = data.data.id;
        //存储故障工单id
        sessionStorage.setItem("order_id", data.data.id);
        carparam.car_info = data.data.plate_no;//赋值车牌号
        let strend = data.data.vin.substring(11, 17);
        $(".faultdetail-content .plate_no").html(data.data.plate_no + ' ' + '<font class="font1">(' + strend + ')</font>');//车牌号，Vin
        $(".faultdetail-content .trouble_id").text(data.data.car_status);//车辆状态
        $(".faultdetail-content .status_name").text(data.data.status_name);//状态
        $(".faultdetail-content .remain_km").text('约续航' + data.data.remain + '公里');//续航里程
        $(".faultdetail-content .brand_name").text(data.data.brand_name + ' ' + data.data.model_name);//车辆品牌
        if (data.data.biz_type == '0') {
            $(".faultdetail-content .mapb").attr("src", require('../image/mapb.png'));
        } else if (data.data.biz_type == '1') {
            $(".faultdetail-content .mapb").attr("src", require('../image/map-B.png'));
        } else if (data.data.biz_type == '2') {
            $(".faultdetail-content .mapb").attr("src", require('../image/mapoiler.png'));
        }
        $(".branch_addr").text(data.data.branch_name);//停车位置
        //新增上报故障类型，备注信息展示
        $(".troule-type").text('上报类型：' + data.data.up_type_name + '-' + data.data.up_cate_name);
        if(data.data.remark!=''){
            $(".trouble-remark").text('备注：' + data.data.remark);
        }
        //隐藏处理车辆问题记录
        if (data.data.has_problem == '0') {//0为没有，1为有，有的话不需要还车拍照
            $(".problemrecord").remove();
            if(data.data.photo_flag==1){//0不需要拍照，1为需要拍照
                $(".returnphoto font").text("3.");
                $(".endworkpage font").text("4.");
                $(".returnphoto").removeClass("none");
            }else{
                $(".endworkpage font").text("3.");
            }
        }else{//不需要还车拍照
            $(".endworkpage font").text("4.");
        }
        if (data.data.status == '1') {
            let list = data.data.items;
            for (var i = 0; i < list.length; i++) {
                if (list[i].item_id == '2') {
                    $(".change-before").addClass("check");
                    $(".change-before font").text("查看更换前拍照");
                    $(".open-show").attr("src", require("../image/faultWork/show1.png"));//更换自配件展开
                    $(".open-show").parent().removeClass("true");
                    continue;
                }
                if (list[i].item_id == '3') {
                    $(".change-parts").addClass("check");
                    $(".change-parts font").text("查看更换配件")
                    continue;
                }
                if (list[i].item_id == '4') {
                    $(".change-after").addClass("check");
                    $(".change-after font").text("查看更换后拍照");
                    continue;
                }
            }
        }

        //故障优化新增,添加处理类型
        $(".adddealtype").on("click",function(){
            if(data.data.step==5){
                new Toast("您已进行还车拍照，请先结束工单")
            }else{
                if(data.data.step==4){
                    location.href="./dealtroubletype.html?record=1";
                }else{
                    location.href="./dealtroubletype.html";
                }
            }
        });

        //跳转更换配件页面
        $(".change-parts").on("click", function () {
            if (data.data.status == '1') {
                if ($(".change-before").hasClass("check")) {
                    if ($(this).hasClass("check")) {
                        location.href = "./changeparts.html?item_id=3";
                    } else {
                        location.href = "./changeparts.html";
                    }
                } else {
                    new Toast("请先进行更换前拍照")
                }
            }
        });
        //跳转结束工单页面
        $(".endworkpage").on("click", function () {
            if(data.data.photo_flag==1) {//0不需要拍照，1为需要拍照
                if (data.data.is_rental == '1') {//租赁中不需要还车拍照
                    location.href = "../../manageFaultwork/index.html#/endOrder?is_rental=1";
                }else{
                    if(data.data.step==5){
                        if (data.data.spec_type=='2') {//is_rental是否是租赁中故障工单0不是1是;spec_type0 正常工单 1 租聘中 2 蓝牙问题
                            location.href = "../../manageFaultwork/index.html#/endOrder?is_rental=1";
                        } else {
                            location.href = "../../manageFaultwork/index.html#/endOrder";
                        }
                    }else if(data.data.step==4){
                        if(data.data.has_problem == '0'){//没有问题记录单
                            new Toast("请先添加还车拍照")
                        }else{//有问题记录单,不用还车拍照
                            location.href = "../../manageFaultwork/index.html#/endOrder";
                        }
                    }
                }
            }else{
                if(data.data.step==4){
                    if (data.data.is_rental == '1' || data.data.spec_type=='2') {//is_rental是否是租赁中故障工单0不是1是;spec_type0 正常工单 1 租聘中 2 蓝牙问题
                        location.href = "../../manageFaultwork/index.html#/endOrder?is_rental=1";
                    } else {
                        location.href = "../../manageFaultwork/index.html#/endOrder";
                    }
                }else{
                    new Toast("请先添加处理类型")
                }
            }
        });

        //新增去往车辆当前位置
        $(".faultdetail-content .location").on("click",function(){
            location.href = "../oilerSingle/carLocation.html?name="+data.data.plate_no;
        });
    } else {
        new Toast(data.msg)
    }
});

//获取操作历史记录
myAjax.post(getApiUrl('/vehicle-fault/operate-history'), {
    mobile: sessionStorage.getItem('mobile'),
    order_id: sessionStorage.getItem('order_id')//故障工单id
}, function (data) {
    if (data.status == '0') {
        let str = '';
        for (var i = 0; i < data.data.length; i++) {
            let checkli = '';
            if (data.data[i].item_id == '2') {
                checkli = '<span class="check check-before right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
            } else if (data.data[i].item_id == '3') {
                checkli = '<span class="check check-part right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
            } else if (data.data[i].item_id == '4') {
                checkli = '<span class="check check-after right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
            } else if (data.data[i].item_id == '10') {
                checkli = '<span class="check check-payment right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
            }
            str += '<li><span class="span1">' + data.data[i].time + '</span>' + checkli + '<span class="span2">' + data.data[i].operate + '</span><br/><span class="span3">' + data.data[i].real_name + '</span>' +
                '<span class="span4">(' + data.data[i].user_name + ')</span><span>' + data.data[i].remark + '</span></li>';
        }
        $(".history-list").html(str);
        //跳转查看更换配件前
        $(".check-before").on("click", function () {
            window.location.href = "./checkbeforephoto.html?record_id=" + $(this).find(".id").val();
        });
        //跳转查看更换配件页面
        $(".check-part").on("click", function () {
            window.location.href = "./changeparts.html?record_id=" + $(this).find(".id").val() + "&finshed=1";
        });
        //跳转查看更换配件后
        $(".check-after").on("click", function () {
            window.location.href = "./checkafterphoto.html?record_id=" + $(this).find(".id").val();
        });
        //跳转查看缴费信息页
        $(".check-payment").on("click", function () {
            window.location.href = "./checkpayment2.html?record_id=" + $(this).find(".id").val();
        });
    } else {
        new Toast(data.msg);
    }
});

//更换自配件打开与关闭
$(".open-show").on("click", function () {
    if ($(this).parent().hasClass("true")) {
        $(this).attr("src", require("../image/faultWork/show1.png"));//更换自配件展开
        $(this).parent().removeClass("true");
    } else {
        $(this).attr("src", require("../image/faultWork/merge.png"));//更换自配件关闭
        $(this).parent().addClass("true");
    }
});

//跳转更换前拍照页面
$(".change-before").on("click", function () {
    if ($(this).hasClass("check")) {
        location.href = "./beforephoto.html?item_id=2";
    } else {
        location.href = "./beforephoto.html";
    }
});
//跳转更换后拍照页面
$(".change-after").on("click", function () {
    if ($(this).hasClass("check")) {
        location.href = "./afterphoto.html?item_id=4";
    } else {
        location.href = "./afterphoto.html";
    }
});
//跳转处理车辆问题记录页面
$(".problemrecord").on("click", function () {
    location.href = "./cartrouble.html";
});

//跳转还车拍照页面
$(".returnphoto").on("click",function(){
    location.href = "./returncarphoto.html";
});

//打开更多弹框
$(".fault-flow .more").on("click", function () {
    $(".alert_window").removeClass("none");
});
//关闭更多弹框
$(".alert_window .close-icon").on("click", function () {
    $(".alert_window").addClass("none");
});

//出场缴费跳转页面
$(".payment").on("click", function () {
    location.href = "./faultpayment.html";
});
//添加跟进记录跳转页面
$(".addrcord").on("click", function () {
    location.href = "./addfollowrecord.html";
});
//添加跟进记录跳转页面 xurr 1031
$(".service").on("click", function () {
    window.location.href = "../../manageOrderService/index.html#/createOrder?source=1&car_id="+car_id+"&order_id="+order_id;
});
//转交其他组处理跳转页面
$(".needother").on("click", function () {
    location.href = "./passothergroup.html";
});
//转交故障组处理跳转页面
$(".needother2").on("click", function () {
    location.href = "./troubletotrouble.html";
});
//网点查询
$(".select-net").on("click", function () {
    window.location.href = "../../endwork/index.html#/selectmapnet2"
});
//开门
$(".open-door").on("click", function () {
    myAjax.post(getApiUrl('/car/open-door'), carparam, function (res) {
      if (res.data.length > 0) {
        lost_arr = res.data
        dealLostGoods()
      } else {
        new Toast(res.msg);
      }
    });
});
//锁门
$(".close-door").on("click", function () {
    myAjax.post(getApiUrl('/car/close-door'), carparam, function (res) {
      if(res.data.length > 0){
        lost_arr = res.data
        dealLostGoods()
      }else{
        new Toast(res.msg);
      }
    });
});


$('#lost_yes').click(function(){
  myAjax.post(getApiUrl('/lost-record/confirm'), {
    mobile: sessionStorage.getItem("mobile"),
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
    status:1,
    order_id:lost_arr[0].id
  }, function (data) {
    lost_arr.splice(0,1)
    if(lost_arr.length > 0)dealLostGoods()
    else $('.lostBox').hide()
  });
})
$('#lost_no').click(function(){
  myAjax.post(getApiUrl('/lost-record/confirm'), {
    mobile: sessionStorage.getItem("mobile"),
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
    status:2,
    order_id:lost_arr[0].id
  }, function (data) {
    lost_arr.splice(0,1)
    if(lost_arr.length > 0)dealLostGoods()
    else $('.lostBox').hide()
  });
})
$('#lost_cancel').click(function(){
  $('.lostBox').hide()
})

function dealLostGoods(){
  let item = lost_arr[0]
  $('#lost').text(item.lost)
  $('#lost_detail').text(item.lost_detail)
  $('.lostBox').show()
}

dd.ready(function () {
    //导航
    var driving;
    AMap.plugin(["AMap.Driving"], function () {
        var drivingOption = {
            policy: AMap.DrivingPolicy.LEAST_TIME,
            map: ''
        };
        driving = new AMap.Driving(drivingOption); //构造驾车导航类

    });
    $(".daoh1").on("click",function(){
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (result) {
                //存储当前位置的经纬度
                sessionStorage.setItem('locationsLng', result.longitude);
                sessionStorage.setItem('locationsLat', result.latitude);
                driving.search(
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [netlng,netlat],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            },
            onFail: function (err) {
                new Toast("获取定位失败")
            }
        });
    });
});