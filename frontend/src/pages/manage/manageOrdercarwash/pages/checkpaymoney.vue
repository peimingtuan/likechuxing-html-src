<template>
    <div id="checkpaymoney">
        <div class="checkpayment-content" v-if="resultData!=''&& fromtype==1">
            <span>{{resultData.task.plate_no}}<font class="font1">（{{resultData.task.vin.substring(11, 17)}}）</font></span>
            <span>洗车{{resultData.id}}</span><br/>
            <span>{{resultData.task.car_status}}</span>
            <span>约续航{{resultData.task.remain_km}}公里</span>
            <span>{{resultData.task.model_name}}</span><br/>
            <span class="branch_addr">
                <!-- 0合作 1非合作 2加油站-->
                <img class="img1" v-if="resultData.task.biz_type==0" src="../images/mapb.png">
                         <img class="img1" v-else-if="resultData.task.biz_type==1" src="../images/map-B.png">
                         <img class="img1" v-else-if="resultData.task.biz_type==2" src="../images/mapoiler.png">
                         {{resultData.task.branch_address}}
            </span>
        </div>
        <div class="checkpayment-content" v-else-if="resultData!=''&& fromtype==2">
            <span>{{resultData.plate_no}}<font class="font1">（{{resultData.vin.substring(11, 17)}}）</font></span>
            <span>巡检{{resultData.id}}</span><br/>
            <span>{{resultData.status_text}}</span>
            <span>约续航{{resultData.remain_km}}公里</span>
            <span>{{resultData.model_name}}</span><br/>
            <span class="branch_addr">
                <!-- 0合作 1非合作 2加油站-->
                <img class="img1" v-if="resultData.biz_type==0" src="../images/mapb.png">
                         <img class="img1" v-else-if="resultData.biz_type==1" src="../images/map-B.png">
                         <img class="img1" v-else-if="resultData.biz_type==2" src="../images/mapoiler.png">
                         {{resultData.branch_name}}
            </span>
        </div>
        <div class="status_text" v-else>
            详情加载中，请稍后...
        </div>
        <div class="text-content">
            <p class="p0">
                凭证类型：<span>发票</span>
            </p>

            <p class="p1">停车费用：<input type="text" value="" class="parkingfee" readonly/></p>
            <!-- 增加费用类型-->
            <p class="p3">
                费用类型：
                <input class="fee-type" type="text" value="" readonly/>
            </p>

            <p class="p2">
                备注信息：<span></span>
            </p>
        </div>
        <p class="photo-du">照片</p>

        <div class="checksingle-content">
            <div class="left">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>
                    *车牌号<br/>
                    <span class="parkfee">(产生费用的车辆)</span>
                </p>
            </div>
            <div class="left">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>*收费证明</p>
            </div>
            <div class="left remove-photo none">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>临停收费标准</p>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checkpaymoney.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            fromtype:1,
            resultData:JSON.parse(sessionStorage.getItem('avenResult')) || '',//获取缓存车辆信息
        }
    }
    ,
    created()
    {
        if(this.$route.query.type==1)this.fromtype=2
    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
        var _this = this;
        _this.$_LIKE_toast("暂时没有提供接口");
        //上传图片
        var length = 0,
                imageArray = [];
        dd.ready(function () {
            //初始化查询图片接口
            if(_this.$route.query.type==1) {//来自巡检工单
                myAjax.post(getApiUrl('/vehicle-inspection/item-result'),{
                    mobile:sessionStorage.getItem("mobile"),
                    order_id: _this.$route.query.id,//巡检操作id
                    item_id:8
                }).then(data=>{
                    if(data.status==0){
                        $(".text-content .p2 span").text(data.data.remark);//缴费备注
                        if (data.data.fee_type) {//费用类型
                            if (data.data.fee_type == '0') {
                                $(".fee-type").val("B+停车费");
                            } else if (data.data.fee_type == '1') {
                                $(".fee-type").val("超停停车费");
                            } else if (data.data.fee_type == '2') {
                                $(".fee-type").val("错停停车，锁车费");
                            } else if (data.data.fee_type == '3') {
                                $(".fee-type").val("其他费用");
                            }
                        }
                        $(".text-content .parkingfee").val(data.data.parking_fee + "元");//停车费用
                        if (data.data.certificate_type == '0') {//凭证类型
                            $(".text-content .p0 span").text("无");
                        } else if (data.data.certificate_type == '1') {
                            $(".text-content .p0 span").text("发票");
                        } else if (data.data.certificate_type == '2') {
                            $(".text-content .p0 span").text("收据");
                        }
                        imageArray = data.data.photo;
                        if (imageArray.length == 2) {
                            $(".remove-photo").remove();
                        } else {
                            $(".remove-photo").removeClass("none");
                        }
                        $(".img-circle").each(function (index, element) {
                            $(this).attr("src", imageArray[index])
                        })
                        $(".img-val").each(function (index, element) {
                            $(this).val(imageArray[index])
                        });
                        //钉钉查看大图
                        $(".img-circle").on("click", function () {
                            let btn = $(this);
                            dd.biz.util.previewImage({
                                urls: imageArray,//图片地址列表,数组
                                current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                                onSuccess: function (result) {
                                    /**/
                                },
                                onFail: function (err) {
                                    _this.$_LIKE_toast("查看大图失败");
                                }
                            });
                        });
                    }else{
                        _this.$_LIKE_toast(data.msg)
                    }
                }).catch(data => {
                    console.log(data)
                })
            }else{
                myAjax.post(getApiUrl('/vehicle-charging/item-result'),{
                    mobile:sessionStorage.getItem("mobile"),
                    order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                    item_id: '9'//操作id
                }).then(data=>{
                    if(data.status==0){
                        $(".text-content .p2 span").text(data.data.remark);//缴费备注
                        if (data.data.fee_type) {//费用类型
                            if (data.data.fee_type == '0') {
                                $(".fee-type").val("B+停车费");
                            } else if (data.data.fee_type == '1') {
                                $(".fee-type").val("超停停车费");
                            } else if (data.data.fee_type == '2') {
                                $(".fee-type").val("错停停车，锁车费");
                            } else if (data.data.fee_type == '3') {
                                $(".fee-type").val("其他费用");
                            }
                        }
                        $(".text-content .parkingfee").val(data.data.parking_fee + "元");//停车费用
                        if (data.data.certificate_type == '0') {//凭证类型
                            $(".text-content .p0 span").text("无");
                        } else if (data.data.certificate_type == '1') {
                            $(".text-content .p0 span").text("发票");
                        } else if (data.data.certificate_type == '2') {
                            $(".text-content .p0 span").text("收据");
                        }
                        imageArray = data.data.photo;
                        if (imageArray.length == 2) {
                            $(".remove-photo").remove();
                        } else {
                            $(".remove-photo").removeClass("none");
                        }
                        $(".img-circle").each(function (index, element) {
                            $(this).attr("src", imageArray[index])
                        })
                        $(".img-val").each(function (index, element) {
                            $(this).val(imageArray[index])
                        });
                        //钉钉查看大图
                        $(".img-circle").on("click", function () {
                            let btn = $(this);
                            dd.biz.util.previewImage({
                                urls: imageArray,//图片地址列表,数组
                                current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                                onSuccess: function (result) {
                                    /**/
                                },
                                onFail: function (err) {
                                    _this.$_LIKE_toast("查看大图失败");
                                }
                            });
                        });
                    }else{
                        _this.$_LIKE_toast(data.msg)
                    }
                }).catch(data => {
                    console.log(data)
                })
            }
        })
    }
    ,
    methods: {
    }
    }
</script>