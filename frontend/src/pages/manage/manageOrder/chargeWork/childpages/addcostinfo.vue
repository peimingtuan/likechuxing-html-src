<template>
    <div id="addcostinfo">
        <ul class="endwork-netname">
            <li>
                <span>选择充电桩公司：</span>
                <input class="choice-net input-foucs" @click="choiceCompany()" type="text" value="" placeholder="请选择" readonly/>
                <input class="chargecomid"  type="hidden" value="" />
                <span class="endwork-icon right" @click="choiceCompany()">&#xe623;</span>
            </li>
            <li>
                <span>电量：</span>
                <input class="electricity input-foucs" type="text" value="" placeholder="请输入电量"/>
                <span class="endwork-span right">度</span>
            </li>
            <li>
                <span>电费：</span>
                <input class="fee input-foucs" type="text" value="" placeholder="请输入电费"/>
                <span class="endwork-span right">元</span>
            </li>
            <li>
                <span>服务费：</span>
                <input class="service_fee input-foucs" type="text" value="" placeholder="请输入服务费"/>
                <span class="endwork-span right">元</span>
            </li>
        </ul>
        <div class="cost-finshtime">
            充电完成时间：<span>7月5日 上午8:30</span>
            <font class="right">&#xe623;</font>
        </div>
        <div class="cost-photo">
            <div>
                <input type="hidden" value="" class="image"/>
                <span class="uploadIcon">&#xe616;</span>
                <span class="end-photo none">已上传</span>
                <span class="check-photo none">查看</span>
                <span class="swat-photo none">重拍</span>
            </div>
            <p>充电费用信息</p>
        </div>
        <div class="endworkname-submit">
            <button @click="submit()" ref="submitinfo">提交</button>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/addcostinfo.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import {Select} from '../../../../../component/Select/index'
    import ddConfigs from '../../js/ddConfigs'
    export default{
        data()
    {
        return {
            resultchargeData: [],//缓存充电桩公司数据
            length:0,
            array_void:[],
            imageArray:[]//存储图片
        }
    },
        beforeCreate()
    {
        document.title = '录入费用信息';
    },
    destroyed()
    {
        $("body").css("background","#fff");
    },
        mounted ()
    {
        $("body").css("background","#f6f6f6");
        //获取钉钉授权
        ddConfigs.config();//钉钉授权
        var _this=this;
        $(".cost-finshtime span").text(FoundationTools.getFormatDate(new Date()));//进入页面时间
        //input框的onchange事件
        $(".input-foucs").on("input", function () {
            _this.array_void = [];
            $(".input-foucs").each(function () {
                if ($(this).val() != '') {
                    _this.array_void.push($(this).val());
                }
            })
            if (_this.length > 0 &&  _this.array_void.length == 4) {
                $(".endworkname-submit button").addClass("submit-btn");
            } else {
                $(".endworkname-submit button").removeClass("submit-btn");
            }
        });
        dd.error(function (error) {
            new Toast("钉钉授权验证失败，请关闭页面重新打开")
        });
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '录入费用信息',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
            var userAgent = navigator.userAgent,
                    number = 40,
                    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                number = 80;
            }
            //上传图片
            $(".cost-photo").on("click", ".uploadIcon", function () {
                let btn = $(this);
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
                        _this.imageArray.push(result[0]);
                        btn.siblings(".image").val(result[0]);
                        btn.hide();
                        btn.siblings('.end-photo').removeClass("none");
                        btn.siblings('.check-photo').removeClass("none");
                        btn.siblings('.swat-photo').removeClass("none");
                        _this.length++;
                        if (_this.length > 0 &&   _this.array_void.length==4) {
                            $(".endworkname-submit button").addClass("submit-btn");
                        } else {
                            $(".endworkname-submit button").removeClass("submit-btn");
                        }
                    },
                    onFail: function (err) {
                        new Toast("上传图片失败")
                    }
                });
            });
            //查看照片
            $(".cost-photo").on("click",'.check-photo', function () {
                let btn = $(this);
                //图片浏览器
                dd.biz.util.previewImage({
                    urls: _this.imageArray,//图片地址列表,数组
                    current: btn.siblings(".image").val(),//当前显示的图片链接
                    onSuccess: function (result) {
                        /**/
                    },
                    onFail: function (err) {
                        new Toast("查看大图失败")
                    }
                });
            });
            //移除当前图片
            $(".cost-photo").on("click", ".swat-photo", function () {
                _this.length--;
                if (_this.length > 0 &&  _this.array_void.length==4) {
                    $(".endworkname-submit button").addClass("submit-btn");
                } else {
                    $(".endworkname-submit button").removeClass("submit-btn");
                }
                $(this).addClass("none");
                $(this).siblings('.end-photo').addClass("none");
                $(this).siblings('.check-photo').addClass("none");
                $(this).siblings(".uploadIcon").show();
                let index = _this.imageArray.indexOf($(this).siblings(".image").val());
                _this.imageArray.splice(index, 1);
                $(this).siblings(".image").val("");
            });
            //选择日期和时间
            $(".cost-finshtime").on("click",function(){
                dd.biz.util.datetimepicker({
                    format: 'yyyy-MM-dd HH:mm',
                    value: '', //默认显示
                    onSuccess : function(result) {
                        $(".cost-finshtime span").text(result.value);
                        //onSuccess将在点击完成之后回调
                        /*{
                         value: "2015-06-10 09:50"
                         }
                         */
                    },
                    onFail : function(err) {}
                })
            });
        });
        //获取充电桩公司
        myAjax.post(getApiUrl('/vehicle-charging/hub-list'), {
                    mobile: sessionStorage.getItem('mobile'),
                    charging_branch: sessionStorage.getItem('charging_branch')//充电站id
                },function(data){
                    if(data.status=='0'){
                        _this.resultchargeData=data.data;//充电桩公司
                        if(data.data.length==1){
                            $(".choice-net").val(data.data[0].name);
                            $(".chargecomid").val(data.data[0].id);
                        }
                    }else{
                        new Toast(data.msg)
                    }
        });
    },
    methods:{
        //选择充电桩公司
        choiceCompany(){
            let _this2=this;
            new Select({
                name: '选择充电桩公司',
                id: '公司id',
                options: this.resultchargeData,
                callback: function (item) {
                    $(".choice-net").val(item.name);
                    $(".chargecomid").val(item.id);
                    if (_this2.length > 0 &&  _this2.array_void.length > 2) {
                        $(".endworkname-submit button").addClass("submit-btn");
                    } else {
                        $(".endworkname-submit button").removeClass("submit-btn");
                    }
                }
            })
        },
        //提交充电费用信息
        submit(){
            if($(this.$refs.submitinfo).hasClass("submit-btn")){
                myAjax.post(getApiUrl('/vehicle-charging/operate'), {
                    mobile: sessionStorage.getItem('mobile'),
                    order_id: sessionStorage.getItem('chargeorder_id'),
                    item_id:'5',//操作项id
                    params:{
                        charging_hub:$(".chargecomid").val(),//充电桩公司id
                        electricity:$(".electricity").val(),//电量
                        fee:$(".fee").val(),//电费
                        service_fee:$(".service_fee").val(),//服务费
                        end_time:$(".cost-finshtime span").text(),//结束时间
                        photo:$(".image").val()//图片凭证
                    }
                },function(data) {
                    if (data.status == '0') {
                        if(FoundationTools.getUrlvue(location.hash).type==1){//录入充电中上线结束工单
                            window.location.href="charge.html#/chargeworkfinshed";
                        }else{
                            window.location.href="charge.html#/chargedetail";
                        }
                    }else{
                        new Toast(data.msg)
                    }
                });
            }
        }
    },
    }
</script>