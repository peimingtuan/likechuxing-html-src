/**
 * Created by Administrator on 2018/4/25.
 */
require('./css/lachinelist.css')
import $ from 'jquery'
require('../../../component/rem')
import toast from '../../../component/toast'
import myAjax from '../../../component/myAjax/withJq.js'
import getApiUrl from '../../../js/getApiUrl'
import PullUpDown from '../../../component/pullDonwRefresh/index'
import Loading from '../../../component/loading'
var loading = new Loading()//加载loading
//个人统计汇总
myAjax.post(getApiUrl('/activity-house/phone-count'), {
    uuid: localStorage.getItem("uuid"),
    sign: localStorage.getItem("sign")
}, function (data) {
    if (data.status == '0') {
        $(".top .left font").text(data.data.user_count);//认证通过人数
        $(".top .right").html("<font>&#xe6cb; " + data.data.reward + "</font>");//认证通过奖励金额
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
$('.lach-list').height($(window).height() - $('.top').height());
//个人列表接口
var param = {
    uuid: localStorage.getItem("uuid"),
    sign: localStorage.getItem("sign"),
    page: '1'
}
show(param)
function show(param) {
    var recordrentList = {};
    myAjax.post(getApiUrl('/activity-house/phone-list'), param, function (data) {
        recordrentList = data;
        if (data.status == '0') {
            let str = '',
                reward,//奖励金额字段
                color,//奖励金额标注的颜色
                list = recordrentList.data.list;
            for (var i = 0; i < list.length; i++) {
                if (list[i].reward == '0') {
                    reward = '一';
                    color = 'color';
                } else {
                    reward = list[i].reward;
                    color = '';
                }
                str += '<li><p class="p1"><span class="span1">' + list[i].user_phone + '</span><span class="span2">' + list[i].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                    '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[i].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
            }
            $(".lach-list").html(str);
            //上拉，下拉获取数据
            var index = 0;
            let pullUpDown = new PullUpDown({
                listClassName: '',
                content: str,
                parent: document.querySelector('.lach-list'),
                pullDownRefresh: function (cb) {
                    let that = this
                    setTimeout(function () {
                        let str = '';
                        param.page = 1;
                        index = 0;
                        myAjax.post(getApiUrl('/activity-house/phone-list'), param, function (data) {
                            let recordrentList = data,
                                reward,//奖励金额字段
                                color,//奖励金额标注的颜色
                                list = recordrentList.data.list,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (list.length != 0) {
                                for (var i = 0; i < list.length; i++) {
                                    if (list[i].reward == '0') {
                                        reward = '一';
                                        color = 'color';
                                    } else {
                                        reward = list[i].reward;
                                        color = '';
                                    }
                                    str += '<li><p class="p1"><span class="span1">' + list[i].user_phone + '</span><span class="span2">' + list[i].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                                        '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[i].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
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
                        myAjax.post(getApiUrl('/activity-house/phone-list'), param, function (data) {
                            let recordrentList = data,
                                reward,//奖励金额字段
                                color,//奖励金额标注的颜色
                                list = recordrentList.data.list,
                                status = recordrentList.status,
                                msg = recordrentList.msg;
                            if (list.length == 0) {
                                cb(false)
                            } else {
                                for (var i = 0; i < list.length; i++) {
                                    if (list[i].reward == '0') {
                                        reward = '一';
                                        color = 'color';
                                    } else {
                                        reward = list[i].reward;
                                        color = '';
                                    }
                                    str += '<li><p class="p1"><span class="span1">' + list[i].user_phone + '</span><span class="span2">' + list[i].update_time + '</span><span class="span3 ' + color + '">' + reward + '</span></p>' +
                                        '<p class="p2"><span class="span1">拉新账号</span><span class="span2">' + list[i].user_status_desc + '</span><span class="span3">奖励金额</span></p></li>';
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