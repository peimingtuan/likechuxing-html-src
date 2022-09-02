/**
 * Created by Administrator on 2018/4/25.
 */
require('./css/statistics.css')
import $ from 'jquery'
require('../../../component/rem')
import toast from '../../../component/toast'
import myAjax from '../../../component/myAjax/withJq.js'
import getApiUrl from './js/getApiUrl'
import PullUpDown from '../../../component/pullDonwRefresh/index'
import Loading from '../../../component/loading'
var loading = new Loading()//加载loading
//初始化加载图片
$(".select img").attr("src", require("./images/select.png"));
//管理员统计汇总
myAjax.post(getApiUrl('/activity/service/permission'), {
    uuid: localStorage.getItem("uuid"),
    sign: localStorage.getItem("sign")
}, function (data) {
    if (data.status == '0') {
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
    pro_id: localStorage.getItem("pro_id"),
    month: ''
}
show(param);
//搜索查询
$(".select-btn").on("click", function () {
    param.month = $("#month").val();
    show(param);
});
$(".logout-btn").on("click", function() {
   localStorage.removeItem("uuid");
   window.location.href="./index.html";
});
function show(param) {
    myAjax.post(getApiUrl('/activity/service/stat-list'), param, function (data) {
        var recordrentList = data;
        if (data.status == '0') {
            let channels = recordrentList.data.channels;
            let months = recordrentList.data.months;
            let month = recordrentList.data.month;
            let list = recordrentList.data.list;
            let table = $('#stat-table');
            let select = $('#month');
            table.find('tbody').remove();
            select.find('option').remove();
            $.each(months, function (k, n) {
                select.append('<option value="'+ n +'"'+ (n == month ? ' selected' : '') +'>'+ n +'</option>');
            });
            if (list.length == 0) {
                toast("该月暂无数据");
            } else {
                let tbody = $('<tbody></tbody>');
                $.each(list, function (k, n) {
                    let channel_name = channels[k];
                    let tr = $('<tr><td>'+ channel_name +'</td><td>'+ n[0] +'</td><td>'+ n[1] +'</td><td>'+ n[2] +'</td></tr>');
                    tbody.append(tr);
                });
                table.find('tbody').remove();
                table.append(tbody);
            }

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