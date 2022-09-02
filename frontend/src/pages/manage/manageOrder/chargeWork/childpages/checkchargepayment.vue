<template>
    <div id="checkchargepayment">
        <!--'<span class="branch_addr"><img class="img1" src="' + img + '"/>' + branch_name + '</span> ';-->
        <div class="checkpayment-content">
            <span>{{resultData.plate_no}}{{resultData==''?'':'('}}<font class="font1">{{resultData==''?'':resultData.vin.substring(0,
                11)}}</font>{{resultData==''?'':resultData.vin.substring(11, 17)}}{{resultData==''?'':'）'}}</span>
            <span v-if="type==1">维修{{resultData.id}}</span>
            <span v-else>充电{{resultData.id}}</span><br/>
            <span>{{resultData.status_name}}</span>
            <span>约续航{{resultData.remain}}公里</span>
            <span>{{resultData.brand_name}} {{resultData.model_name}}</span><br/>
            <span class="branch_addr">
                <img class="img1" v-if="resultData.biz_type == '0'||resultData.end_biz_type=='0'" src="../../image/mapb.png"/>
                <img class="img1" v-else-if="resultData.biz_type == '1'||resultData.end_biz_type=='1'" src="../../image/map-B.png"/>
                <img class="img1" v-else="resultData.biz_type == '2'&&type!=1" src="../../image/mapoiler.png"/>
                {{type==1?resultData.end_branch:resultData.branch_name}}
            </span>
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
    require('../../css/chargeWork/checkchargepayment.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data ()
    {
        return {
        	type:'',
        	his_id:'',
            resultData: JSON.parse(sessionStorage.getItem('resultData'))//存储数据
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
		this.his_id = this.getUrl(url).his_id;
    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
    	var that = this;
        //上传图片
        var length = 0,
                imageArray = [];
        dd.error(function (error) {
            new Toast("钉钉授权验证失败，请关闭页面重新打开")
        });
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '出场缴费',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
            //初始化查询图片接口
            var param,urls;
            if(that.type==1){
            	urls = '/vehicle-repair/history-result';
            	param = {
	                mobile: sessionStorage.getItem("mobile"),
	                id:that.his_id
	            };
            }else{
            	urls = '/vehicle-charging/item-result';
	           	param = {
	                mobile: sessionStorage.getItem("mobile"),
	                order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
	                item_id: '9'//操作id
	            };
	        }
            myAjax.post(getApiUrl(urls), param, function (data) {
                if (data.status == '0') {
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
                    if(that.type==1){
                    	imageArray = data.data.photo;
                    }else{
                    	 imageArray = data.data.photo.split(",");//转化为数组
                    }
                   
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
                    })
                } else {
                    new Toast(data.msg);
                }
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
                            new Toast("查看大图失败");
                        }
                    });
                });
            });
        })
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