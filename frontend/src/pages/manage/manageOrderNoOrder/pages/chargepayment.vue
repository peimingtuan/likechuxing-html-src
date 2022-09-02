<!--xurr181105 添加入口   type 1 维修工单    否则为充电工单  type 2  预警工单  type3 办公用车   4无单启动-->
<template>
    <div id="chargepayment">
        <div class="faultpayment-content" v-if="resultData!=''">
            <span>{{resultData.plate_no}}{{resultData==''?'':'('}}<font class="font1">{{resultData==''?'':resultData.vin.substring(0,
                11)}}</font>{{resultData==''?'':resultData.vin.substring(11, 17)}}{{resultData==''?'':'）'}}</span>
            <span>追车{{resultData.id}}</span>
            <span>{{resultData.status_name}}</span>
            <span>约续航{{resultData.remain}}公里</span>
            <span>{{resultData.brand_name}} {{resultData.model_name}}</span><br/>
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
    require('../../manageOrder/css/chargeWork/charge.css')
    import $ from 'jquery'
    import FoundationTools from '../../manageOrder/js/functionAjax'
//  import getApiUrl from '../../manageOrder/js/getApiUrl'
    import {getOspApiUrl} from '../js/getApiUrl'
    import myAjax from '../../manageOrder/common/myAjax/withJq.js'
    import {Select} from '../../../../component/Select/index'
    import ddConfigs from '../../manageOrder/js/ddConfigs'
    import {Confirm,Toast} from '../../manageOrder/common/LikeAlert/index'
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
		let deviceWidth = document.documentElement.clientWidth;
		if(deviceWidth > 640) deviceWidth = 640;
		window.REM = deviceWidth / 3.75
		document.documentElement.style.fontSize = REM + 'px';
		$('.LikeAlert').css("display",'none')
    }
    ,
    mounted()
    {
    	this.allSize();
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
                   
                    param = {
                        mobile: sessionStorage.getItem('mobile'),
                        order_id: that.resultData.id,//充电工单id
                        item_id: '4',//操作项id
                        params: {
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
//                  param.params.photo = "http://static.dingtalk.com/media/lADPDgQ9qTqhr4nNBADNAkA_576_1024.jpg,http://static.dingtalk.com/media/lADPDgQ9qTqhr4nNBADNAkA_576_1024.jpg"
	                    $.ajax({
	                        type: "post",
	                        data: param,
	                        url: getOspApiUrl('/vehicle-abnormal/operate'),
	                        beforeSend: function () {
	
	                        },
	                        success: function (data) {
	                            if (data.status == '0') {
	                                location.href = "index.html#/orderDetail?order_id="+that.resultData.id;
	                            } else {
	                                new Toast(data.msg);
	                            }
	                        }
	                    });
	               
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
		allSize() {
	    	var htmlBq = document.documentElement;
	      var htmlWidth = htmlBq.clientWidth;
	      if (htmlWidth >= 640) {
	        htmlBq.style.fontSize = '40px';
	      } else if (htmlWidth < 640 && htmlWidth >= 320) {
	        htmlBq.style.fontSize = htmlWidth / (640 / 40) + 'px';
	      } else if (htmlWidth < 320) {
	        htmlBq.style.fontSize = '20px';
	      }
	    }
    }
    }
</script>
<style scoped>
body{
	font-size: .6rem;
}
* {
    font-size: .6rem;
    color: #494B51;
    margin: 0;
    box-sizing: content-box;
}
	#chargepayment .faultpayment-content {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    /*height: 4.8rem;*/
    padding: .5rem;
    margin-bottom: .5rem;
    border-bottom: 1px solid #f6f6f6;
}

#chargepayment .faultpayment-content span .font1 {
    color: #999999;
    margin-right: .1rem;
}

#chargepayment .faultpayment-content span {
    display: inline-block;
    height: 1.2rem;
    line-height: 1.2rem;
}

#chargepayment .faultpayment-content span img {
    width: 1rem;
    margin-right: .3rem;
}

#chargepayment .faultpayment-content span:nth-of-type(2) {
    float: right;
    color: #999;
}

