/**
 * Created by Administrator on 2018/6/27.
 */
require('../css/public.css')
require('../css/prepareWork/prepareend.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//开关车门
var carparam = {
    mobile: sessionStorage.getItem("mobile"),
    car_info: ''
}
var imageArray5 = [],//上传倒车雷达照片存储
    imageArray7 = [],//上传夹钥匙照片存储
    imageArray8 = [],//上传刷车贴照片存储
    imageArray9 = [],//上传贴二维码照片存储
    imageArray10 = [],//上传风挡玻璃照片存储
    imageArray11 = [],//上传拖车钩照片存储
    imageArray12 = [],//上传灭火器照片存储
    imageArray13 = [];//上传三角架照片存储
dd.error(function (error) {
    new Toast("钉钉授权失败，请关闭页面重新打开")
});
dd.ready(function () {
    myAjax.post(getApiUrl('/work-order-kerb/order-detail'), {
        mobile: sessionStorage.getItem("mobile"),
        order_id: sessionStorage.getItem("id")
    }, function (data) {
        if (data.status == '0') {
            let str = '',
                strlist = '',
                strstart = data.data.vin.substring(0, 11),
                strend = data.data.vin.substring(11, 17);//vin的后六位
            carparam.car_info = data.data.vin;//vin号
            if (data.data.status == '2') {
                for (var i = 1; i < data.data.items.length; i++) {
                    if (data.data.items[i].type == '3') {//扫码
                        if (data.data.items[i].item_id == '4') {
                            if (data.data.items[i].result.type == '1') {//立刻自研
                                strlist += '<li><span class="span1">' + data.data.items[i].item_name + ' : ' + data.data.items[i].result.tbox_no + '</span><span class="span0"><img src=""/></span>' +
                                    '<div class="div1"><p class="qube"><span class="qube-left"><input type="radio" class="" name="check" value="1" checked disabled/>立刻自研</span><span class="qube-right"><input type="radio" class="" name="check" value="2" disabled/>自由快车</span></p><p class="sim_p">SIM卡号 : ' + data.data.items[i].result.SIM + '</p></div></li>';
                            } else if (data.data.items[i].result.type == '2') {//自由快车
                                strlist += '<li><span class="span1">' + data.data.items[i].item_name + ' : ' + data.data.items[i].result.tbox_no + '</span><span class="span0"><img src=""/></span>' +
                                    '<div class="div1"><p class="qube"><span class="qube-left"><input type="radio" class="" name="check" value="1"  disabled/>立刻自研</span><span class="qube-right"><input type="radio" class="" name="check" value="2" checked disabled/>自由快车</span></p></div></li>';
                            }
                        } else {
                            strlist += '<li><span class="span1">' + data.data.items[i].item_name + ' : ' + data.data.items[i].result + '</span><span class="span0"><img src=""/></span></li>';
                        }
                    } else if (data.data.items[i].type == '2') {//拍照
                        let text;
                        if (data.data.items[i].item_id == '5') {
                            text = ['雷达显示屏'];
                            imageArray5 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '7') {
                            text = ['铝扣及钥匙'];
                            imageArray7 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '8') {
                            text = ['左侧logo', '右侧logo'];
                            imageArray8 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '9') {
                            text = ['左侧二维码', '右侧二维码'];
                            imageArray9 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '10') {
                            text = ['挡风玻璃右上角照片'];
                            imageArray10 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '11') {
                            text = ['内拖车钩位置'];
                            imageArray11 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '12') {
                            text = ['内灭火器位置'];
                            imageArray12 = data.data.items[i].result;
                        } else if (data.data.items[i].item_id == '13') {
                            text = ['内三角架位置'];
                            imageArray13 = data.data.items[i].result;
                        }
                        strlist += '<li><span class="span1">' + data.data.items[i].item_name + '</span><span class="span0"><img src=""/></span>' +
                            '<div class="div1"><input type="hidden" value="' + data.data.items[i].item_id + '" class="item_id"/><div class="photo-img"><img src="' + data.data.items[i].result[0] + '" /><input class="image" type="hidden" value="' + data.data.items[i].result[0] + '"/><p>' + text[0] + '</p></div>'
                        if (data.data.items[i].extra == '2') {
                            strlist += '<div class="photo-img"><img src="' + data.data.items[i].result[1] + '" /><input class="image" type="hidden" value="' + data.data.items[i].result[1] + '"/><p>' + text[1] + '</p></div>'
                        }
                        strlist += '</div></li>';
                    } else if (data.data.items[i].type == '1') {//确认
                        if (data.data.items[i].item_id == '18') {
                            strlist += '<li class="test-li"><span class="span1">测试</span><div class="div1"></div><p><span class="test-span1">' + data.data.items[i].item_name + '</span><span>开关门 鸣笛 闪灯</span><br/><span>续航里程 <font>124</font> 公里</span><span class="test-lastspan">合格<img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '"/></span></p>';
                        } else if (data.data.items[i].item_id == '19') {
                            strlist += '<p><span class="test-span1">' + data.data.items[i].item_name + '</span><span>有线/无线gps定位</span><br/><span>或信号正常</span><span class="test-spanright">合格<img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '"/></span></p>';
                        } else if (data.data.items[i].item_id == '20') {
                            strlist += '<p><span class="test-span1">' + data.data.items[i].item_name + '</span><span>前后雷达报警正常</span><span class="test-spanright">合格<img class="check-g" src="' + require('../image/prepareWork/true-gray.png') + '"/></span></p>';
                        } else {
                            strlist += '<li><span class="span1">' + data.data.items[i].item_name + '</span><span class="span0"><img src="" /></span></li>';

                        }
                    }
                }
            } else {
                new Toast('工单未完成')
            }
            str += '<span>' + data.data.plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span>整备' + data.data.id + '</span>' +
                '<span class="color_status">' + data.data.status_name + '</span><span>' + data.data.brand_name + ' ' + data.data.model_name + '</span><p><img src="' + require('../image/prepareWork/net-name.png') + '"/>' + data.data.branch_name + '<span class="do-history right">操作历史 &#xe623;</span> </p>';
            $(".prepareend-content").html(str);
            $(".prepareend-list").html(strlist);
            $(".prepareend-list .span0 img").attr("src", require('../image/prepareWork/true-green.png'));//green钩选
            $(".prepareend-list .check-g").attr("src", require('../image/prepareWork/true-green.png'));//green钩选
            //展示页面
            $("body").removeClass("none");
            //续航里程接口
            sessionStorage.setItem("car_id", data.data.car_id);//存储车辆id
            endurance();
            $(".photo-img img").on("click", function () {
                let btn = $(this);
                //查看图片
                let imageArray = [];
                if (btn.parent().parent().find(".item_id").val() == '5') {
                    imageArray = imageArray5;
                } else if (btn.parent().parent().find(".item_id").val() == '7') {
                    imageArray = imageArray7;
                } else if (btn.parent().parent().find(".item_id").val() == '8') {
                    imageArray = imageArray8;
                } else if (btn.parent().parent().find(".item_id").val() == '9') {
                    imageArray = imageArray9;
                } else if (btn.parent().parent().find(".item_id").val() == '10') {
                    imageArray = imageArray10;
                } else if (btn.parent().parent().find(".item_id").val() == '11') {
                    imageArray = imageArray11;
                } else if (btn.parent().parent().find(".item_id").val() == '12') {
                    imageArray = imageArray12;
                } else if (btn.parent().parent().find(".item_id").val() == '13') {
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
            });
            //操作历史跳转页
            $(".do-history").on("click", function () {
                window.location.href = "./preparehistory.html";
            });
        } else {
            new Toast(data.msg)
        }
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
});
//网点查询
$(".prepareend-btn .select-net").on("click", function () {
    window.location.href = "../../endwork/index.html#/selectmapnet2"
});