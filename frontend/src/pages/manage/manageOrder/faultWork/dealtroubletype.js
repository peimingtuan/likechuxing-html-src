/**
 * Created by Administrator on 2018/12/20.
 */
require('../css/public.css')
require('../css/faultWork/dealtroubletype.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//接收URL参数
var record = FoundationTools.getUrlParam('record');
//上报故障类型
//请求故障类型配置数据
var arraymenu = [],//存储类型配置一级数据的id
    arraysecond = [],//存储类型配置的二级数据
    saveid=[],//已经添加的类型id
    saveid2=[],//已经添加的二级类型id
    has_photo='',//还车拍照开关
    type_id = '',//一级分类
    type_name = '',//一级分类的name
    cat_id = '';//二级分类
//回显数据
if(record){
    myAjax.post(getApiUrl('/vehicle-fault/item-result'), {
        mobile: sessionStorage.getItem('mobile'),
        order_id: sessionStorage.getItem('order_id'),
        item_id:1
    }, function (data) {
        if(data.status==0){
            let list=data.data.result
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i].cat_id){
                        saveid2.push(list[i])
                        $(".top").append('<div class="top-div"><div class="div1">'+list[i].name+'<input class="type_id" type="hidden" value="'+list[i].type_id+'"/><input class="cat_id" type="hidden" value="'+list[i].cat_id+'"/></div><div class="div2">&#xe601;</div></div>')
                    }else{
                        saveid.push(list[i])
                        $(".top").append('<div class="top-div"><div class="div1">'+list[i].name+'<input class="type_id" type="hidden" value="'+list[i].type_id+'"/></div><div class="div2">&#xe601;</div></div>')
                    }
                }
                $(".top").removeClass("none");
                $(".endworkname-submit button").addClass("endworkname-button");
            }
        }else{
            new Toast(data.msg)
        }
    })
}
myAjax.post(getApiUrl('/vehicle-fault/fault-type'), {
    mobile: sessionStorage.getItem('mobile'),
}, function (data) {
    if (data.status == '0') {
        let str = '';
        for (var i = 0; i < data.data.length; i++) {
            arraymenu.push(data.data[i].id);
            arraysecond.push(data.data[i].child);
            //添加has_photo
            let has_photo='';
            if(data.data[i].has_photo){
                has_photo='<input class="has_photo" type="hidden" value="' + data.data[i].has_photo + '"/>'
            }
            str += '<li><span>' + data.data[i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input class="id" type="hidden" value="' + data.data[i].id + '"/>'+has_photo+'</li>';
        }
        $(".faulttype-list").html(str);
    } else {
        new Toast(data.msg)
    }
});

//打开弹框
$(".faultdetail-type").on("click", function () {
    $(".fault-type").removeClass("none");
});
var paramtype = {
    params: {}
}
//一级菜单
$(".faulttype-list").on("click", "li", function () {
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(this).find("span").addClass("font-color");
    $(this).find("img").removeClass("none");
    $(".choice-type").text($(this).find("span").text());
    $(".choice-type").removeClass("none");
    type_name = $(this).find("span").text();
    paramtype.params.type_id = $(this).find(".id").val()//一级分类
    if($(this).find("input").hasClass("has_photo")){
        has_photo=$(this).find(".has_photo").val();
    }else{
        has_photo='';
    }
    //获取对应的二级菜单数据
    let index = arraymenu.indexOf($(this).find(".id").val()),
        str = '';
    let qure=true;
    if (arraysecond[index].length == 0) {
        //关闭弹框,数据还原
        $(".fault-type").addClass("none");
        $(".choice-type").text("");
        $(".choice-type").addClass("none");
        $(".faulttype-list li span").removeClass("font-color");
        $(".faulttype-list li img").addClass("none");
        $(".faultchoice-list li span").removeClass("font-color");
        $(".faultchoice-list li img").addClass("none");
        $(".faulttype-list").removeClass("none");
        $(".faultchoice-list").addClass("none");
        for(var i=0;i<saveid.length;i++){
            if(saveid[i].type_id==paramtype.params.type_id){
                qure=false;
                break;
            }
        }
        paramtype.params.cat_id = ''//二级分类
        if(qure){
            if(has_photo!=''){
                saveid.push({type_id:paramtype.params.type_id,has_photo:has_photo,name:type_name})
            }else{
                saveid.push({type_id:paramtype.params.type_id,name:type_name})
            }
            $(".top").append('<div class="top-div"><div class="div1">'+type_name+'<input class="type_id" type="hidden" value="'+paramtype.params.type_id+'"/></div><div class="div2">&#xe601;</div></div>')
            $(".top").removeClass("none");
            $(".endworkname-submit button").addClass("endworkname-button");
        }else{
            new Toast("不能添加相同的故障类型")
        }
    } else {
        for (var i = 0; i < arraysecond[index].length; i++) {
            //添加has_photo
            let has_photo='';
            if(arraysecond[index][i].hasOwnProperty("has_photo")){
                has_photo='<input class="has_photo" type="hidden" value="' + arraysecond[index][i].has_photo + '"/>'
            }
            str += '<li><span>' + arraysecond[index][i].name + '</span><img class="none" src="' + require("../image/faultWork/duigou.png") + '"/><input class="id" type="hidden" value="' + arraysecond[index][i].id + '"/>'+has_photo+'</li>';
        }
        $(".faultchoice-list").html(str);
        //一级菜单隐藏，二级菜单显示
        $(".faulttype-list").addClass("none");
        $(".faultchoice-list").removeClass("none");
    }
});
//二级菜单
$(".faultchoice-list").on("click", "li", function () {
    let btn = $(this);
    //关闭弹框,数据还原
    $(".fault-type").addClass("none");
    $(".choice-type").text("");
    $(".choice-type").addClass("none");
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faultchoice-list li span").removeClass("font-color");
    $(".faultchoice-list li img").addClass("none");
    $(".faulttype-list").removeClass("none");
    $(".faultchoice-list").addClass("none");
    paramtype.params.cat_id = $(this).find("input").val()//二级分类
    if($(this).find("input").hasClass("has_photo")){
        has_photo=$(this).find(".has_photo").val();
    }else{
        has_photo='';
    }
    let qure2=true;
    for(var i=0;i<saveid2.length;i++){
        if(saveid2[i].type_id==paramtype.params.type_id){
            if(saveid2[i].cat_id==paramtype.params.cat_id){
                qure2=false;
                break;
            }
        }
    }
    if(qure2){
        if(has_photo!=''){
            saveid2.push({type_id:paramtype.params.type_id,cat_id:paramtype.params.cat_id,has_photo:has_photo,name:type_name+'-'+btn.find("span").text()})
        }else{
            saveid2.push({type_id:paramtype.params.type_id,cat_id:paramtype.params.cat_id,name:type_name+'-'+btn.find("span").text()})
        }
        $(".top").append('<div class="top-div"><div class="div1">'+type_name+'-'+btn.find("span").text()+'<input class="type_id" type="hidden" value="'+paramtype.params.type_id+'"/><input class="cat_id" type="hidden" value="'+paramtype.params.cat_id+'"/></div><div class="div2">&#xe601;</div></div>')
        $(".top").removeClass("none");
        $(".endworkname-submit button").addClass("endworkname-button");
    }else{
        new Toast("不能添加相同的故障类型")
    }
});
//关闭弹框,数据还原
$(".close-btn").on("click", function () {
    $(".fault-type").addClass("none");
    $(".choice-type").text("");
    $(".choice-type").addClass("none");
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faultchoice-list li span").removeClass("font-color");
    $(".faultchoice-list li img").addClass("none");
    $(".faulttype-list").removeClass("none");
    $(".faultchoice-list").addClass("none");
});

//优化新增逻辑
$(".choice-type").on("click",function(){
    $(this).addClass("none");
    $(".faultchoice-list").addClass("none");//二级隐藏
    $(".faulttype-list li span").removeClass("font-color");
    $(".faulttype-list li img").addClass("none");
    $(".faulttype-list").removeClass("none");//一级显示
});

//删除已选择的处理故障类型
$(".top").on("click",".div2",function(){
    if($(this).parent().find("input").hasClass("cat_id")){
        for(var i=0;i<saveid2.length;i++){
            if(saveid2[i].type_id==$(this).parent().find(".type_id").val()&&saveid2[i].cat_id==$(this).parent().find(".cat_id").val()){
                let index = saveid2.indexOf(saveid2[i]);
                    saveid2.splice(index, 1);
                break;
            }
        }
    }else{
        for(var i=0;i<saveid.length;i++){
            if(saveid[i].type_id==$(this).parent().find(".type_id").val()){
                let index = saveid.indexOf(saveid[i]);
                saveid.splice(index, 1);
                break;
            }
        }
    }
   $(this).parent().remove();
    if(saveid.length==0 && saveid2.length==0){
        $(".top").addClass("none");
        $(".endworkname-submit button").removeClass("endworkname-button");
    }
});

$(".endworkname-submit button").on("click", function () {
    if ($(this).hasClass("endworkname-button")) {
        let param = {
            mobile: sessionStorage.getItem("mobile"),
            order_id: sessionStorage.getItem("order_id"),//故障工单id
            item_id: 1, //结束步骤id
            params: []
        }
        param.params=saveid.concat(saveid2);
        myAjax.post(getApiUrl('/vehicle-fault/operate'), param, function (data) {
            if (data.status == '0') {
                location.href = "./faultdetail.html";
            } else {
                new Toast(data.msg);
            }
        });
    }
})