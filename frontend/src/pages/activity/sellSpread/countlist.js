/**
 * Created by Administrator on 2018/4/25.
 */
require('./css/countlist.css')
import $ from 'jquery'
require('../../../component/rem')
import toast from '../../../component/toast'
import myAjax from '../../../component/myAjax/withJq.js'
import getApiUrl from '../../../js/getApiUrl'
import PullUpDown from '../../../component/pullDonwRefresh/index'
import Loading from '../../../component/loading'
var loading = new Loading()//加载loading
//初始化加载图片
$(".select img").attr("src", require("./images/select.png"));
//管理员统计汇总
myAjax.post(getApiUrl('/activity-house/collection-count'), {
    uuid: localStorage.getItem("uuid"),
    sign: localStorage.getItem("sign")
}, function (data) {
    if (data.status == '0') {
        $(".top .p1 .left").text(data.data.house_count + "人");//销售
        $(".top .p1 .pass").text(data.data.user_total_count + "人");//销售
        $(".top .p1").append("<span class='right'>&#xe6cb; " + data.data.reward + "</span>");//认证通过奖励金额
        if ($("body").find(".load")) {
            loading.destroy()//清除loading
        }
        $(".top").removeClass("none");
    } else {
        toast(data.msg)
        if ($("body").find(".load")) {
            loading.destroy()//清除loading
        }
        $(".top").removeClass("none");
        if(data.msg=='登录信息验证失败'){
            setTimeout(function(){
                localStorage.removeItem("uuid");
                window.location.href="./index.html";
            },2000);
        }
    }
});
setTimeout(function () {
    if ($("body").find(".load")) {
        loading.destroy()//清除loading
    }
}, 3000)
//手动固定父元素的高，否则scroll不起作用
$('.count-list2').height($(window).height() - $('.top').height());
//管理员汇总列表接口
var param = {
    uuid: localStorage.getItem("uuid"),
    sign: localStorage.getItem("sign"),
    name: '',
    page: '1'
}
show(param);
//搜索查询
$(".select-btn").on("click", function () {
    param.name = $(".select-value").val();
    show(param);
});
function show(param) {
    myAjax.post(getApiUrl('/activity-house/collection-list'), param, function (data) {
        var recordrentList = data;
        if (data.status == '0') {
            let str = '',
                reward,//奖励金额字段
                color,//奖励金额标注的颜色
                list = recordrentList.data.list;
            if (list.length == 0) {
                toast("该搜索没有找到数据")
            }
            str += '<li class="li1"><p class="p0"><span class="span1">' + list[0].name + '</span><span class="span2">认证通过<font>' + list[0].user_count + '</font>人</span><span class="span3">奖励金额 <font>&#xe6cb; ' + list[0].reward + '</font></span></p></li>';
            for (var i = 1; i < list.length; i++) {
                if (list[i].reward == '0') {
                    reward = '一';
                    color = 'color';
                } else {
                    reward = list[i].reward;
                    color = '';
                }
                if (list[i].show_type == '0') {
                    str += '<li class="li1"><p class="p0"><span class="span1">' + list[i].name + '</span><span class="span2">认证通过<font>' + list[i].user_count + '</font>人</span><span class="span3">奖励金额 <font>&#xe6cb; ' + list[i].reward + '</font></span></p></li>';
                } else {
                    str += '<li class="li2"><p class="p1"><span class="span1">' + list[i].user_phone + '</span><span class="span2">' + list[i].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                        '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[i].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
                }
            }
            $(".count-list2").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.count-list2'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/activity-house/collection-list'), param, function (data) {
                            let recordrentList = data,
                                reward,//奖励金额字段
                                color,//奖励金额标注的颜色
                                list = recordrentList.data.list,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (list.length != 0) {
                                str += '<li class="li1"><p class="p0"><span class="span1">' + list[0].name + '</span><span class="span2">认证通过<font>' + list[0].user_count + '</font>人</span><span class="span3">奖励金额 <font>&#xe6cb; ' + list[0].reward + '</font></span></p></li>';
                                for (var i = 1; i < list.length; i++) {
                                    if (list[i].reward == '0') {
                                        reward = '一';
                                        color = 'color';
                                    } else {
                                        reward = list[i].reward;
                                        color = '';
                                    }
                                    if (list[i].show_type == '0') {
                                        str += '<li class="li1"><p class="p0"><span class="span1">' + list[i].name + '</span><span class="span2">认证通过<font>' + list[i].user_count + '</font>人</span><span class="span3">奖励金额 <font>&#xe6cb; ' + list[i].reward + '</font></span></p></li>';
                                    } else {
                                        str += '<li class="li2"><p class="p1"><span class="span1">' + list[i].user_phone + '</span><span class="span2">' + list[i].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                                            '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[i].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
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
                        myAjax.post(getApiUrl('/activity-house/collection-list'), param, function (data) {
                            let recordrentList = data,
                                reward,//奖励金额字段
                                color,//奖励金额标注的颜色
                                list = recordrentList.data.list,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (list.length == 0) {
                                cb(false)
                            } else {
                                if (list[0].show_type == '0') {
                                    console.log(1)
                                    str += '<li class="li1"><p class="p0"><span class="span1">' + list[0].name + '</span><span class="span2">认证通过<font>' + list[0].user_count + '</font>人</span><span class="span3">奖励金额 <font>&#xe6cb; ' + list[0].reward + '</font></span></p></li>';
                                } else {
                                    console.log(2)
                                    if (list[0].reward == '0') {
                                        reward = '一';
                                        color = 'color';
                                    } else {
                                        reward = list[0].reward;
                                        color = '';
                                    }
                                    str += '<li class="li2"><p class="p1"><span class="span1">' + list[0].user_phone + '</span><span class="span2">' + list[0].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                                        '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[0].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
                                }
                                for (var i = 1; i < list.length; i++) {
                                    if (list[i].reward == '0') {
                                        reward = '一';
                                        color = 'color';
                                    } else {
                                        reward = list[i].reward;
                                        color = '';
                                    }
                                    if (list[i].show_type == '0') {
                                        if (i > 1) {
                                            if (list[i - 1].show_type == '0') {
                                                str += '</li>';
                                            }
                                        }
                                        str += '<li class="li1"><p class="p0"><span class="span1">' + list[i].name + '</span><span class="span2">认证通过<font>' + list[i].user_count + '</font>人</span><span class="span3">奖励金额 <font>&#xe6cb; ' + list[i].reward + '</font></span></p></li>';
                                    } else {
                                        str += '<li class="li2"><p class="p1"><span class="span1">' + list[i].user_phone + '</span><span class="span2">' + list[i].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                                            '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[i].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
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
            toast(data.msg)
            if(data.msg=='登录信息验证失败'){
                setTimeout(function(){
                    localStorage.removeItem("uuid");
                    window.location.href="./index.html";
                },2000);
            }
        }
    });
}