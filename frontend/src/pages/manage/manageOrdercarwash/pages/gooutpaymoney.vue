<template>
    <div id="gooutpaymoney">
        <div class="faultpayment-content" v-if="resultData!=''&& fromtype==1">
            <span>{{resultData.task.plate_no}}<font class="font1">（{{resultData.task.vin.substring(11, 17)}}）</font></span>
            <span>洗车{{resultData.id}}</span><br/>
            <span>{{resultData.task.car_status}}</span>
            <span>约续航{{resultData.task.remain}}公里</span>
            <span>{{resultData.task.model_name}}</span><br/>
            <span class="branch_addr">
                <!-- 0合作 1非合作 2加油站-->
                <img class="img1" v-if="resultData.task.biz_type==0" src="../images/mapb.png">
                         <img class="img1" v-else-if="resultData.task.biz_type==1" src="../images/map-B.png">
                         <img class="img1" v-else-if="resultData.task.biz_type==2" src="../images/mapoiler.png">
                         {{resultData.task.branch_address}}
            </span>
        </div>
        <div class="faultpayment-content" v-else-if="resultData!=''&& fromtype==2">
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
                凭证类型：<span><input type="radio" class="certificate" name="certificate" value="1" checked/>发票</span>
                <span><input type="radio" class="certificate" name="certificate" value="2"/>收据</span>
                <span><input type="radio" class="certificate" name="certificate" value="0" checked/>无</span>
            </p>

            <p class="p1">停车费用：<input type="text" value="" class="parkingfee" placeholder="请输入停车费" maxlength="4"/>元</p>
            <!-- 增加费用类型-->
            <p class="p3">
                费用类型：
                <input class="fee-type" type="text" value="" readonly/>
                <input class="car-feeid" type="hidden" value=""/>
                <span class="righticon">&#xe623;</span>
            </p>

            <p class="p2">
    <textarea class="void_write" placeholder="请填写备注信息" maxlength="50">