#chargepayment .faultpayment-content span:nth-of-type(3) {
    line-height: 1rem;
    padding: .1rem;
    margin-top: .15rem;
    margin-right: .2rem;
    border: 1px solid #f6f6f6;
}

#chargepayment .faultpayment-content span:nth-of-type(4) {
    line-height: 1rem;
    padding: .1rem;
    margin-top: .15rem;
    margin-right: .2rem;
    border: 1px solid #f6f6f6;
}

#chargepayment .faultpayment-content span:nth-of-type(5) {
    line-height: 1rem;
    padding: .1rem;
    margin-top: .15rem;
    border: 1px solid #f6f6f6;
}

#chargepayment .carsingle-nextbtn {
    position: fixed;
    bottom: 0;
    width: 16rem;
    padding: .5rem;
    background: #fff;
    box-shadow: 0px -2px 1px #eaeaea;
}

#chargepayment .carsingle-nextbtn button {
    width: 15rem;
    line-height: 1.9rem;
    text-align: center;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 2px;
    background: #d1d1d1;
    box-sizing: border-box;
}

#chargepayment .submit-btn {
    background: #333333 !important;
}

/*输入框样式*/
#chargepayment .text-content {
    margin: .5rem;
}

#chargepayment .text-content .p0 {
    line-height: 2.1rem;
}

#chargepayment .text-content .p0 span {
    display: inline-block;
    height: 2rem;
    padding: 0 .3rem;
}

#chargepayment .text-content .p0 input {
    margin-right: .2rem;
}

#chargepayment .text-content .p1 {
    height: 1.5rem;
}

#chargepayment .text-content .p2 {
    margin-top: .5rem;
    /*height: 4rem;*/
    border: 1px solid gray;
    background: #f7f7f7;
}

/*增加费用类型*/
#chargepayment .text-content .p3 {
    height: 1.5rem;
}

#chargepayment .text-content .p3 .righticon {
    font-family: 'iconfont';
}

#chargepayment .parkingfee, .fee-type {
    box-sizing: border-box;
    width: 10rem;
    border: none;
    padding-left: .5rem;
    line-height: 1.4rem;
    height: 1.4rem;
    outline: none;
    border-radius: 2px;
}

#chargepayment .text-content .void_write {
    box-sizing: border-box;
    width: 100%;
    height: 4rem;
    padding: .5rem;
    outline: none;
    border: none;
    border-radius: 2px;
    background: #f7f7f7;
}

/*拍照样式*/
#chargepayment .photo-du {
    line-height: 1.2rem;
    padding-left: .5rem;
}

#chargepayment .getpicture-content {
    padding: .3rem .5rem 2.5rem;
    height: 7.5rem;
}

#chargepayment .getpicture-content .left {
    margin-right: .6rem;
}

#chargepayment .getpicture-content > div {
    margin-bottom: 1rem;
}

#chargepayment .getpicture-content > div > p {
    text-align: center;
    line-height: 1rem;
}

#chargepayment .getpicture-content > div > div {
    position: relative;
    width: 4.2rem;
    height: 4.2rem;
    background: #f4f4f4;
}

#chargepayment .parkfee {
    color: #d1d1d1;
    font-size: .5rem;
}

#chargepayment .uploadIcon {
    font-family: 'iconfont';
    font-size: 1.38rem;
    position: absolute;
    left: 1.41rem;
    top: 1.41rem;
}

#chargepayment .end-photo {
    display: inline-block;
    position: absolute;
    left: .95rem;
    top: .8rem;
    font-size: .8rem;
}

#chargepayment .check-photo {
    display: inline-block;
    position: absolute;
    left: .5rem;
    top: 2.8rem;
    color: #43aff7;
}

#chargepayment .swat-photo {
    display: inline-block;
    position: absolute;
    left: 2.6rem;
    top: 2.8rem;
    color: #43aff7;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #b0b0b0;
    font-size: .5rem;
}

input:-moz-input-placeholder, textarea:-moz-input-placeholder {
    color: #b0b0b0;
    font-size: .5rem;
}

input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: #b0b0b0;
    font-size: .5rem;
}
</style>