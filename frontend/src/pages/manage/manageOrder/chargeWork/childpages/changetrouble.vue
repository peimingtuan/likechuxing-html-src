<template>
    <div id="changetrouble">
        <div class="cardetail-content" v-if="resultData!=''&& fromtype==1">
            <p>
                <span class="plate_no inline">{{resultData.plate_no}} （<font class="font1">{{resultData.vin.substring(0, 11)}}</font>{{resultData.vin.substring(11, 17)}})</span><br/>
                <span class="status_name">{{resultData.status_name}}</span>
                <span class="remain_km">约续航{{resultData.remain}}公里</span>
                <span class="brand_name">{{resultData.brand_name}} {{resultData.model_name}}</span>
            </p>

            <p>
                <font>取：</font>
                <img class="mapb" v-if="resultData.biz_type == '0'" src="../../image/mapb.png"/>
                <img class="mapb" v-else-if="resultData.biz_type == '1'" src="../../image/map-B.png"/>
                <img class="mapb" v-else="2" src="../../image/mapoiler.png"/>
                <span class="branch_addr inline">{{resultData.branch_name}}</span>
            </p>
        </div>
        <div class="cardetail-content" v-else-if="resultData!=''&& fromtype==2">
            <p>
                <span class="plate_no inline">{{resultData.plate_no}} （<font class="font1">{{resultData.vin.substring(0, 11)}}</font>{{resultData.vin.substring(11, 17)}})</span><br/>
                <span class="status_name">{{resultData.status_text}}</span>
                <span class="remain_km">约续航{{resultData.remain_km}}公里</span>
                <span class="brand_name">{{resultData.brand_name}}</span>
            </p>

            <p>
                <font>取：</font>
                <img class="mapb" v-if="resultData.biz_type == '0'" src="../../image/mapb.png"/>
                <img class="mapb" v-else-if="resultData.biz_type == '1'" src="../../image/map-B.png"/>
                <img class="mapb" v-else="2" src="../../image/mapoiler.png"/>
                <span class="branch_addr inline">{{resultData.branch_name}}</span>
            </p>
        </div>
        <div class="faultwork-top">
            <p class="title">请选择上报故障类型</p>

            <p class="content">故障分类</p>
        </div>
        <div class="text-content">
            <p class="p2">
                <span>*</span>
    <textarea class="void_write" placeholder="请填写备注信息" maxlength="200">
