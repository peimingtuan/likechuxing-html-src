/**
 * Created by Administrator on 2018/4/25.
 */
require('./css/activeshow.css')
import $ from 'jquery'
require('../../../component/rem')
import toast from '../../../component/toast'
import Loading from '../../../component/loading'
var loading = new Loading()//加载loading
//初始化加载图片
$(".show-top .p1 img").attr("src",require("./images/1.png"));
$(".show-top .p2 img").attr("src",require("./images/2.png"));
$(".show-top .p3 img").attr("src",require("./images/3.png"));
$(".show-top .p4 img").attr("src",require("./images/4.png"));
$(".show-top .p5 img").attr("src",require("./images/5.png"));
$(".show-bottom .p1 img").attr("src",require("./images/1.png"));
$(".show-bottom .p2 img").attr("src",require("./images/2.png"));
$(".show-bottom .p3 img").attr("src",require("./images/3.png"));
$(".show-bottom .p4 img").attr("src",require("./images/4.png"));
setTimeout(function(){
    $(".top").removeClass("none");
    $(".show-top").removeClass("none");
    $(".bottom").removeClass("none");
    $(".show-bottom").removeClass("none");
    if($("body").find(".load")){
        loading.destroy()//清除loading
    }
},600)