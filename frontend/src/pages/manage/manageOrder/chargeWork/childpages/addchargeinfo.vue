<template>
    <div id="addchargeinfo">
        <div class="endwork-netname">
            <span>选择充电站：</span>
            <input @click="gochoiceNet()" class="choice-net input-foucs" type="text" value="" placeholder="请选择充电站"
                   readonly/>
            <input class="choice-net-id" type="hidden" value=""/>
            <span class="endwork-icon right" @click="gochoiceNet()">&#xe623;</span>
        </div>
        <div class="charge-style">
            <div class="top">
                <span>充电方式：</span>
                <span class="quick-charge quick"><input type="radio" name="chargestyle" value="1"/>快充</span>
                <span class="quick-charge slowly"><input type="radio" name="chargestyle" value="2"/>慢充</span>
            </div>
            <div class="bottom">
                <span class="title">最近三次充电方式</span><br/>
                <span class="style style1">
                    <img src="../../image/chargeWork/noinfo.png"/><br/>
                    无数据
                </span>
                <span class="style style2">
                    <img src="../../image/chargeWork/noinfo.png"/><br/>
                   无数据
                </span>
                <span class="style style3">
                    <img src="../../image/chargeWork/noinfo.png"/><br/>
                    无数据
                </span>
                <span class="style">
                    <img src="../../image/chargeWork/nowicon.png"/><br/>
                    请合理安排本次充电方式
                </span>
            </div>
        </div>
        <div class="endworkname-submit">
            <button>保存</button>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/addchargeinfo.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data()
    {
        return {
            resultData: '',//获取缓存数据
            // resultData:{"name":"国际软件大厦B座","branch_id":"170","branch_addr":"国际软件大厦B座","biz_type":"1","current_manage_branch_id":"0","current_parking_floor":"地面","current_parking_no":"1","remain_km":"200","car_model_id":"10","plate_no":"京AC2500","vin":"","city_id":"1","status":"40","car_id":"101818","last_desc":"11111","brand_name":"北汽 赛欧","model_name":"赛欧","oil_type":"92","status_name":"已删除","oil_num":"0","dispatch_num":"0","porblem_num":0,"fault_num":{"num":0},"park_fee":99},//存储返回的工单详情信息
        }
    }
    ,
    beforeCreate()
    {
        document.title = '录入充电信息';
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
                title: '录入充电信息',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        //接收url参数
        var branch_name = FoundationTools.getUrlvue(location.hash).branch_name,//充电站名称
                net_id = FoundationTools.getUrlvue(location.hash).net_id;//充电站id
        if (branch_name) {
            $(".choice-net").val(branch_name);//充电站名称
            $(".choice-net-id").val(net_id);//充电站id
        } else {
            //请求操作项
            myAjax.post(getApiUrl('/vehicle-charging/item-result'), {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                item_id: '3'//操作项id
            }, function (data) {
                if (data.status == '0') {
                    if (data.data.name) {
                        $(".choice-net").val(data.data.name);//充电站名称
                    }
                    if (data.data.charge_branch) {
                        $(".choice-net-id").val(data.data.charge_branch);//充电站id
                    }
                    if (data.data.type) {
                        if (data.data.type == '1') {
                            $(".quick input").prop("checked", true);
                        } else if (data.data.type == '2') {
                            $(".slowly input").prop("checked", true);
                        }
                    }
                } else {
                    new Toast(data.msg);
                }
            });
        }
        myAjax.post(getApiUrl('/vehicle-charging/latest-charging-type'), {
            mobile: sessionStorage.getItem('mobile'),
            car_id: sessionStorage.getItem('car_id')
        }, function (data) {
            if (data.status == '0') {
                function show(name) {
                    let text;
                    switch (name) {
                        case 1:
                            text = '<img src="' + require("../../image/chargeWork/quick.png") + '" /><br/>快充';
                            break;
                        case 2:
                            text = '<img src="' + require("../../image/chargeWork/trickle.png") + '" /><br/>慢充';
                            break;

                    }
                    return text
                }

                if (data.data.length != 0) {
                    if (data.data.length == 1) {
                        $(".style3").html(show(Number(data.data[0])));
                    } else if (data.data.length == 2) {
                        $(".style3").html(show(Number(data.data[1])));
                        $(".style2").html(show(Number(data.data[0])));
                    } else if (data.data.length == 3) {
                        $(".style3").html(show(Number(data.data[2])));
                        $(".style2").html(show(Number(data.data[1])));
                        $(".style1").html(show(Number(data.data[0])));
                    }
                }
            } else {
                new Toast(data.msg);
            }
        });
        //选择充电类型
        $(".quick-charge input").on("click", function () {
            $(this).prop("checked", true);
            if ($(".choice-net").val() != '') {
                $(".endworkname-submit button ").addClass("submit-btn");//按钮点亮
                $(".endworkname-submit button ").text("提交");
            }
        });
        //保存于提交
        $(".endworkname-submit button").on("click", function () {
            if ($(this).hasClass("submit-btn")) {
                let type = '';//1快充，2慢充
                $(".quick-charge input").each(function () {
                    if ($(this).is(':checked')) {
                        type = $(this).val();
                        return false;
                    }
                });
                if (type == '') {
                    new Toast("请选择充电方式");
                    return false;
                }
                myAjax.post(getApiUrl('/vehicle-charging/operate'), {
                    mobile: sessionStorage.getItem('mobile'),
                    order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                    item_id: '3',//操作项id
                    params: {
                        charge_branch: $(".choice-net-id").val(),//充电站id
                        type: type//充电类型
                    }
                }, function (data) {
                    if (data.status == '0') {
                        window.location.href = "charge.html#/chargedetail";//去往详情页面
                    } else {
                        new Toast(data.msg);
                    }
                });
            } else {
                if ($(".choice-net").val() == '') {
                    new Toast("请先选择充电站")
                } else {
                    myAjax.post(getApiUrl('/vehicle-charging/operate'), {
                        mobile: sessionStorage.getItem('mobile'),
                        order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                        item_id: '3',//操作项id
                        params: {
                            charge_branch: $(".choice-net-id").val(),//充电站id
                            type: ''//充电类型
                        }
                    }, function (data) {
                        if (data.status == '0') {
                            $(".endworkname-submit button ").addClass("submit-btn");//按钮点亮
                            $(".endworkname-submit button ").text("提交");
                            window.location.href = "charge.html#/chargedetail";//去往详情页面
                        } else {
                            new Toast(data.msg);
                        }
                    });
                }
            }
        });
    }
    ,
    methods:{
        //去选择充电站
        gochoiceNet()
        {
            window.location.href = "charge.html#/choicechargestation";
        }
    }
    }
</script>