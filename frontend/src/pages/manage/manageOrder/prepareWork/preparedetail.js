/**
 * Created by Administrator on 2018/5/7.
 */
require('../css/public.css')
require('../css/prepareWork/preparedetail.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import ddConfigs from '../js/ddConfigs'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
ddConfigs.config();//钉钉授权
//工单详情接口
var param = {
    mobile: sessionStorage.getItem("mobile"),
    order_id: sessionStorage.getItem("id")
}
//开关车门
var carparam = {
    mobile: sessionStorage.getItem("mobile"),
    car_info: ''
}
var length5 = 0,
    imageArray5 = [],//上传倒车雷达照片存储
    length7 = 0,
    imageArray7 = [],//上传夹钥匙照片存储
    length8 = 0,
    imageArray8 = [],//上传刷车贴照片存储
    length9 = 0,
    imageArray9 = [],//上传贴二维码照片存储
    length10 = 0,
    imageArray10 = [],//上传风挡玻璃照片存储
    length11 = 0,
    imageArray11 = [],//上传拖车钩照片存储
    length12 = 0,
    imageArray12 = [],//上传灭火器照片存储
    length13 = 0,
    imageArray13 = [];//上传三角架照片存储
var qube = 0,
    line = 0,
    radar = 0;//定义测试项确认前参数
var result = FoundationTools.syncEvent(param, getApiUrl('/work-order-kerb/order-detail')),
    str = '',
    strstart = '',
    strend = '',
    plate_nolength = '',//车的类型
    datatotal = '',//需要完成项
    color_status = '',//整备中
    status = result.status,
    msg = result.msg,
    data = result.data;
if (status == '0') {
    strstart = data.vin.substring(0, 11);
    strend = data.vin.substring(11, 17);//vin的后六位
    carparam.car_info = data.vin;//vin号
    $(".car-plane .plane-num").val(data.items[0].result.plate_no);//车牌号
    $(".car-plane-itemid").val(data.items[0].item_id);//整备项id
    if (data.items[0].result.is_tmp == '1') {//获取临时车牌号到期时间
        $(".car-plane .span3 input").attr("checked", true);
        $(".date-key").val(data.items[0].result.exprie_time);
        $(".car-plane .span4").removeClass("none");
    }
    //整备状态
    if (data.status == '0') {
        $(".flowstatus .p2 .span3").removeClass("none");
        $(".flowstatus .p2 .span4").addClass("none");
        $(".flowstatus .p2 .span5").addClass("none");
        $(".span-child").css("width", 0);
    } else if (data.status == '1') {
        color_status = 'color_status';//整备中
        $(".flowstatus .p2 .span4 font").text(data.ready_num);//已装备
        $(".flowstatus .p2 .span5 font").text(Number(data.total_num) - Number(data.ready_num));//未装备
        $(".span-child").css("width", Number(data.ready_num) / Number(data.total_num) * 6 + "rem");
    } else if (data.status == '2') {
        $(".flowstatus .p2 .span4").addClass("none");
        $(".flowstatus .p2 .span5").addClass("none");
        $(".span-child").css("width", "6rem");
    }
    let strlist = '',
        strlistend = '',
        testlength = 0,//测试状态
        teststatus = '',//测试是否完成项
        testlist = '<li class="test-li pulldown-li"><span class="span1">测试</span><img class="img1" src=""/><span class="span0 none"><img src=""/></span><span class="span2">&#xe603;</span><div class="test-numlist none div1">',
        classtype = '',
        codetype = '';
    for (var i = 1; i < data.items.length; i++) {
        if (data.items[i].type == '3') {//扫码
            classtype = 'pulldown-li';
            if (data.items[i].status == '0') {
                if (data.items[i].item_id == '4') {
                    strlist += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0 none"><img src=""/></span><span class="span2">&#xe603;</span>' +
                        '<div class="none div1"><p><input type="text" class="code-gps qube-code" maxlength="15" value="" placeholder="请输入车机编码" /><span class="saoma-btn"><img class="saoma" src=""/>点击扫码</span>' +
                        '</p><p class="qube"><span class="qube-left"><input type="radio" class="" name="check" value="1"/>立刻自研</span><span class="qube-right"><input type="radio" class="" name="check" value="2"/>自由快车</span></p><p class="sim_p none"><input type="text" maxlength="13"  placeholder="请输入SIM卡号" class="sim_num" value=""/></p><p><button class="save-code-gps">保存</button></p></div></li>';
                } else {
                    strlist += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0 none"><img src=""/></span><span class="span2">&#xe603;</span>' +
                        '<div class="none div1"><p><input type="text" class="code-gps" maxlength="15" value="" placeholder="请输入GPS码" /><span class="saoma-btn"><img class="saoma" src=""/>点击扫码</span>' +
                        '</p><p><button class="save-code-gps">保存</button></p></div></li>';
                }
            } else if (data.items[i].status == '1') {
                if (data.items[i].item_id == '4') {
                    qube++;//车机测试完成
                    if (data.items[i].result.type == '1') {//立刻自研
                        strlistend += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0"><img src=""/></span><span class="span2">&#xe603;</span>' +
                            '<div class="none div1"><p class="none"><input type="text" class="code-gps qube-code" maxlength="15" value="' + data.items[i].result.tbox_no + '" placeholder="请输入车机编码" /><span class="saoma-btn"><img class="saoma" src=""/>点击扫码</span>' +
                            '</p><p>gps码:<span class="check-gps">' + data.items[i].result.tbox_no + '</span><img class="edit-icon" src=""/></p><p class="qube"><span class="qube-left"><input type="radio" class="" name="check" value="1" checked/>立刻自研</span><span class="qube-right"><input type="radio" class="" name="check" value="2"/>自由快车</span></p><p class="sim_p"><input type="text" maxlength="13" placeholder="请输入SIM卡号"  class="sim_num" value="' + data.items[i].result.SIM + '"/></p><p class="none"><button class="save-code-gps btn-color">保存</button></p></div></li>';
                    } else if (data.items[i].result.type == '2') {//自由快车
                        strlistend += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0"><img src=""/></span><span class="span2">&#xe603;</span>' +
                            '<div class="none div1"><p class="none"><input type="text" class="code-gps qube-code" maxlength="15" value="' + data.items[i].result.tbox_no + '" placeholder="请输入车机编码" /><span class="saoma-btn"><img class="saoma" src=""/>点击扫码</span>' +
                            '</p><p>gps码:<span class="check-gps">' + data.items[i].result.tbox_no + '</span><img class="edit-icon" src=""/></p><p class="qube"><span class="qube-left"><input type="radio" class="" name="check" value="1"/>立刻自研</span><span class="qube-right"><input type="radio" class="" name="check" value="2" checked/>自由快车</span></p><p class="sim_p none"><input type="text" maxlength="13" placeholder="请输入SIM卡号" class="sim_num" value=""/></p><p class="none"><button class="save-code-gps btn-color">保存</button></p></div></li>';
                    } else {
                        strlistend += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0"><img src=""/></span><span class="span2">&#xe603;</span>' +
                            '<div class="none div1"><p class="none"><input type="text" class="code-gps qube-code" maxlength="15" value="' + data.items[i].result.tbox_no + '" placeholder="请输入车机编码" /><span class="saoma-btn"><img class="saoma" src=""/>点击扫码</span>' +
                            '</p><p>gps码:<span class="check-gps">' + data.items[i].result.tbox_no + '</span><img class="edit-icon" src=""/></p><p class="qube"><span class="qube-left"><input type="radio" class="" name="check" value="1"/>立刻自研</span><span class="qube-right"><input type="radio" class="" name="check" value="2"/>自由快车</span></p><p class="sim_p none"><input type="text" maxlength="13" placeholder="请输入SIM卡号" class="sim_num" value=""/></p><p class="none"><button class="save-code-gps btn-color">保存</button></p></div></li>';
                    }
                } else {
                    line++;//有线无线测试完成
                    strlistend += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0"><img src=""/></span><span class="span2">&#xe603;</span>' +
                        '<div class="none div1"><p class="none"><input type="text" class="code-gps" maxlength="15" value="' + data.items[i].result + '" placeholder="请输入GPS码" /><span class="saoma-btn"><img class="saoma" src=""/>点击扫码</span>' +
                        '</p><p class="none"><button class="save-code-gps btn-color">保存</button></p><p>gps码:<span class="check-gps">' + data.items[i].result + '</span><img class="edit-icon" src=""/></p></div></li>';
                }
            }
        } else if (data.items[i].type == '2') {//拍照
            classtype = 'pulldown-li';
            let text;
            switch (Number(data.items[i].item_id)) {
                case 5:
                    text = ['雷达显示屏'];
                    break;
                case 7:
                    text = ['铝扣及钥匙'];
                    break;
                case 8:
                    text = ['左侧logo', '右侧logo'];
                    break;
                case 9:
                    text = ['左侧二维码', '右侧二维码'];
                    break;
                case 10:
                    text = ['挡风玻璃右上角照片'];
                    break;
                case 11:
                    text = ['内拖车钩位置'];
                    break;
                case 12:
                    text = ['内灭火器位置'];
                    break;
                case 13:
                    text = ['内三角架位置'];
                    break;
            }
            if (data.items[i].status == '0') {
                strlist += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><input type="hidden" value="' + data.items[i].extra + '" class="extra"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0 none"><img src=""/></span><span class="span2">&#xe603;</span>' +
                    '<div class="none div1"><p><div class="photo-img2 left"><div class="upload_new2"><img src="" alt="" name="pic" class="img-circle"/><input type="hidden" value="" class="image"/></div><img class="uploadIcon" src=""/><input type="button" value="" name="" class="upload-img"/>' +
                    '<span class="remove-picturIcon none">&#xe601;</span><p>' + text[0] + '</p></div>';
                if (data.items[i].extra == '2') {
                    strlist += '<div class="photo-img2 left"><div class="upload_new2"><img src="" alt="" name="pic" class="img-circle"/><input type="hidden" value="" class="image"/></div><img class="uploadIcon" src=""/><input type="button" value="" name="" class="upload-img"/>' +
                        '<span class="remove-picturIcon none">&#xe601;</span><p>' + text[1] + '</p></div>';
                }
                strlist += '</p><p><button class="save-back-car">保存</button></p></div></li>';
            } else if (data.items[i].status == '1') {
                if (data.items[i].item_id == '5') {
                    radar++;//雷达测试完成
                    imageArray5 = data.items[i].result;
                    length5 = data.items[i].extra;
                } else if (data.items[i].item_id == '7') {
                    imageArray7 = data.items[i].result;
                    length7 = data.items[i].extra;
                } else if (data.items[i].item_id == '8') {
                    imageArray8 = data.items[i].result;
                    length8 = data.items[i].extra;
                } else if (data.items[i].item_id == '9') {
                    imageArray9 = data.items[i].result;
                    length9 = data.items[i].extra;
                } else if (data.items[i].item_id == '10') {
                    imageArray10 = data.items[i].result;
                    length10 = data.items[i].extra;
                } else if (data.items[i].item_id == '11') {
                    imageArray11 = data.items[i].result;
                    length11 = data.items[i].extra;
                } else if (data.items[i].item_id == '12') {
                    imageArray12 = data.items[i].result;
                    length12 = data.items[i].extra;
                } else if (data.items[i].item_id == '13') {
                    imageArray13 = data.items[i].result;
                    length13 = data.items[i].extra;
                }
                strlistend += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><input type="hidden" value="' + data.items[i].extra + '" class="extra"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span0"><img src=""/></span><span class="span2">&#xe603;</span>' +
                    '<div class="none div1"><p><div class="photo-img2 left"><div class="upload_new2"><img src="' + data.items[i].result[0] + '" alt="" name="pic" class="img-circle"/><input type="hidden" value="' + data.items[i].result[0] + '" class="image"/></div><img class="uploadIcon none" src=""/><input type="button" value="" name="" class="upload-img"/>' +
                    '<span class="remove-picturIcon">&#xe601;</span><p>' + text[0] + '</p></div>';
                if (data.items[i].extra == '2') {
                    strlistend += '<div class="photo-img2 left"><div class="upload_new2"><img src="' + data.items[i].result[1] + '" alt="" name="pic" class="img-circle"/><input type="hidden" value="' + data.items[i].result[1] + '" class="image"/></div><img class="uploadIcon none" src=""/><input type="button" value="" name="" class="upload-img"/>' +
                        '<span class="remove-picturIcon">&#xe601;</span><p>' + text[1] + '</p></div>';
                }
                strlistend += '</p><p><button class="save-back-car btn-color">保存</button></p></div></li>';
            }
        } else if (data.items[i].type == '1') {//确认
            if (data.items[i].status == '0') {
                if (data.items[i].item_id == '18' || data.items[i].item_id == '19' || data.items[i].item_id == '20') {
                    if (data.items[i].item_id == '18') {
                        teststatus += testlist + '<p><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="test-span1">' + data.items[i].item_name + '</span><span>开关门 鸣笛 闪灯</span><br/><span>续航里程 <font></font> 公里</span><span class="synchro"><img src="' + require('../image/prepareWork/tongbu.png') + '" />同步油量</span><span class="test-lastspan">合格<img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '"/></span></p>';
                    } else if (data.items[i].item_id == '19') {
                        teststatus += '<p><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="test-span1">' + data.items[i].item_name + '</span><span>有线/无线gps定位</span><br/><span>或信号正常</span><span class="test-spanright">合格<img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '"/></span></p>';
                    } else if (data.items[i].item_id == '20') {
                        teststatus += '<p><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="test-span1">' + data.items[i].item_name + '</span><span>前后雷达报警正常</span><span class="test-spanright">合格<img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '"/></span></p>';
                    }
                } else {
                    classtype = 'check-li';
                    strlist += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span2"><img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '" /></span></li>';
                }
            } else if (data.items[i].status == '1') {
                if (data.items[i].item_id == '18' || data.items[i].item_id == '19' || data.items[i].item_id == '20') {
                    testlength++;
                    if (data.items[i].item_id == '18') {
                        teststatus += testlist + '<p><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="test-span1">' + data.items[i].item_name + '</span><span>开关门 鸣笛 闪灯</span><br/><span>续航里程 <font></font> 公里</span><span class="synchro"><img src="' + require('../image/prepareWork/tongbu.png') + '" />同步油量</span><span class="test-lastspan">合格<img class="check-g" src="' + require('../image/prepareWork/true-green.png') + '"/></span></p>';
                    } else if (data.items[i].item_id == '19') {
                        teststatus += '<p><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="test-span1">' + data.items[i].item_name + '</span><span>有线/无线gps定位</span><br/><span>或信号正常</span><span class="test-spanright">合格<img class="check-g" src="' + require('../image/prepareWork/true-green.png') + '"/></span></p>';
                    } else if (data.items[i].item_id == '20') {
                        teststatus += '<p><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="test-span1">' + data.items[i].item_name + '</span><span>前后雷达报警正常</span><span class="test-spanright">合格<img class="check-g" src="' + require('../image/prepareWork/true-green.png') + '"/></span></p>';
                    }
                } else {
                    classtype = 'check-li';
                    strlistend += '<li class="' + classtype + '"><input type="hidden" value="' + data.items[i].item_id + '" class="item_id"/><span class="span1">' + data.items[i].item_name + '</span><img class="img1" src=""/><span class="span2"><img class="check-g" src="' + require('../image/prepareWork/true-green.png') + '" /></span></li>';
                }
            }
        }
    }
    if (testlength == 3) {
        $(".prepare-list").html(strlist + strlistend + teststatus);
        $(".test-li .span0").removeClass("none");
    } else {
        if (data.ready_num == data.total_num) {
            $(".prepare-list").html(strlist + strlistend + teststatus);
        } else {
            $(".prepare-list").html(strlist + teststatus + strlistend);
            if (testlength > 0) {
                $(".test-li .span2").addClass("transform");
                $(".test-li .span2").css("transform", "rotate(180deg)");
                $(".test-li .span2").css("-webkit-transform", "rotate(180deg)");
                $(".test-li").css("line-height", "1.5rem");
                $(".test-numlist").removeClass("none");
            }
        }
    }
    str += '<span>' + data.plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span>整备' + data.id + '</span>' +
        '<span class="' + color_status + '">' + data.status_name + '</span><span>' + data.brand_name + ' ' + data.model_name + '</span><p><img src="' + require('../image/prepareWork/net-name.png') + '"/>' + data.branch_name + '<span class="do-history right">操作历史 &#xe623;</span> </p>';
    plate_nolength = data.power_type;//车的类型
    datatotal = data.total_num;//需要完成项
    //提交按钮点亮
    if (data.ready_num == data.total_num) {
        $(".submit-btn").addClass("submitbtn-color");
    }
    //完成整备工单提交
    if ($(".submit-btn").hasClass("submitbtn-color")) {
        $(".submit-btn").on("click", function () {
            if ($(".plane-num").val() == '') {
                new Toast("车牌号不能为空")
            } else {
                myAjax.post(getApiUrl('/work-order-kerb/finish-order'), {
                    mobile: sessionStorage.getItem("mobile"),
                    order_id: sessionStorage.getItem("id")
                }, function (data) {
                    if (data.status == '0') {
                        location.href = "./prepareend.html";
                    } else {
                        new Toast(data.msg);
                    }
                });
            }
        });
    }
    //续航里程接口
    sessionStorage.setItem("car_id", data.car_id);//存储车辆id
    endurance();
} else {
    new Toast(msg);
}
$(".prepare-content").html(str);
//初始化加载图片
$(".prepare-content p img").attr("src", require('../image/prepareWork/net-name.png'));
$(".prepare-list li .img1").attr("src", require('../image/prepareWork/show-icon.png'));
$(".pulldown-li .span0 img").attr("src", require('../image/prepareWork/true-green.png'));//green钩选
$(".saoma").attr("src", require('../image/prepareWork/saoma.png'));//扫描图标
$(".uploadIcon").attr("src", require('../image/prepareWork/zhaoxiang.png'));//相机图标
$(".date-icon").attr("src", require('../image/prepareWork/date-icon.png'));//日历icon
$(".edit-icon").attr("src", require('../image/prepareWork/date-icon.png'));//编辑icon
//页面展示
$("body").removeClass("none");
$(".prepare-list li .img1").each(function () {
    switch (Number($(this).parent().find(".item_id").val())) {
        case 6:
            $(this).parent().find(".img1").remove();
            break;
        case 11:
            $(this).parent().find(".img1").remove();
            break;
        case 12:
            $(this).parent().find(".img1").remove();
            break;
        case 13:
            $(this).parent().find(".img1").remove();
            break;
        case 16:
            $(this).parent().find(".img1").remove();
            break;
        case 17:
            $(this).parent().find(".img1").remove();
            break;
        case 18:
            $(this).parent().find(".img1").remove();
            break;
    }
});
//示列说明图标
$(".prepare-list li .img1").on("click", function () {
    window.location.href = "./photoshow.html?item_id=" + $(this).parent().find(".item_id").val();//跳转示列说明页
});
//续航里程接口
function endurance() {
    myAjax.post(getApiUrl('/work-order-kerb/endurance-mileage'), {
        mobile: sessionStorage.getItem("mobile"),
        car_id: sessionStorage.getItem("car_id")
    }, function (data) {
        if (data.status == '0') {
            $(".test-li span font").text(data.data.remain);
        }else{
            new Toast(data.msg)
        }
    });
}
//刷新续航里程
$(".synchro img").on("click", function () {
    endurance();
});
//操作历史跳转页
$(".do-history").on("click", function () {
    window.location.href = "./preparehistory.html";
});

//车牌号下拉框展开
$(".plane-num").on("focus", function () {
    $(".car-plane .span2").css("transform", "rotate(180deg)")
    $(".car-plane .span2").css("-webkit-transform", "rotate(180deg)")
    $(".car-plane .span2").removeClass("transform");
    $(".car-plane").css("height", "7rem")
});
//车牌号下拉框
$(".car-plane .span2").on("click", function () {
    if ($(this).hasClass("transform")) {
        $(this).css("transform", "rotate(180deg)")
        $(this).css("-webkit-transform", "rotate(180deg)")
        $(this).removeClass("transform");
        $(".car-plane").css("height", "7rem")
    } else {
        $(this).css("transform", "rotate(0deg)")
        $(this).css("-webkit-transform", "rotate(0deg)")
        $(this).addClass("transform");
        $(".car-plane").css("height", "1.5rem")
    }
});
//临牌勾选框
$(".choice-check").on("click", function () {
    if ($(this).is(':checked')) {
        $(".car-plane .span4").removeClass("none");
    } else {
        $(".car-plane .span4").addClass("none");
    }
});
//开门
$(".open-door").on("click", function () {
    myAjax.post(getApiUrl('/car/open-door'), carparam, function (data) {
        new Toast(data.msg);
    });
});
//锁门
$(".close-door").on("click", function () {
    myAjax.post(getApiUrl('/car/close-door'), carparam, function (data) {
        new Toast(data.msg);
    });
});
//整备工单项
var paramwork = {
    mobile: sessionStorage.getItem("mobile"),
    order_id: sessionStorage.getItem("id"),
    item_id: '',
    params: {}
}
dd.error(function (error) {
    new Toast("钉钉授权失败，请关闭页面重新打开")
});
dd.ready(function () {
    //日历
    $(".date-icon").on("click", function () {
        dd.biz.util.datepicker({
            format: 'yyyy-MM-dd',
            value: '', //默认显示日期
            onSuccess: function (result) {
                $(".date-key").val(result.value);//日期
            },
            onFail: function (err) {
            }
        })
    });
    $(".date-key").on("focus", function () {
        dd.biz.util.datepicker({
            format: 'yyyy-MM-dd',
            value: '', //默认显示日期
            onSuccess: function (result) {
                $(".date-key").val(result.value);//日期
            },
            onFail: function (err) {
            }
        })
    });
    //保存车牌号
    $(".car-plane .span5").on("click", function () {
        if ($(".plane-num").val() == '') {
            new Toast("请输入车牌号");
            return false;
        } else if ($(".plane-num").val().length < 7) {
            new Toast("请输入正确的车牌号");
            return false;
        } else {
            if (plate_nolength == '2') {
                if ($(".plane-num").val().length != 7) {
                    new Toast("油车的车牌号必须为7位");
                    return false;
                }
            }
            paramwork.params.plate_no = $(".plane-num").val();
        }
        if ($(".date-key").val() != '') {
            paramwork.params.is_tmp = '1';
            paramwork.params.exprie_time = $(".date-key").val();
        }
        paramwork.item_id = $(".car-plane-itemid").val();
        savepreparework2(paramwork);
        $(".car-plane").css("height", "1.4rem");
        $(".car-plane .span2").css("transform", "rotate(0deg)")
        $(".car-plane .span2").css("-webkit-transform", "rotate(0deg)")
        $(".car-plane .span2").addClass("transform");
    });
    //扫描有线，无线GPS码
    $(".saoma-btn").on("click", function () {
        let btn = $(this);
        dd.biz.util.scan({
            type: 'all', // type 为 all、qrCode、barCode，默认是all。
            onSuccess: function (data) {
                btn.parent().find(".code-gps").val(data.text);
                btn.parent().parent().find(".save-code-gps").addClass("btn-color");//保存按钮点亮
            },
            onFail: function (err) {

            }
        })
    });
    //有线，无线GPS保存按钮点亮
    $(".code-gps").on("input", function () {
        if ($(this).val().length > 0) {
            $(this).parent().parent().find(".save-code-gps").addClass("btn-color");
        } else {
            $(this).parent().parent().find(".save-code-gps").removeClass("btn-color");
        }
    });
    //保存有线,无线GPS码
    $(".save-code-gps").on("click", function () {
        if ($(this).hasClass("btn-color")) {
            let re = /^[0-9]+[0-9]*]*$/;
            if (!re.test($(this).parent().parent().find(".code-gps").val())) {
                new Toast("输入的值必须为数字")
                $(this).parent().parent().find(".code-gps").val('');
                return false;
            }
            paramwork.item_id = $(this).parent().parent().parent().find(".item_id").val();
            if ($(this).parent().siblings('.qube').find('span').hasClass('qube-left')) {
                if ($(".qube-code").val().length == 12 || $(".qube-code").val().length == 13) {//校验车机的位数
                    paramwork.params.tbox_no = $(this).parent().parent().find(".code-gps").val();
                    paramwork.params.type = '';
                    $(".qube input").each(function () {
                        if ($(this).is(':checked')) {
                            paramwork.params.type = $(this).val();//车机类型
                        }
                    });
                    if (paramwork.params.type == '') {
                        new Toast("请选择车机类型")
                    } else {
                        if (paramwork.params.type == '1') {
                            if ($(".sim_num").val() == '') {
                                new Toast("请输入SIM卡号");
                                return false;
                            } else {
                                if (!re.test($(".sim_num").val())) {
                                    new Toast("输入的值必须为数字")
                                    $(".sim_num").val('');
                                    return false;
                                } else {
                                    paramwork.params.SIM = $(".sim_num").val();
                                }
                            }
                        }
                        savepreparework(paramwork, $(this).parent().parent().parent())
                    }
                }else{
                    new Toast("车机的编码为12或13位")
                    return false;
                }
            } else {
                paramwork.params.imei_no = $(this).parent().parent().find(".code-gps").val();
                savepreparework(paramwork, $(this).parent().parent().parent())
            }
        }
    });
    var userAgent = navigator.userAgent,
        number = 40,
        isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        number = 80;
    }
    //装备倒车雷达上传图
    $(".upload-img").on("click", function () {
        let btn = $(this);
        if (btn.parent().find(".image").val() == '') {
            //钉钉上传图片，仅支持手机拍照
            dd.biz.util.uploadImageFromCamera({
                compression: true,//(是否压缩，默认为true)
                quality: number, // 图片压缩质量,
                resize: number, // 图片缩放率
                stickers: {   // 水印信息
                    time: "",
                    dateWeather: "",
                    username: "",
                    address: ""
                },
                onSuccess: function (result) {
                        btn.siblings('.upload_new2').find(".img-circle").attr("src", result[0]);
                        btn.siblings('.upload_new2').find(".image").val(result[0]);
                        btn.parent().find(".uploadIcon").addClass("none");
                        btn.parent().find(".remove-picturIcon").removeClass("none");
                        if (btn.parent().parent().parent().find(".item_id").val() == '5') {
                            imageArray5.push(result[0]);
                            length5++;
                            if (length5 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '7') {
                            imageArray7.push(result[0]);
                            length7++;
                            if (length7 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '8') {
                            imageArray8.push(result[0]);
                            length8++;
                            if (length8 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '9') {
                            imageArray9.push(result[0]);
                            length9++;
                            if (length9 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '10') {
                            imageArray10.push(result[0]);
                            length10++;
                            if (length10 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '11') {
                            imageArray11.push(result[0]);
                            length11++;
                            if (length11 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '12') {
                            imageArray12.push(result[0]);
                            length12++;
                            if (length12 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        } else if (btn.parent().parent().parent().find(".item_id").val() == '13') {
                            imageArray13.push(result[0]);
                            length13++;
                            if (length13 > btn.parent().parent().parent().find(".extra").val() - 1) {
                                btn.parent().parent().parent().find(".save-back-car").addClass("btn-color");
                            } else {
                                btn.parent().parent().parent().find(".save-back-car").removeClass("btn-color");
                            }
                        }
                },
                onFail: function (err) {

                }
            });
        } else {
            let imageArray = [];
            if (btn.parent().parent().parent().find(".item_id").val() == '5') {
                imageArray = imageArray5;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '7') {
                imageArray = imageArray7;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '8') {
                imageArray = imageArray8;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '9') {
                imageArray = imageArray9;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '10') {
                imageArray = imageArray10;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '11') {
                imageArray = imageArray11;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '12') {
                imageArray = imageArray12;
            } else if (btn.parent().parent().parent().find(".item_id").val() == '13') {
                imageArray = imageArray13;
            }
            //图片浏览器
            dd.biz.util.previewImage({
                urls: imageArray,//图片地址列表,数组
                current: btn.parent().find(".image").val(),//当前显示的图片链接
                onSuccess: function (result) {
                    /**/
                },
                onFail: function (err) {
                    new Toast("查看大图失败")
                }
            });
        }
    });
    //移除当前图片
    $(".remove-picturIcon").on("click", function () {
        if ($(this).parent().parent().parent().find(".item_id").val() == '5') {
            length5--;
            if (length5 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray5.indexOf($(this).parent().find(".image").val());
            imageArray5.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '7') {
            length7--;
            if (length7 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray7.indexOf($(this).parent().find(".image").val());
            imageArray7.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '8') {
            length8--;
            if (length8 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray8.indexOf($(this).parent().find(".image").val());
            imageArray8.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '9') {
            length9--;
            if (length9 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray9.indexOf($(this).parent().find(".image").val());
            imageArray9.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '10') {
            length10--;
            if (length10 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray10.indexOf($(this).parent().find(".image").val());
            imageArray10.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '11') {
            length11--;
            if (length11 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray11.indexOf($(this).parent().find(".image").val());
            imageArray11.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '12') {
            length12--;
            if (length13 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray12.indexOf($(this).parent().find(".image").val());
            imageArray12.splice(index, 1);
        } else if ($(this).parent().parent().parent().find(".item_id").val() == '13') {
            length13--;
            if (length13 > $(this).parent().parent().parent().find(".extra").val() - 1) {
                $(this).parent().parent().parent().find(".save-back-car").addClass("btn-color");
            } else {
                $(this).parent().parent().parent().find(".save-back-car").removeClass("btn-color");
            }
            let index = imageArray13.indexOf($(this).parent().find(".image").val());
            imageArray13.splice(index, 1);
        }
        $(this).addClass("none");
        $(this).parent().find(".uploadIcon").removeClass("none");
        $(this).parent().find(".img-circle").attr("src", "");
        $(this).parent().find(".image").val("");
    });
    //保存图片
    $(".save-back-car").on("click", function () {
        let btn=$(this);
        if (btn.hasClass("btn-color")) {
            let array = [];
            btn.parent().parent().find(".image").each(function () {
                array.push($(this).val())
            })
            paramwork.item_id = btn.parent().parent().parent().find(".item_id").val();
            paramwork.params.photo = array.toString();
            savepreparework(paramwork, btn.parent().parent().parent())
        }
    });
    //确认钩选项
    $(".check-li").on("click", ".check-g", function () {
        paramwork.item_id = $(this).parent().parent().find(".item_id").val();
        paramwork.params.status = '1';
        savepreparework(paramwork, $(this).parent().parent())
    });
    //测试项勾选确认
    $(".test-li .div1 p").on("click", '.check-g', function () {
        paramwork.item_id = $(this).parent().parent().find(".item_id").val();
        paramwork.params.status = '1';
        if (paramwork.item_id == '18') {
            if (qube == '1') {
                savepreparework(paramwork, $(this).parent().parent())
            } else {
                new Toast("请先整备车机项")
            }
        } else if (paramwork.item_id == '19') {
            if (line == '2') {
                savepreparework(paramwork, $(this).parent().parent())
            } else {
                new Toast("请先整备有线无线GPS项")
            }
        } else if (paramwork.item_id == '20') {
            if (radar == '1') {
                savepreparework(paramwork, $(this).parent().parent())
            } else {
                new Toast("请先整备雷达项")
            }
        }
    });
    //整备工单操作接口
    function savepreparework(paramwork, btn) {
        myAjax.post(getApiUrl('/work-order-kerb/operate'), paramwork, function (data) {
            new Toast(data.msg);
            if (data.status == '0') {
                location.reload();
            }
        });
    }

    //整备工单保存车牌号
    function savepreparework2(paramwork) {
        myAjax.post(getApiUrl('/work-order-kerb/operate'), paramwork, function (data) {
            new Toast(data.msg);
            if (data.status == '0') {
                $(".flowstatus .p2 .span4 font").text(data.data.reday_num);//已装备
                $(".flowstatus .p2 .span5 font").text(Number(datatotal) - Number(data.data.reday_num));//未装备
                $(".span-child").css("width", Number(data.data.reday_num) / Number(datatotal) * 6 + "rem");
                //提交按钮点亮
                if (data.data.reday_num == datatotal) {
                    $(".submit-btn").addClass("submitbtn-color");
                }
            }
        });
    }
});

//列表下拉框
$(".prepare-list .pulldown-li").on("click", ".span2", function () {
    if (!$(this).hasClass("transform")) {
        $(this).css("transform", "rotate(180deg)")
        $(this).css("-webkit-transform", "rotate(180deg)")
        $(this).addClass("transform");
        if ($(this).parent().hasClass("test-li")) {
            $(this).parent().css("line-height", '1.5rem');
        }
        $(this).siblings("div").removeClass("none");
    } else {
        $(this).css("transform", "rotate(0deg)")
        $(this).css("-webkit-transform", "rotate(0deg)")
        $(this).removeClass("transform");
        if ($(this).parent().hasClass("test-li")) {
            $(this).parent().css("line-height", '2.4rem');
        }
        $(this).siblings("div").addClass("none");
    }
});

//二次编辑扫码信息
$(".edit-icon").on("click", function () {
    $(this).parent().addClass("none");
    $(this).parent().siblings("p").removeClass("none");
    if ($(this).parent().siblings("p").hasClass("sim_p")) {
        $(".qube input").each(function () {
            if ($(this).is(':checked') && $(this).val() == '2') {
                $(".sim_p").addClass("none");
            }
        });
    }
});

//选择车机类型
$(".qube input").on("click", function () {
    if ($(this).is(':checked') && $(this).val() == '1') {
        $(".sim_p").removeClass("none");
    } else {
        $(".sim_p").addClass("none");
    }
});