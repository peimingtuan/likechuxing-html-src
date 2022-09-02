<!--xurr181105 添加入口   type 1 维修工单    否则为充电工单  type 2  预警工单  type3 办公用车-->
<template>
    <div id="chargepayment">
        <div class="faultpayment-content" v-if="resultData!=''">
            <span>{{resultData.plate_no}}{{resultData==''?'':'('}}<font class="font1">{{resultData==''?'':resultData.vin.substring(0,
                11)}}</font>{{resultData==''?'':resultData.vin.substring(11, 17)}}{{resultData==''?'':'）'}}</span>
            <span v-if = 'type==1'>维修{{resultData.id}}</span>
            <span v-else-if = 'type==2'>预警{{resultData.id}}</span>
            <span v-else-if = 'type==3'>办公{{resultData.id}}</span>
            <span v-else>充电{{resultData.id}}</span><br/>
            <span>{{resultData.status_name}}</span>
            <span>约续航{{resultData.remain}}公里</span>
            <span>{{resultData.brand_name}} {{resultData.model_name}}</span><br/>
            <span class="branch_addr">
                <img class="img1" v-if="resultData.biz_type == '0'" src="../../image/mapb.png"/>
                <img class="img1" v-else-if="resultData.biz_type == '1'" src="../../image/map-B.png"/>
                <img class="img1" v-else="resultData.biz_type == '2'" src="../../image/mapoiler.png"/>
                {{resultData.branch_name}}
            </span>
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
        <div class="carsingle-nextbtn">
            <button>提交</button>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/chargepayment.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import {Select} from '../../../../../component/Select/index'
    import ddConfigs from '../../js/ddConfigs'
    export default{
        data ()
    {
        return {
            resultData: JSON.parse(sessionStorage.getItem("resultData")) || '',//获取存储数据
            type:''
        }
    }
    ,
    beforeCreate()
    {
        document.title = '出场缴费';
    }
    ,
    created()
    {
    	var url = window.location.href;
		this.type = Number(this.getUrl(url).type);
    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
    	var that = this;
        //获取钉钉授权
        ddConfigs.config();//钉钉授权
        var imageArray = [],//存储图片
                length = 0;
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '出场缴费',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
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
                                    $(".carsingle-nextbtn button").addClass("submit-btn");
                                } else {
                                    $(".carsingle-nextbtn button").removeClass("submit-btn");
                                }
                            }
                        },
                        onFail: function (err) {
                            //new Toast("上传图片失败")
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
                                    $(".carsingle-nextbtn button").addClass("submit-btn");
                                } else {
                                    $(".carsingle-nextbtn button").removeClass("submit-btn");
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
                    $(".carsingle-nextbtn button").addClass("submit-btn");
                } else {
                    $(".carsingle-nextbtn button").removeClass("submit-btn");
                }
                $(this).addClass("none");
                $(this).siblings('.end-photo').addClass("none");
                $(this).siblings('.check-photo').addClass("none");
                $(this).siblings(".uploadIcon").show();
                let index = imageArray.indexOf($(this).siblings(".image").val());
                imageArray.splice(index, 1);
                $(this).siblings(".image").val("");
            });
        })

        //提交按钮点亮
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        $(".parkingfee").on("input", function () {
            if ($(".void_write").val().length > 0 && $(this).val() != '' && regPos.test($(this).val()) && length > 1) {
                $(".carsingle-nextbtn button").addClass("submit-btn");
            } else {
                $(".carsingle-nextbtn button").removeClass("submit-btn");
            }
        });
        $(".void_write").on("input", function () {
            if ($(this).val().length > 0 && $(".parkingfee").val() != '' && length > 1) {
                $(".carsingle-nextbtn button").addClass("submit-btn");
            } else {
                $(".carsingle-nextbtn button").removeClass("submit-btn");
            }
        });
        $(".parkingfee").on("blur", function () {
            if (!regPos.test($(this).val())) {
                $(this).val('');
                $(".carsingle-nextbtn button").removeClass("submit-btn");
                new Toast("请输入大于等于0的数字");
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
        //提交下一页
        var clicktag = 0;
        $(".carsingle-nextbtn button").on("click", function () {
            if ($(this).hasClass("submit-btn")) {
                if ($(".car-feeid").val() == '') {
                    new Toast("请输入费用类型");
                    return false;
                }
                if (clicktag == 0) {
                    clicktag = 1;
                     let param ;
                    //停车缴费接口
                   if(that.type==1){
	                    param = {
	                        mobile: sessionStorage.getItem('mobile'),
	                        order_id: that.resultData.id,//充电工单id
	                        item_id: '9',//操作项id
	                        params: {
	                            parking_fee: $(".parkingfee").val(),//运维输入的车费
	                            certificate_type: '',//凭证类型
	                            photo: '',//凭证图片
	                            remark: $(".void_write").val(),//备注信息
	                            fee_type: $(".car-feeid").val()//费用类型
	                        }
	                    }
	                }else if(that.type==2){//预警工单
	                	param = {
	                        mobile: sessionStorage.getItem('mobile'),
	                        order_id: that.resultData.id,//充电工单id
	                        item_id: '6',//操作项id
	                        params: {
	                            parking_fee: $(".parkingfee").val(),//运维输入的车费
	                            certificate_type: '',//凭证类型
	                            photo: '',//凭证图片
	                            remark: $(".void_write").val(),//备注信息
	                            fee_type: $(".car-feeid").val()//费用类型
	                        }
	                    }
	                }else if(that.type==3){//办公用车
	                	param = {
	                        mobile: sessionStorage.getItem('mobile'),
	                        order_id: that.resultData.id,//办公工单id
	                        item_id: '6',//操作项id
	                        params: {
	                            parking_fee: $(".parkingfee").val(),//运维输入的车费
	                            certificate_type: '',//凭证类型
	                            photo: '',//凭证图片
	                            remark: $(".void_write").val(),//备注信息
	                            fee_type: $(".car-feeid").val()//费用类型
	                        }
	                    }
	                }else{
	                    param = {
	                        mobile: sessionStorage.getItem('mobile'),
	                        order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
	                        item_id: '9',//操作项id
	                        params: {
	                            parking_fee: $(".parkingfee").val(),//运维输入的车费
	                            certificate_type: '',//凭证类型
	                            photo: '',//凭证图片
	                            remark: $(".void_write").val(),//备注信息
	                            fee_type: $(".car-feeid").val()//费用类型
	                        }
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
                    if(that.type==1){
	                    $.ajax({
	                        type: "post",
	                        data: param,
	                        url: getApiUrl('/vehicle-repair/operate'),
	                        beforeSend: function () {
	
	                        },
	                        success: function (data) {
	                            if (data.status == '0') {
	                                location.href = "../../manageOrderService/index.html#/orderDetail?order_id="+that.resultData.id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        }
	                    });
	                }else if(that.type==2){
	                    $.ajax({
	                        type: "post",
	                        data: param,
	                        url: getApiUrl('/vehicle-zombie/operate'),
	                        beforeSend: function () {
	
	                        },
	                        success: function (data) {
	                            if (data.status == '0') {
	                                location.href = "../../manageOrderWarning/index.html#/warningOrder?order_id="+that.resultData.id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        }
	                    });
	                }else if(that.type==3){
	                    $.ajax({
	                        type: "post",
	                        data: param,
	                        url: getApiUrl('/vehicle-office/operate'),
	                        beforeSend: function () {
	
	                        },
	                        success: function (data) {
	                            if (data.status == '0') {
	                                location.href = "../../manageOrderOfficecar/index.html#/orderDetail?order_id="+that.resultData.id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        }
	                    });
	                }else{
	                    $.ajax({
	                        type: "post",
	                        data: param,
	                        url: getApiUrl('/vehicle-charging/operate'),
	                        beforeSend: function () {
	
	                        },
	                        success: function (data) {
	                            if (data.status == '0') {
	                                location.href = "charge.html#/chargedetail";
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        }
	                    });
	                }
                    setTimeout(function () {
                        clicktag = 0;
                    }, 5000);
                }
            }
        });
    }
    ,
    methods: {
    	getUrl (linkUrl) {//截取链接
		  var str, arr, newArr, num, num2, i, j, newJson
		  if (linkUrl) {
		    str = decodeURIComponent (linkUrl.split('?')[1])
		    arr = str.split('&')
		    num = arr.length
		    newJson = {}
		    for (i = 0; i < num; i++) {
		      newArr = arr[i].split('=')
		      num2 = newArr.length
		      newJson[newArr[0]] = newArr[1]
		    }
		    return newJson
		  } else {
		    return {}
		  }
		},
    }
    }
</script>