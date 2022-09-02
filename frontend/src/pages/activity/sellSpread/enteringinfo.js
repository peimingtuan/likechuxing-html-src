/**
 * Created by Administrator on 2018/4/25.
 */
require('./css/enteringinfo.css')
import $ from 'jquery'
require('../../../component/rem')
import toast from '../../../component/toast'
import myAjax from '../../../component/myAjax/withJq.js'
import getApiUrl from '../../../js/getApiUrl'
import Loading from '../../../component/loading'
import QRCode from 'qrcode'
var loading = new Loading()//加载loading
//初始化加载图片
$(".top img").attr("src",require("./images/logo.png"));
$(".refer-btn").attr("src",require("./images/refer.png"));
$(".list-btn").attr("src",require("./images/list.png"));
$(".active-show-btn").attr("src",require("./images/active-show.png"));
//用户权限
myAjax.post(getApiUrl('/activity-house/permission'), {
    uuid:localStorage.getItem("uuid"),
    sign:localStorage.getItem("sign")
},function (data) {
    if (data.status == '0') {
        if(data.data.permission=='1'){
            $(".button-k").css("margin",".1rem .35rem 0");
            $(".show-btn").removeClass("none")
        }
        if($("body").find(".load")){
            loading.destroy()//清除loading
        }
        $(".top").removeClass("none");
        $(".button-k .left").removeClass("none");
        $(".button-k .right").removeClass("none");
        $(".record").removeClass("none");
    } else {
        toast(data.msg)
        if($("body").find(".load")){
            loading.destroy()//清除loading
        }
        $(".top").removeClass("none");
        $(".button-k .left").removeClass("none");
        $(".button-k .right").removeClass("none");
        $(".record").removeClass("none");
        if(data.msg=='登录信息验证失败'){
           setTimeout(function(){
               localStorage.removeItem("uuid");
               window.location.href="./index.html";
           },2000);
        }
    }
});
setTimeout(function(){
    if($("body").find(".load")){
        loading.destroy()//清除loading
    }
},3000)
//录入手机号
let tel = /^1[3456789]\d{9}$/;//手机号验证
$(".select-btn").on("click",function(){
    if (!tel.test($(".select-value").val())) {
        if ($(".select-value").val() == '') {
            toast("请输入手机号")
        } else {
            toast("请输入正确的手机号")
            $(".select-value").val('');
        }
    }else{
        myAjax.post(getApiUrl('/activity-house/record-phone'), {
            uuid:localStorage.getItem("uuid"),
            sign:localStorage.getItem("sign"),
            phone: $(".select-value").val()
        }, function (data) {
            if (data.status == '0') {
                toast("录入成功");
                localStorage.setItem("mobile",$(".select-value").val().substring(5,11));//存储手机号的后六位
                $(".select-value").val('');
                $(".make-code").removeClass("none");
            } else {
                toast(data.msg)
                if(data.msg=='登录信息验证失败'){
                    setTimeout(function(){
                        localStorage.removeItem("uuid");
                        window.location.href="./index.html";
                    },2000);
                }
            }
        })
    }
});
QRCode.toCanvas(document.getElementById('canvas'), 'https://www.likechuxing.com/download.html?channel=sellSpread_'+ localStorage.getItem("mobile"), function (err,url) {
    console.log(err);
    console.log(url);
});
//跳转拉新列表页
$(".refer-btn").on("click",function(){
    window.location.href="./lachinelist.html";
});
//跳转统计列表页
$(".list-btn").on("click",function(){
    window.location.href="./countlist.html";
});
//跳转活动说明页
$(".active-show-btn").on("click",function(){
   window.location.href="./activeshow.html";
});
//从canvas中提取图片image
function converCanvastoimg(canvas){
    //新image对象，可以理解为DOM
    var image=new Image();
    //指定格式png
    image.src=canvas.toDataURL("image/png");
    return image
}
//获取网页中的canvas对象
var mycanvas=document.getElementsByTagName("canvas")[0];
//将img标签插入到HTML中
var img=converCanvastoimg(mycanvas);
$(".code-image").append(img);
//手动关闭按钮
//$(".close-btn").on("click",function(){
//    localStorage.removeItem("uuid");
//    window.location.href="./index.html";
//});