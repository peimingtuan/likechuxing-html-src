<template>
    <div id="cancelwashwork">
        <div class="header" @click="choicecancel()">
            <input type="text" value="" class="" placeholder="请选择不合格原因" readonly />
            <span class="header-icon">&#xe623;</span>
        </div>
        <div class="top">
            <span>是否需要重洗：</span>
            <span class="quick-charge quick"><input type="radio" name="chargestyle" value="0"/>是</span>
            <span class="quick-charge slowly"><input type="radio" name="chargestyle" value="1"/>否</span>
        </div>
        <!-- 拍照-->
        <div class="photo-content ">
            <p>*照片则为必拍项</p>
            <div class="left1">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="number">添加照片(<font>1</font>/4)</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
            </div>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/cancelwashwork.css")
    import getApiUrl from '../js/getApiUrl'
    import {Select} from '../../../../component/Select/index'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import Button from '../component/bottomBtn'
    export default{
        name: "cancelwashwork",
        components: {
            Button
        },
        data ()
    {
        return {
            length:0,
            showsubmit:true,//底部按钮
            text:'提交',
            cancelresult: [],//取消选择原因
            reason:'',//取消原因id
        }
    }
    ,
    created()
    {
        this.cancel();
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        var _this=this;
        var text = '<div class="left1">' + $(".photo-content .left1").html() + '</div>';
        dd.ready(function () {
            //上传图片
            var imageArray = [];
            var userAgent = navigator.userAgent,
                    number = 40,
                    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                number = 80;
            }
            $(".photo-content").on("click",".uploadIcon", function () {
                let btn = $(this);
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
                        imageArray.push(result[0])
                        function image(file) {
                            btn.siblings(".image").val(file[0]);
                            btn.hide();
                            btn.siblings(".number").addClass("none");
                            btn.siblings('.end-photo').removeClass("none");
                            btn.siblings('.check-photo').removeClass("none");
                            btn.siblings('.swat-photo').removeClass("none");
                            if (_this.length < 3) {
                                $(".photo-content").append(text);
                                $(".photo-content .left1:last-of-type").find("font").text(_this.length+2);
                                _this.length++;
                            }
                        }
                    },
                    onFail: function (err) {
                        _this.$_LIKE_toast("上传图片失败")
                    }
                });
            });
            //查看照片
            $(".photo-content").on("click",".check-photo", function () {
                let btn = $(this);
                //图片浏览器
                dd.biz.util.previewImage({
                    urls: imageArray,//图片地址列表,数组
                    current: btn.siblings(".image").val(),//当前显示的图片链接
                    onSuccess: function (result) {
                        /**/
                    },
                    onFail: function (err) {
                        _this.$_LIKE_toast("查看大图失败")
                    }
                });
            });
            //移除当前图片
            $(".photo-content").on("click",".swat-photo", function () {
                let btn = $(this),
                        index = imageArray.indexOf(btn.siblings(".image").val());
                imageArray.splice(index, 1);
                btn.siblings(".image").val("");
                $(".photo-content>div").each(function () {
                    if ($(this).find(".image").val() == '') {
                        $(this).remove();
                    }
                });
                $(".photo-content").append(text);
                $(".photo-content .left1:last-of-type").find("font").text(imageArray.length+1);
                _this.length--;
                if(imageArray.length===0){
                    _this.length=0;
                }
            })
        });
    }
    ,
    methods: {
        //选择充电桩公司
        choicecancel(){
            let _this=this;
            if(_this.cancelresult.length!=0){
                new Select({
                    name: '选择取消原因',
                    id: '原因id',
                    options: this.cancelresult,
                    callback: function (item) {
                        _this.showsubmit=false;//点亮按钮
                        _this.reason=item.id;
                        $(".header input").val(item.name);
                    }
                })
            }else{
                _this.$_LIKE_toast("正在获取数据，稍后重试")
            }
        },
        //获取取消原因
        cancel(){
            myAjax.post(getApiUrl('/vehicle-wash/not-qualified-map'),{
                mobile:sessionStorage.getItem("mobile")
                }).then(res=>{
                    if(res.status == 0){
                    this.cancelresult=res.data;
                }else
                {
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
    },
    //提交信息
    submitInfo(){
        let pictures=[];
        $(".photo-content .image").each(function () {
            if($(this).val()!=''){
                pictures.push($(this).val())
            }
        });
        if(pictures.length==0){
            this.$_LIKE_toast("请先拍照")
            return false;
        }
        let param={
            mobile:sessionStorage.getItem("mobile"),
            id:sessionStorage.getItem("carwash_orderid"),//工单id
            reason_id:this.reason,//取消原因id
            pictures:pictures.toString(),
            rework_status:''//是否需要洗车
        }
        $(".quick-charge input").each(function () {//单选是否需要重洗
            if ($(this).is(':checked')) {
                param.rework_status = $(this).val();
                return false;
            }
        });
        if(param.rework_status===''){
            this.$_LIKE_toast("请选择是否重洗")
            return false;
        }
        myAjax.post(getApiUrl('/vehicle-wash/set-not-qualified'),param).then(res=>{
            if(res.status == 0){
                this.$router.push({
                    path:'/networkdetail',
                    query:{
                        branch_id:res.data.branch_id
                    }
                })
            }else{
                this.$_LIKE_toast(res.msg)
            }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    }
</script>