</textarea>
            </p>
            <p class="p1">提交后，该车的车辆状态将变为"故障"状态</p>
        </div>
        <div class="carsingle-nextbtn">
            <button>提交</button>
        </div>
        <!--选择上报故障类型弹层-->
        <div class="fault-type common_cover none">
            <div class="faultcontent">
                <p class="title">故障分类
                    <span class="close-btn right">&#xe601;</span>
                </p>

                <div class="content">
                    <p>
                        <span class="choice-type none">停车费类</span>
                        <span class="choice">请选择</span>
                    </p>
                    <!-- 一级分类-->
                    <ul class="faulttype-list">

                    </ul>
                    <!--二级分类-->
                    <ul class="faultchoice-list none">

                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/changetrouble.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data ()
    {
        return {
            fromtype:1,
            resultData: JSON.parse(sessionStorage.getItem("resultData")) || '',//获取存储工单详情
        }
    }
    ,
    beforeCreate()
    {
        document.title = '新建故障工单';
    }
    ,
    created()
    {
        if(this.$route.query.type==1)this.fromtype=2
    }
    ,
    destroyed()
    {
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        $("body").css("background", "#f6f6f6");
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '新建故障工单',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        //初始化获取数据
        var _this = this;
       //提交按钮点亮
        $(".void_write").on("input", function () {
            if ($(this).val().length > 0) {
                $(".carsingle-nextbtn button").addClass("submit-btn");
            } else {
                $(".carsingle-nextbtn button").removeClass("submit-btn");
            }
        });

        //上报故障类型
//请求故障类型配置数据
        var arraymenu = [],//存储类型配置一级数据的id
                arraysecond = [],//存储类型配置的二级数据
                type_id = '',//一级分类
                type_name = '',
                cat_id = '';//二级分类
        myAjax.post(getApiUrl('/vehicle-fault/fault-type'), {
            mobile: sessionStorage.getItem('mobile'),
            type: 2//运维上报故障类型
        }, function (data) {
            if (data.status == '0') {
                let str = '';
                for (var i = 0; i < data.data.length; i++) {
                    arraymenu.push(data.data[i].id);
                    arraysecond.push(data.data[i].child);
                    str += '<li><span>' + data.data[i].name + '</span><img class="none" src="' + require("../../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + data.data[i].id + '"/></li>';
                }
                $(".faulttype-list").html(str);
            } else {
                new Toast(data.msg)
            }
        });
        //打开弹框
        $(".faultwork-top .content").on("click", function () {
            $(".fault-type").removeClass("none");
        });
        //一级菜单
        $(".faulttype-list").on("click", "li", function () {
            $(".faulttype-list li span").removeClass("font-color");
            $(".faulttype-list li img").addClass("none");
            $(this).find("span").addClass("font-color");
            $(this).find("img").removeClass("none");
            $(".choice-type").text($(this).find("span").text());
            $(".choice-type").removeClass("none");
            type_id = $(this).find("input").val();//一级分类id
            type_name = $(this).find("span").text();
            //获取对应的二级菜单数据
            let index = arraymenu.indexOf($(this).find("input").val());
            let str = '';
            if (arraysecond[index].length == 0) {
                $(".faultwork-top .content").text(type_name);
                $(".faultwork-top .content").addClass("bold");
                $(".faultwork-nextbtn button").addClass("submit-btn");//按钮点亮
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
            } else {
                for (var i = 0; i < arraysecond[index].length; i++) {
                    str += '<li><span>' + arraysecond[index][i].name + '</span><img class="none" src="' + require("../../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + arraysecond[index][i].id + '"/></li>';
                }
                $(".faultchoice-list").html(str);
                //一级菜单隐藏，二级菜单显示
                $(".faulttype-list").addClass("none");
                $(".faultchoice-list").removeClass("none");
            }
        });
        //二级菜单
        $(".faultchoice-list").on("click", "li", function () {
            $(".faultwork-top .content").text(type_name + "-" + $(this).find("span").text());
            $(".faultwork-top .content").addClass("bold");
            $(".faultwork-nextbtn button").addClass("submit-btn");//按钮点亮
            cat_id = $(this).find("input").val();//二级分类id
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

        //提交下一页
        var clicktag = 0;
        $(".carsingle-nextbtn button").on("click", function () {
            if ($(this).hasClass("submit-btn")) {
                if (!$(".faultwork-top .content ").hasClass("bold")) {
                    new Toast("请选择上报故障类型");
                    return false;
                }
                if (clicktag == 0) {
                    clicktag = 1;
                    if(_this.fromtype==1){
                        myAjax.post(getApiUrl('/vehicle-charging/operate'), {
                            mobile: sessionStorage.getItem('mobile'),
                            order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                            item_id: '8',
                            up_type_id: type_id,//上报故障类型
                            up_cat_id: cat_id,//上报故障分类
                            params: {
                                remark: $(".void_write").val()//备注信息
                            }
                        }, function (data) {
                            if (data.status == '0') {
                                window.location.href = "charge.html#/chargeworkfinshed";
                            } else {
                                new Toast(data.msg);
                            }
                        });
                    }else{//巡检工单
                        myAjax.post(getApiUrl('/vehicle-inspection/operate'), {
                            mobile: sessionStorage.getItem('mobile'),
                            order_id: _this.$route.query.id, //工单id
                            item_id: '9',//转故障
                            up_type_id: type_id,//上报故障类型
                            up_cat_id: cat_id,//上报故障分类
                            params: {
                                remark: $(".void_write").val()//备注信息
                            }
                        }, function (data) {
                            if (data.status == '0') {
                                window.location.href = "../../inspectionWork/index.html#/finshcarwork?id="+ _this.$route.query.id;
                            } else {
                                new Toast(data.msg);
                            }
                        });
                    }
                }
                setTimeout(function () {
                    clicktag = 0;
                }, 5000);
            }
        });
    }
    ,
    methods: {
    }
    }
</script>