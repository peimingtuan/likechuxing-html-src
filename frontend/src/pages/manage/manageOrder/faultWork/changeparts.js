require('../css/public.css')
require('../css/faultWork/changeparts.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//接收url参数
var item_id = FoundationTools.getUrlParam('item_id'),
    record_id = FoundationTools.getUrlParam('record_id'),//操作记录id
    finshed = FoundationTools.getUrlParam('finshed');
function show() {
    if (item_id || record_id) {
        myAjax.post(getApiUrl('/vehicle-fault/item-result'), {
            mobile: sessionStorage.getItem('mobile'),
            order_id: sessionStorage.getItem("order_id"),//故障工单id
            id:record_id,
            item_id: '3'
        }, function (data) {
            if (data.status == '0') {
                for (var i = 0; i < data.data.result.length; i++) {
                    $(".parts-center span input").each(function () {
                        if ($(this).val() == data.data.result[i]) {
                            $(this).parent().addClass("color");
                        }
                    });
                }
                $(".sure-change button").addClass("sure-btn");//点亮按钮
            } else {
                new Toast(data.msg)
            }
        });
    }
}
//初始化加载更换配件信息
myAjax.post(getApiUrl('/vehicle-fault/fitting-list'), {
    mobile: sessionStorage.getItem('mobile')
}, function (data) {
    if (data.status == '0') {
        let str = '',
            array = [];
        $.each(data.data, function (i, val) {
            let text = {
                name: '',
                id: ''
            };
            text.id = i;
            text.name = val;
            array.push(text);
        });
        for (var i = 0; i < array.length; i++) {
            str += '<span>' + array[i].name + '<input type="hidden" value="' + array[i].id + '" /></span>';
        }
        $(".parts-center").html(str);
        show();//由于异步初始化后再去走查询
    } else {
        new Toast(data.msg)
    }
});

if(!finshed){
    $(".sure-change").removeClass("none");
    //点击选项变换颜色
    $(".parts-center").on("click", "span", function () {
        if ($(".parts-center .color").length > 0) {
            if ($(this).hasClass("color")) {
                $(this).removeClass("color");
            } else {
                $(this).addClass("color");
            }
        } else {
            $(this).addClass("color");
        }
        if ($(".parts-center .color").length > 0) {
            $(".sure-change button").addClass("sure-btn");//点亮按钮
        } else {
            $(".sure-change button").removeClass("sure-btn");//置灰按钮
        }
    });
}

//确认更换
$(".sure-change button").on("click", function () {
   if($(this).hasClass("sure-btn")){
       let param = {
               mobile: sessionStorage.getItem('mobile'),
               order_id: sessionStorage.getItem("order_id"),//故障工单id
               item_id: '3',
               params:{}
           },
           array = [];
       $(".parts-center span").each(function () {
           if ($(this).hasClass("color")) {
               array.push($(this).find("input").val())
           }
       });
       param.params.fittings = array.toString();
       myAjax.post(getApiUrl('/vehicle-fault/operate'), param, function (data) {
           if (data.status == '0') {
               new Toast("修改成功");
               setTimeout(function(){
                   location.href = "./faultdetail.html";
               },2000)
           } else {
               new Toast(data.msg);
           }
       });
   }
});
