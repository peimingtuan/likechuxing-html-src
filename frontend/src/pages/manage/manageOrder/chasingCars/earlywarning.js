/**
 * Created by Administrator on 2018/4/9.
 */
require('../css/public.css')
require('../css/chasingCars/earlywarning.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import PullUpDown from '../../../../component/pullDonwRefresh/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//初始化我的加油工单接口
var param = {
    mobile: sessionStorage.getItem('mobile'),
    page: 1, //页数
    page_size: 10,//每页大小
    order_column:'6',//时间或金额
    order_dir:'DESC',//倒序或正序
    status: []
};
//手动固定父元素的高，否则scroll不起作用
$('.charingList').height($(window).height() - $('.charing-content').height());
show(param)
function show(param) {
    param.status = param.status.join(',');
    param.PhoneInfo = sessionStorage.getItem("PhoneInfo") || '';
    var recordrentList={};
    $.post(getApiUrl('/car-catch/list'), param, function (data) {
        recordrentList=data;
        if(data.status=='0'){
            var str = '';
            if (recordrentList.data.list.length != 0) {
                for (var i = 0; i < recordrentList.data.list.length; i++) {
                    str += '<li class="carDetail"><input type="hidden" value="' + recordrentList.data.list[i].id + '" class="charing_id"/><span>' + recordrentList.data.list[i].plate_no + '</span><span>'+recordrentList.data.list[i].status_des+'</span><br/>' +
                        '<span>' + recordrentList.data.list[i].car_model + '</span><br/><span>时长：' + recordrentList.data.list[i].total_time + '</span><br/><span>欠费金额：'+ recordrentList.data.list[i].arrearage+'</span></li>';
                }
            }else{
                new Toast("暂无数据")
            }
            $(".charingList").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.charingList'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page =1;
                        index = 0;
                        $.post(getApiUrl('/car-catch/list'), param, function (data) {
                            let recordrentList=data,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (recordrentList.data.list.length != 0) {
                                for (var i = 0; i < recordrentList.data.list.length; i++) {
                                    str += '<li class="carDetail"><input type="hidden" value="' + recordrentList.data.list[i].id + '" class="charing_id"/><span>' + recordrentList.data.list[i].plate_no + '</span><span>'+recordrentList.data.list[i].status_des+'</span><br/>' +
                                        '<span>' + recordrentList.data.list[i].car_model + '</span><br/><span>时长：' + recordrentList.data.list[i].total_time + '</span><br/><span>欠费金额：'+ recordrentList.data.list[i].arrearage+'</span></li>';
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
                        $.post(getApiUrl('/car-catch/list'), param, function (data) {
                            let recordrentList=data,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (recordrentList.data.list.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < recordrentList.data.list.length; i++) {
                                    str += '<li class="carDetail"><input type="hidden" value="' + recordrentList.data.list[i].id + '" class="charing_id"/><span>' + recordrentList.data.list[i].plate_no + '</span><span>'+recordrentList.data.list[i].status_des+'</span><br/>' +
                                        '<span>' + recordrentList.data.list[i].car_model + '</span><br/><span>时长：' + recordrentList.data.list[i].total_time + '</span><br/><span>欠费金额：'+ recordrentList.data.list[i].arrearage+'</span></li>';
                                }
                                that.appendContent(str);
                                cb(true)
                            }
                        });
                    }, 400)
                }
            })
        }else {
            new Toast(data.msg)
        }
    });
}
//打开排序弹框
$(".oilerContentSelect").on("click", function () {
    $(".confirm_window2").removeClass("none");
});
//关闭排序弹框
$(".close-confirm2").on("click", function () {
    $(".confirm_window2").addClass("none");
})
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

//点击筛选确定按钮关闭弹框
$(".confirm-sure").on("click", function () {
    var param = {
        mobile: sessionStorage.getItem('mobile'),
        page: 1, //页数
        page_size: 10,//每页大小
        order_column:'',//时间或金额
        order_dir:'',//倒序或正序
        status: []
    }
    $(".color").each(function () {
        param.status.push($(this).find("input").val());
    });
    $(".sortcar-color").each(function () {
        param.order_column=$(this).find("input").val();
        param.order_dir='DESC';
    });
    show(param);
    $(".confirm_window").addClass("none");
})
//点击排序确定按钮关闭弹框
$(".confirm-sure2").on("click", function () {
    var param = {
        mobile: sessionStorage.getItem('mobile'),
        page: 1, //页数
        page_size: 10,//每页大小
        order_column:'',//时间或金额
        order_dir:'',//倒序或正序
        status: []
    }
    $(".color").each(function () {
        param.status.push($(this).find("input").val());
    });
    $(".sortcar-color").each(function () {
        param.order_column=$(this).find("input").val();
        param.order_dir='DESC';
    });
    show(param);
    $(".confirm_window2").addClass("none");
})
//刷新页面
$(".oilerContentRefle").on("click", function () {
    var param = {
        mobile: sessionStorage.getItem('mobile'),
        page: 1, //页数
        page_size: 10,//每页大小
        order_column:'',//时间或金额
        order_dir:'',//倒序或正序
        status: []
    }
    $(".color").each(function () {
        param.status.push($(this).find("input").val());
    });
    $(".sortcar").each(function () {
        param.order_column=$(this).find("input").val();
        param.order_dir='DESC';
    });
    show(param);
    new Toast("刷新成功")
})
//点击筛选选项变换颜色
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
//点击筛选重置按钮
$(".confirm-bottom .confirm-reset").on("click", function () {
    $(".caroiler").removeClass("color");
    $(".allcaroiler").addClass("color");
});
//点击筛选全部
$(".allcaroiler").on("click", function () {
    $(".caroiler").removeClass("color");
    $(this).addClass("color");
});
//点击排序选项变换颜色
$(".sortcar").on("click", function () {
    $(".sortcar").removeClass("sortcar-color");
    $(this).addClass("sortcar-color");
});
//跳转追车详情页
$(".charingList").on("click", "li", function () {
    window.location.href = "./carchasedetail.html?rental_id="+$(this).find(".charing_id").val();
});