<template>
    <div id="newbuiltcharge">
        <div class="top">
            <span class="plate_no">{{resultData.plate_no}}（<font class="font1">{{resultData.vin.substring(0, 11)}}</font>{{resultData.vin.substring(11, 17)}}）</span><br/>
            <span class="status_name">{{resultData.status_name}}</span>
            <span class="remain_km">约续航{{resultData.remain_km}}公里</span>
            <span class="brand_name">{{resultData.brand_name}}</span><br/>
            <span class="branch_addr">
                <img v-if="resultData.biz_type==0" class="img1" src="../../image/mapb.png" />
                <img v-else-if="resultData.biz_type==1" class="img1" src="../../image/map-B.png" />
                <img v-else-if="resultData.biz_type==2" class="img1" src="../../image/mapoiler.png" />
                <font>{{resultData.branch_addr}}</font>
            </span>
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
        <div class="status">提交后，该车的车辆状态将变为“充电”状态</div>
        <div class="endworkname-submit" @click="createCharge()">
            <button>提交</button>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/newbuiltcharge.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl';
    import myAjax from '../../common/myAjax/withJq.js'
    import {Toast} from '../../common/LikeAlert/index'
    export default{
        data()
    {
        return {
            resultData: JSON.parse(sessionStorage.getItem('resultData')),//获取缓存数据
        }
    }
    ,
    beforeCreate()
    {
        document.title = '新建充电工单';
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
    },
    mounted()
    {
        $("body").css("background","#f6f6f6");
        //最近三次充电方式
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
        })
    }
    ,
    methods: {
        createCharge(){//提交创建充电工单
        	var param = {
                mobile: sessionStorage.getItem('mobile'),
                car_id: sessionStorage.getItem('car_id')
           };
        	if(sessionStorage.getItem("task_id")){//来自调度任务列表
	            param.algorithm_task_id=sessionStorage.getItem("task_id");
	        }
            myAjax.post(getApiUrl('/vehicle-charging/create-order'),param, function (data) {
                if (data.status == '0') {
                    sessionStorage.setItem("chargeorder_id",data.data.id)
                    window.location.href="./charge.html#/chargedetail";
                } else {
                    new Toast(data.msg)
                }
            });
        }
    }
    }
</script>