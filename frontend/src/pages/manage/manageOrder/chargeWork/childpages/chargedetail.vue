<template>
    <div id="chargedetail" class="none">
        <div class="chargedetail-content">
            <p>
                <span class="plate_no inline">{{resultData.plate_no}}{{resultData==''?'':'（'}}<font class="font1">{{resultData==''?'':resultData.vin.substring(0,
                    11)}}</font>{{resultData==''?'':resultData.vin.substring(11, 17)}}{{resultData==''?'':'）'}}</span>
                <span class="trouble_id"><font>充电</font>{{resultData.id}}</span><br/>
                <span class="status_name">{{resultData.status_name}}</span>
                <span class="remain_km">{{resultData==''?'':'约续航'}}{{resultData.remain}}{{resultData==''?'':'公里'}}</span>
                <span class="brand_name">{{resultData.brand_name}} {{resultData.model_name}}</span>
                <span v-if="resultData.photo_flag == 1 && resultData.step==0 && deleteicon" class="deletework right" @click="godeletework">&#xe6db;</span>
                <span v-else-if="resultData.photo_flag==0 && resultData.step==1 && deleteicon" class="deletework right" @click="godeletework">&#xe6db;</span>
            </p>

            <p>
                <img class="mapb" v-if="resultData.biz_type==0" src="../../image/mapb.png"/>
                <img class="mapb" v-else-if="resultData.biz_type==1" src="../../image/map-B.png"/>
                <img class="mapb" v-else-if="resultData.biz_type==2" src="../../image/mapoiler.png"/>
                <span class="branch_addr inline">{{resultData.branch_name}}</span><br/>
            </p>
        </div>
        <div class="flowstatus">
            <p class="p1">
                <span class="left">工单流程</span>
                <span class="right moremany">更多</span>
            </p>

            <p class="p2">
                <!-- 第一步-->
                <span class="span1 size" v-if="resultData.photo_flag == 1">
                    <img v-if="resultData.step == 0" src="../../image/chargeWork/flow1.png"/>
                    <img v-else src="../../image/chargeWork/highlinefinsh.png"/>
                    <br/>
                    <font>取车验车</font>
                </span>
                <span class="span1 size" v-else>
                    <img src="../../image/chargeWork/closenape.png"/>
                    <br/>
                    <font>取车验车</font>
                </span>
                <span class="span2 line"></span>
                <!-- 第二步-->
                <span class="span3 size">
                    <img v-if="Number(resultData.step) > 1" src="../../image/chargeWork/highlinefinsh.png"/>
                    <img v-else src="../../image/chargeWork/flow2.png"/>
                    <br/>
                    <font>充前验车</font>
                </span>
                <span class="span4 line"></span>
                <!-- 第三步-->
                <span class="span5 size">
                    <img v-if="Number(resultData.step) > 2" src="../../image/chargeWork/highlinefinsh.png"/>
                    <img v-else src="../../image/chargeWork/flow3.png"/>
                    <br/>
                    <font>充电信息</font>
                </span>
                <span class="span6 line"></span>
                <!-- 第四步-->
                <span class="span7 size">
                    <img v-if="Number(resultData.step) > 3" src="../../image/chargeWork/highlinefinsh.png"/>
                    <img v-else src="../../image/chargeWork/flow4.png"/>
                    <br/>
                    <font v-if="Number(resultData.step) > 3 && resultData.status==3">充电中信息</font>
                    <font v-else>费用信息</font>
                </span>
                <span class="span8 line"></span>
                <!-- 第五步-->
                <span class="span9 size">
                    <img v-if="Number(resultData.step) > 4" src="../../image/chargeWork/highlinefinsh.png"/>
                    <img v-else src="../../image/chargeWork/flow5.png"/>
                    <br/>
                    <font v-if="Number(resultData.step) > 3 && resultData.status==3">费用信息</font>
                    <font v-else>还车验车</font>
                </span>
            </p>
        </div>
        <ul class="chargedetail-list">
            <!-- 第一步-->
            <li class="add-single" :class="resultData.step==0?'stepcolor':'check-single'"
                v-if="resultData.photo_flag == 1" @click="addSingle()" ref='add_single'>1、
                <span class="span_get" v-if="resultData.step==0"
                      :class="resultData.step==0?'stepcolor':''">添加取车验车单</span>
                <span class="span_get check-btn" v-else>查看取车验车单</span>
                <span class="span2" :class="resultData.step==0?'stepcolor':''">&#xe623;</span>
            </li>
            <li class="add-single forbidden" v-else>1、
                <span class="span_get forbidden">添加取车验车单</span>
                <span class="span2 forbidden">已关闭</span>
            </li>
            <!-- 第二步-->
            <li class="add-beforesinglecar" v-if="Number(resultData.step) > 0"
                :class="resultData.step==1?'stepcolor':''" @click="addbeforeSing()" ref='add_beforesinglecar'>2、
                <span class="span_add2" :class="resultData.step==1?'stepcolor':''"
                      v-if="resultData.step==1">充电前验车</span>
                <span class="span_add2 check-btn" v-else>查看充电前验车</span>
                <span :class="resultData.step==1?'stepcolor':''">&#xe623;</span>
            </li>
            <li class="add-beforesinglecar forbidden" v-else>2、
                <span class="span_add2 forbidden">充电前验车</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第三步-->
            <li class="add-chargeinfo" v-if="Number(resultData.step) > 1" :class="resultData.step==2?'stepcolor':''"
                @click="addchargeInfo()" ref='add_chargeinfo'>3、
                <span class="span_add3" :class="resultData.step==2?'stepcolor':''"
                      v-if="resultData.step==2">录入充电信息</span>
                <span class="span_add3 check-btn" v-else>查看充电信息</span>
                <span :class="resultData.step==2?'stepcolor':''">&#xe623;</span>
            </li>
            <li class="add-chargeinfo forbidden" v-else>3、
                <span class="span_add3 forbidden">录入充电信息</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第四步-->
            <li class="add-returncar" v-if="Number(resultData.step) > 2 && resultData.status !=3"
                :class="resultData.step==3?'stepcolor':''" @click="addStep4()" ref='add_step4'>4、
                <span class="span_add4" :class="resultData.step==3?'stepcolor':''"
                      v-if="resultData.step==3">录入费用信息</span>
                <span class="span_add4 check-btn" v-else>查看费用信息</span>
                <span :class="resultData.step==3?'stepcolor':''">&#xe623;</span>
            </li>
            <li class="add-returncar" v-else-if="Number(resultData.step) > 2 && resultData.status ==3"
                @click="checkStep4()">4、
                <span class="span_add4">查看充电中上线信息</span>
                <span>&#xe623;</span>
            </li>
            <li class="add-returncar forbidden" v-else>4、
                <span class="span_add4 forbidden">录入费用信息</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第五步-->
            <li class="add-returncar" v-if="Number(resultData.step) > 3 && resultData.status !=3"
                :class="resultData.step==4?'stepcolor':''" @click="addStep5()" ref='add_step5'>5、
                <span class="span_add5" :class="resultData.step==4?'stepcolor':''"
                      v-if="resultData.step==4">添加还车验车单</span>
                <span class="span_add5 check-btn" v-else>查看还车验车单</span>
                <span :class="resultData.step==4?'stepcolor':''">&#xe623;</span>
            </li>
            <li class="add-returncar stepcolor" v-else-if="Number(resultData.step) > 3 && resultData.status==3"
                @click="endchargework()">5、
                <span class="span_add5 stepcolor">录入费用信息</span>
                <span class="stepcolor">&#xe623;</span>
            </li>
            <li class="add-returncar forbidden" v-else>5、
                <span class="span_add5 forbidden">添加还车验车单</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第六步-->
            <li class="edit-endworklist" :class="resultData.step==5 && resultData.status!=3?'':'none'" @click="goEndwork()">
                <button>输入车位结束工单</button>
            </li>
        </ul>
        <div class="chargedetail-history">
            <p>操作历史</p>
            <ul class="history-list">
                <li>

                </li>
            </ul>
        </div>
        <div class="chargedetail-btn">
            <button class="open-door" @click="openDoor(resultData.plate_no || resultData.vin.substring(11, 17))">开门
            </button>
            <button class="close-door" @click="closeDoor(resultData.plate_no || resultData.vin.substring(11, 17))">锁门
            </button>
            <button class="select-net" @click="goSelectnet()">查询网点</button>
            <button class="urgent_in none">紧急</button>
            <button class="adjustable_in none">调离</button>
        </div>
        <!--alert弹框-->
        <div class="alert_window common_cover none">
            <div class="common_content">
                <ul>
                    <li>更多<span class="close-icon" @click="closeIcon()">&#xe601;</span></li>
                    <li class="nonfindcar" @click="goTrouble()">1.新建故障工单，点这里！</li>
                    <li class="payment" @click="goPaymoney()">2.出场缴费，点这里！</li>
                    <li class="needoiler" @click="chargeGoline(resultData.step,resultData.status)">3.充电中上线，点这里！</li>
                </ul>
            </div>
        </div>
        <!-- 充电中上线弹框-->
        <div class="alert_window2 common_cover none">
            <div class="common_content2">
                <div class="top">
                    若将车辆更改为充电中上线，
                    需先添加<span>还车验车单</span>
                </div>
                <div class="bottom">
                    <span class="no-change" @click="noChange()">不改了</span><span class="go-add"
                                                                                @click="goreturnPicture()">去添加</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import myAjax from '../../common/myAjax/withJq.js'
    import Loading from '../../../../../component/loading'
    //获取钉钉授权
    import ddConfigs from '../../js/ddConfigs'
    export default{
        data()
    {
        return {
            resultData: '',//获取缓存数据
            deleteicon:false
           }
    }
    ,
    beforeCreate()
    {
        document.title = '充电工单';
    }
    ,
    destroyed()
    {
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '充电工单',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        var _this = this;
        var loading = new Loading()//加载loading
        $("body").css("background", "#f6f6f6");
        //打开更多弹框
        $(".flowstatus .moremany").on("click", function () {
            $(".alert_window").removeClass("none");
        });
        //关闭更多弹框
        $(".alert_window .close-icon").on("click", function () {
            $(".alert_window").addClass("none");
        });
        //获取当前工单详情
        myAjax.post(getApiUrl('/vehicle-charging/order-detail'), {
            mobile: sessionStorage.getItem('mobile'),
            order_id: sessionStorage.getItem('chargeorder_id')
        }, function (data) {
            if (data.status == '0') {
                loading.destroy()//清除loading
                $("#chargedetail").removeClass("none");//展示页面
                _this.resultData = data.data;
                //存储车辆id
                sessionStorage.setItem('car_id', data.data.car_id);
                //存储充电工单id
                sessionStorage.setItem('chargeorder_id', data.data.id);
                //存储充电站id
                sessionStorage.setItem('charging_branch', data.data.charging_branch);
                //存储充电工单详情
                sessionStorage.setItem("resultData", JSON.stringify(data.data));
            } else {
                new Toast(data.msg)
            }
        });
        //获取操作历史记录
        myAjax.post(getApiUrl('/vehicle-charging/operate-history'), {
            mobile: sessionStorage.getItem('mobile'),
            order_id: sessionStorage.getItem('chargeorder_id')//充电工单id
        }, function (data) {
            if (data.status == '0') {
                let str = '';
                //控制删除按钮显示与否
                if (data.data.length != 0) {
                    if (data.data[0].user_name == sessionStorage.getItem('mobile')) {
                       _this.deleteicon=true;
                    }
                }
                for (var i = 0; i < data.data.length; i++) {
                    let checkli = '';
                    if (data.data[i].item_id == '1') {//取车验车单信息
                        checkli = '<span class="check check-before right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '2') {//充电还车验车单信息
                        checkli = '<span class="check check-chargebefore right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '3') {//充电信息
                        checkli = '<span class="check check-chargeinfohs right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '4') {//充电中上线信息
                        checkli = '<span class="check check-chargelinehs right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '5') {//录入费用信息
                        checkli = '<span class="check check-addmoneyhs right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '6') {//还车验车单信息
                        checkli = '<span class="check check-after right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '9') {//缴纳停车费信息
                        checkli = '<span class="check check-payment right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    }
                    str += '<li><span class="span1">' + data.data[i].time + '</span>' + checkli + '<span class="span2">' + data.data[i].operate + '</span><br/><span class="span3">' + data.data[i].real_name + '</span>' +
                            '<span class="span4">(' + data.data[i].user_name + ')</span><span>' + data.data[i].remark + '</span></li>';
                }
                $(".history-list").html(str);
                //跳转查看取车验车单信息
                $(".check-before").on("click", function () {
                    window.location.href = "../oilerSingle/checksingle.html?type=1";
                });
                //跳转查看充电还车验车单信息
                $(".check-chargebefore").on("click", function () {
                    if (_this.resultData.photo_flag == '0') {//关闭拍照
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=1&photo_flag=0";
                    } else {
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=1";
                    }
                });
                //跳转查看充电信息页面
                $(".check-chargeinfohs").on("click", function () {
                    window.location.href = "charge.html#/checkchargeinfo";
                });
                //跳转查看充电中上线信息
                $(".check-chargelinehs").on("click", function () {
                    window.location.href = "charge.html#/checkgolineinfo";
                });
                //跳转查看录入费用信息
                $(".check-addmoneyhs").on("click", function () {
                    window.location.href = "charge.html#/checkcostinfo";
                });
                //跳转查看还车验车单信息
                $(".check-after").on("click", function () {
                    if (_this.resultData.photo_flag == '0') {//关闭拍照
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=2&photo_flag=0";
                    } else {
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=2";
                    }
                });
                //跳转查看缴纳停车费信息
                $(".check-payment").on("click", function () {
                    window.location.href = "charge.html#/checkchargepayment?record_id=" + $(this).find(".id").val();
                });
            } else {
                new Toast(data.msg);
            }
        });
    }
    ,
    methods:{
        //取车验车单
        addSingle()
        {
            if ($(this.$refs.add_single).find(".span_get").hasClass("check-btn")) {//查看
                window.location.href = "../oilerSingle/checksingle.html?type=3";
            } else {//添加
                window.location.href = "../oilerSingle/carsingle.html?type=3";
            }
        }
    ,
        //充电前验车
        addbeforeSing()
        {
            if ($(this.$refs.add_beforesinglecar).find(".span_add2").hasClass("check-btn")) {//查看
                if (this.resultData.photo_flag == '0') {//关闭拍照
                    window.location.href = "../oilerSingle/checkreturnsingle.html?type=1&photo_flag=0";
                } else {
                    window.location.href = "../oilerSingle/checkreturnsingle.html?type=1";
                }
            } else {//添加
                if (this.resultData.photo_flag == "0") {//开关打开
                    window.location.href = "../oilerSingle/returncarsingle.html?type=4&photo_flag=0";
                } else {
                    window.location.href = "../oilerSingle/returncarsingle.html?type=4";
                }
            }
        }
    ,
        //录入充电信息
        addchargeInfo()
        {
            if ($(this.$refs.add_chargeinfo).find(".span_add3").hasClass("check-btn")) {//查看
                 window.location.href="charge.html#/checkchargeinfo#";
            } else {//添加
                window.location.href = "charge.html#/addchargeinfo";
            }
        }
    ,
        //正常流程费用信息
        addStep4()
        {
            if ($(this.$refs.add_step4).find(".span_add4").hasClass("check-btn")) {//查看
                window.location.href="charge.html#/checkcostinfo";
            } else {//添加
                window.location.href = "charge.html#/addcostinfo";
            }
        }
    ,
        //正常流程还车验车单
        addStep5()
        {
            if ($(this.$refs.add_step5).find(".span_add5").hasClass("check-btn")) {//查看
                if (this.resultData.photo_flag == '0') {//关闭拍照
                    window.location.href = "../oilerSingle/checkreturnsingle.html?type=2&photo_flag=0";
                } else {
                    window.location.href = "../oilerSingle/checkreturnsingle.html?type=2";
                }
            } else {//添加
                if (this.resultData.photo_flag == "0") {//开关打开
                    window.location.href = "../oilerSingle/returncarsingle.html?type=3&photo_flag=0";
                } else {
                    window.location.href = "../oilerSingle/returncarsingle.html?type=3";
                }
            }
        }
    ,
        //查看充电中上线信息
        checkStep4()
        {
            window.location.href = "charge.html#/checkgolineinfo";
        }
    ,
        //充电中上线
        chargeGoline(step,status)
        {
            if (step > 2) {
                if(status==3){
                    $(".alert_window").addClass("none");//关闭弹框
                    new Toast("车辆已充电中上线，请查看确认")
                }else{
                    if(step==3){
                        //判断工单是否能充电中上线
                        myAjax.post(getApiUrl('/vehicle-charging/check-on-line'), {
                            mobile: sessionStorage.getItem('mobile'),
                            order_id: sessionStorage.getItem('chargeorder_id')
                        }, function (data) {
                            $(".alert_window").addClass("none");//关闭弹框
                            if (data.status == '0') {
                                if (data.data.is_virtual == '1') {//0可以上线，1不可以上线
                                    new Toast("该充电点不是网点，禁止上线");
                                } else {
                                    $(".alert_window2").removeClass("none");//打开充电中上线弹框
                                }
                            } else {
                                new Toast(data.msg)
                            }
                        });
                    }else{
                        $(".alert_window").addClass("none");//关闭弹框
                        new Toast("充电已完成，无法充电中上线");
                    }
                }
            } else {
                $(".alert_window").addClass("none");//关闭弹框
                new Toast("请先录入充电信息");
            }
        }
    ,
        //充电中上线录入费用信息
        endchargework()
        {
            window.location.href = "charge.html#/addcostinfo?type=1";
        }
    ,
        //充电中上线前添加还车验车单
        goreturnPicture()
        {
            if (this.resultData.photo_flag == '0') {//开关打开
                window.location.href = "../oilerSingle/returncarsingle.html?type=5&photo_flag=0";
            } else {
                window.location.href = "../oilerSingle/returncarsingle.html?type=5";
            }
        }
    ,
        //结束充电工单
        goEndwork()
        {
            window.location.href = "charge.html#/endchargework";
        }
    ,
        //关闭充电中上线弹框
        noChange()
        {
            $(".alert_window2").addClass("none");
        }
    ,
        //关闭充电中上线弹框
        closeIcon()
        {
            $(".alert_window2").addClass("none");
        }
    ,
        //调故障
        goTrouble()
        {
            window.location.href = "charge.html#/changetrouble";
        }
    ,
        //出场缴费
        goPaymoney()
        {
            window.location.href = "charge.html#/chargepayment";
        }
    ,
        //开门
        openDoor(car_info)
        {
            myAjax.post(getApiUrl('/car/open-door'), {
                mobile: sessionStorage.getItem('mobile'),
                car_info: car_info
            }, function (data) {
                new Toast(data.msg)
            })
        }
    ,
        //关门
        closeDoor(car_info)
        {
            myAjax.post(getApiUrl('/car/close-door'), {
                mobile: sessionStorage.getItem('mobile'),
                car_info: car_info
            }, function (data) {
                new Toast(data.msg)
            })
        }
    ,
        //跳转查询网点
        goSelectnet()
        {
            window.location.href = "../../endwork/index.html#/selectmapnet2"//共用网点查询页面
        },

        //删除工单
        godeletework(){
            window.location.href = "../oilerSingle/deletework.html?&type=3"
        }
    }
    }
</script>