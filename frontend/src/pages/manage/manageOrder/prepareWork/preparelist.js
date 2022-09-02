/**
 * Created by Administrator on 2018/5/7.
 */
require('../css/public.css')
require('../css/prepareWork/preparelist.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//初始化整备工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    city_id: sessionStorage.getItem('city_id'),//权限城市id
    page: 1, //页数
    limit: 10,//每页大小
    status: [0,1,2]
};
//手动固定父元素的高，否则scroll不起作用
$('.prepareList').height($(window).height() - $('.prepare-content').height());
show(param)
function show(param) {
    param.status = param.status.join(',');
    param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
    var recordrentList = {};
    $.post(getApiUrl('/work-order-kerb/order-list'), param, function (data) {
        recordrentList = data;
        if (data.status == '0') {
            var str = '',
                strstart = '',
                strend = '';
            if(recordrentList.data.length==0){
                new Toast("暂无数据")
            }else{
                for (var i = 0; i < recordrentList.data.length; i++) {
                    strstart = recordrentList.data[i].vin.substring(0, 11);
                    strend = recordrentList.data[i].vin.substring(11, 17);
                    str += '<li class="carDetail"><input type="hidden" value="' + recordrentList.data[i].id + '" class="workId"/><input class="carworkstate" type="hidden" value="' + recordrentList.data[i].status + '"/><span>' + recordrentList.data[i].plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span>整备' + recordrentList.data[i].id + '</span>' +
                        '<span>' + recordrentList.data[i].status_name + '</span><span>' + recordrentList.data[i].brand_name + ' ' + recordrentList.data[i].model_name + '</span><p><img src="'+require('../image/prepareWork/net-name.png')+'"/>' + recordrentList.data[i].branch_name + '<span class="right">完成：' + recordrentList.data[i].ready_num + '/' + recordrentList.data[i].total_num + '</span> </p></li>';
                }
            }
            $(".prepareList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.prepareList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '',
                            strstart = '',
                            strend = '';
                        param.page = 1;
                        index = 0;
                        $.post(getApiUrl('/work-order-kerb/order-list'), param, function (data) {
                            let recordrentList = data,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (recordrentList.data.length != 0) {
                                for (var i = 0; i < recordrentList.data.length; i++) {
                                    strstart = recordrentList.data[i].vin.substring(0, 11);
                                    strend = recordrentList.data[i].vin.substring(11, 17);
                                    str += '<li class="carDetail"><input type="hidden" value="' + recordrentList.data[i].id + '" class="workId"/><input class="carworkstate" type="hidden" value="' + recordrentList.data[i].status + '"/><span>' + recordrentList.data[i].plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span>整备' + recordrentList.data[i].id + '</span>' +
                                        '<span>' + recordrentList.data[i].status_name + '</span><span>' + recordrentList.data[i].brand_name + ' ' + recordrentList.data[i].model_name + '</span><p><img src="'+require('../image/prepareWork/net-name.png')+'"/>' + recordrentList.data[i].branch_name + '<span class="right">完成：' + recordrentList.data[i].ready_num + '/' + recordrentList.data[i].total_num + '</span> </p></li>';
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
                        let str = '',
                            strstart = '',
                            strend = '';
                        index++;
                        param.page = index + 1;
                        $.post(getApiUrl('/work-order-kerb/order-list'), param, function (data) {
                            let recordrentList = data,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (recordrentList.data.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < recordrentList.data.length; i++) {
                                    strstart = recordrentList.data[i].vin.substring(0, 11);
                                    strend = recordrentList.data[i].vin.substring(11, 17);
                                    str += '<li class="carDetail"><input type="hidden" value="' + recordrentList.data[i].id + '" class="workId"/><input class="carworkstate" type="hidden" value="' + recordrentList.data[i].status + '"/><span>' + recordrentList.data[i].plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span>整备' + recordrentList.data[i].id + '</span>' +
                                        '<span>' + recordrentList.data[i].status_name + '</span><span>' + recordrentList.data[i].brand_name + ' ' + recordrentList.data[i].model_name + '</span><p><img src="'+require('../image/prepareWork/net-name.png')+'"/>' + recordrentList.data[i].branch_name + '<span class="right">完成：' + recordrentList.data[i].ready_num + '/' + recordrentList.data[i].total_num + '</span> </p></li>';
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
//跳转搜索页
$(".oilerContentSelect").on("click", function () {
    window.location.href = '../../endwork/index.html#/rentlistsearch?type=2';
});
//记录打开弹框前已筛选的值
var colorArray = [];
//打开筛选弹框
$(".oilerContentFilter").on("click", function () {
    colorArray = [];
    $(".confirm-carstate span").each(function () {
        if ($(this).hasClass("color")) {
            colorArray.push($(this));
        }
    });
    $(".confirm_window").removeClass("none");
});
//关闭筛选弹框
$(".close-confirm").on("click", function () {
    $(".confirm-carstate span").removeClass("color");
    for (var i = 0; i < colorArray.length; i++) {
        colorArray[i].addClass("color");
    }
    $(".confirm_window").addClass("none");
})

//点击确定按钮关闭弹框
$(".confirm-sure").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        page: 1, //页数
        limit: 10,//每页大小
        status: []
    }
    $(".color").each(function () {
        param.status.push($(this).find("input").val());
        if($(this).find("input").val()==''){
            param.status=[0,1,2];
            return false;
        }
    });
    show(param);
    $(".confirm_window").addClass("none");
})
//刷新页面
$(".oilerContentRefle").on("click", function () {
    let param = {
        mobile: sessionStorage.getItem('mobile'),
        city_id: sessionStorage.getItem('city_id'),//权限城市id
        page: 1, //页数
        limit: 10,//每页大小
        status: []
    }
    $(".color").each(function () {
        param.status.push($(this).find("input").val());
        if($(this).find("input").val()==''){
            param.status=[0,1,2];
            return false;
        }
    });
    show(param);
    new Toast("刷新成功")
})
//点击选项变换颜色
$(".caroiler").on("click", function () {
    if ($(".color").length > 1) {
        if ($(this).hasClass("color")) {
            $(this).removeClass("color");
        } else {
            $(this).addClass("color");
        }
    } else {
        $(this).addClass("color");
    }
    $(".allcaroiler").removeClass("color");
});
//点击重置按钮
$(".confirm-bottom .confirm-reset").on("click", function () {
    $(".caroiler").removeClass("color");
    $(".allcaroiler").addClass("color");
});
//点击全部
$(".allcaroiler").on("click", function () {
    $(".caroiler").removeClass("color");
    $(this).addClass("color");
});
//跳转整备工单页
$(".prepareList").on("click", "li", function () {
    let workId = $(this).find(".workId").val();
    sessionStorage.setItem("id", workId);
    if($(this).find(".carworkstate").val()=='2'){
        window.location.href = "./prepareend.html";
    }else{
        window.location.href = "./preparedetail.html";
    }
});