</textarea>
            </p>
        </div>
        <p class="photo-du">请拍摄照片</p>

        <div class="getpicture-content">
            <div class="left">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon must">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none must-remove">重拍</span>
                </div>
                <p>*车牌号<br/>
                    <span class="parkfee">(产生费用的车辆)</span>
                </p>
            </div>
            <div class="left">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon must hasicam">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none must-remove">重拍</span>
                </div>
                <p>*收费证明</p>
            </div>
            <div class="left remove-photo">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>临停收费标准</p>
            </div>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/gooutpaymoney.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import {Select} from '../../../../component/Select/index'
    import Button from '../component/bottomBtn'
    import $ from 'jquery'
    export default{
        name: "gooutpaymoney",
        components: {
            Button
        },
        data ()
    {
        return {
            fromtype:1,
            resultData:JSON.parse(sessionStorage.getItem('avenResult')) || '',//获取缓存车辆信息
            showsubmit:true,//底部按钮
            text:'提交'
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
        var _this=this,
            imageArray = [],//存储图片
            length = 0;
        dd.ready(function () {
            let userAgent = navigator.userAgent,
                    number = 40,
                    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                number = 80;
            }
            $(".uploadIcon").on("click", function () {
                let btn = $(this);
                if (btn.hasClass("hasicam")) {
                    //钉钉上传图片
                    dd.biz.util.uploadImage({
                        compression: true,//(是否压缩，默认为true)
                        multiple: false, //是否多选，默认false
                        max: 1, //最多可选个数
                        quality: number, // 图片压缩质量,
                        resize: number, // 图片缩放率
                        stickers: {   // 水印信息
                            time: "",
                            dateWeather: "",
                            username: "",
                            address: ""
                        },
                        onSuccess: function (result) {
                            image(result);
                            imageArray.push(result[0]);
                            function image(file) {
                                btn.siblings(".image").val(file[0]);
                                btn.hide();
                                btn.siblings('.end-photo').removeClass("none");
                                btn.siblings('.check-photo').removeClass("none");
                                btn.siblings('.swat-photo').removeClass("none");
                                if (btn.hasClass("must")) {
                                    length++;
                                }
                                if (length > 1 && $(".void_write").val().length > 0 && $(".parkingfee").val().length > 0) {
                                    _this.showsubmit=false;
                                } else {
                                    _this.showsubmit=true;
                                }
                            }
                        },
                        onFail: function (err) {

                        }
                    });
                } else {
                    //钉钉上传图片，仅支持手机拍照
                    dd.biz.util.uploadImageFromCamera({
                        compression: true,//(是否压缩，默认为true)
                        quality: number, // 图片压缩质量,
                        resize: number, // 图片缩放率
                        stickers: {   // 水印信息
                            time: "",
                            dateWeather: "",
                            username: "",
                            address: ""
                        },
                        onSuccess: function (result) {
                            image(result);
                            imageArray.push(result[0]);
                            function image(file) {
                                btn.siblings(".image").val(file[0]);
                                btn.hide();
                                btn.siblings('.end-photo').removeClass("none");
                                btn.siblings('.check-photo').removeClass("none");
                                btn.siblings('.swat-photo').removeClass("none");
                                if (btn.hasClass("must")) {
                                    length++;
                                }
                                if (length > 1 && $(".void_write").val().length > 0 && $(".parkingfee").val().length > 0) {
                                    _this.showsubmit=false;
                                } else {
                                    _this.showsubmit=true;
                                }
                            }
                        },
                        onFail: function (err) {

                        }
                    });
                }
            });

            //查看照片
            $(".check-photo").on("click", function () {
                let btn = $(this);
                //图片浏览器
                dd.biz.util.previewImage({
                    urls: imageArray,//图片地址列表,数组
                    current: btn.siblings(".image").val(),//当前显示的图片链接
                    onSuccess: function (result) {
                        /**/
                    },
                    onFail: function (err) {

                    }
                });
            });
            //移除当前图片
            $(".swat-photo").on("click", function () {
                if ($(this).hasClass("must-remove")) {
                    length--;
                }
                if (length > 1 && $(".void_write").val().length > 0 && $(".parkingfee").val().length > 0) {
                    _this.showsubmit=false;
                } else {
                    _this.showsubmit=true;
                }
                $(this).addClass("none");
                $(this).siblings('.end-photo').addClass("none");
                $(this).siblings('.check-photo').addClass("none");
                $(this).siblings(".uploadIcon").show();
                let index = imageArray.indexOf($(this).siblings(".image").val());
                imageArray.splice(index, 1);
                $(this).siblings(".image").val("");
            });
        });
        //提交按钮点亮
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        $(".parkingfee").on("input", function () {
            if ($(".void_write").val().length > 0 && $(this).val() != '' && regPos.test($(this).val()) && length > 1) {
                _this.showsubmit=false;
            } else {
                _this.showsubmit=true;
            }
        });
        $(".void_write").on("input", function () {
            if ($(this).val().length > 0 && $(".parkingfee").val() != '' && length > 1) {
                _this.showsubmit=false;
            } else {
                _this.showsubmit=true;
            }
        });
        $(".parkingfee").on("blur", function () {
            if (!regPos.test($(this).val())) {
                $(this).val('');
                _this.showsubmit=true;
                _this.$_LIKE_toast("请输入大于等于0的数字");
            }
            if ($(this).val() != '' && !/^-?\d+\.?\d{0,2}$/.test($(this).val())) {
                let num = Number($(this).val());
                $(this).val(num.toFixed(2));
            }
        });

        //选择费用类型
        $(".fee-type").on("click", function () {
            new Select({
                name: '选择费用类型',
                id: '费用类型id',
                options: [{id: 1, name: '超停停车费'}, {id: 0, name: 'B+停车费'}, {id: 2, name: '错停停车、锁车费'}, {
                    id: 3,
                    name: '其他费用'
                }],
                callback: function (item) {
                    $(".fee-type").val(item.name);
                    $(".car-feeid").val(item.id);
                }
            })
        });
    }
    ,
    methods: {
        //提交信息
        submitInfo(){
            if ($(".car-feeid").val() == '') {
                this.$_LIKE_toast("请输入费用类型");
                return false;
            }
            if(this.$route.query.type==1){//来自巡检工单
                let param = {
                    mobile:sessionStorage.getItem("mobile"),
                    order_id: this.$route.query.id, //工单id
                    item_id:8,
                    params:{
                        parking_fee: $(".parkingfee").val(),//运维输入的车费
                        certificate_type: '',//凭证类型
                        photo: '',//凭证图片
                        remark: $(".void_write").val(),//备注信息
                        fee_type: $(".car-feeid").val()//费用类型
                    }
                }
                $(".certificate").each(function () {
                    if ($(this).is(':checked')) {
                        param.params.certificate_type = $(this).val();//凭证类型
                    }
                })
                let array = [];
                $(".image").each(function () {
                    if ($(this).val() != '') {
                        array.push($(this).val())
                    }
                })
                param.params.photo = array.toString();
                $.post(getApiUrl('/vehicle-wash/parking-fee'),param,function(data){
                    if(data.status=='0'){
                        window.location.href="../inspectionWork/index.html#/workdetail?id="+this.$route.query.id;
                    }else{
                        this.$_LIKE_toast(data.msg)
                    }
                })
            }else{
                let param = {
                    mobile: sessionStorage.getItem('mobile'),
                    order_id: sessionStorage.getItem('carwash_orderid'),//洗车工单id
                    parking_fee: $(".parkingfee").val(),//运维输入的车费
                    certificate_type: '',//凭证类型
                    photo: '',//凭证图片
                    remark: $(".void_write").val(),//备注信息
                    fee_type: $(".car-feeid").val()//费用类型
                }
                $(".certificate").each(function () {
                    if ($(this).is(':checked')) {
                        param.certificate_type = $(this).val();//凭证类型
                    }
                })
                let array = [];
                $(".image").each(function () {
                    if ($(this).val() != '') {
                        array.push($(this).val())
                    }
                })
                param.photo = array.toString();
                myAjax.post(getApiUrl('/vehicle-wash/parking-fee'),param).then(data=>{
                    if(data.status=='0'){
                        window.location.href="./index.html#/carwashdetail"
                    }else{
                        this.$_LIKE_toast(data.msg)
                    }
                }).catch(data => {
                    console.log(data)
                })
            }
        },
    }
    }
</script>