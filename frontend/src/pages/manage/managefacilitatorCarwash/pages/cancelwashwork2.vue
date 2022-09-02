<template>
    <div id="cancelwashwork2">
        <div class="header" @click="choicecancel()">
            <input type="text" value="" class="" placeholder="请选择取消原因" readonly />
            <span class="header-icon">&#xe623;</span>
        </div>
        <!-- 拍照-->
        <div class="photo-content">
            <p>*如选择“车内存在呕吐物”等，照片则为必拍项。</p>
            <div class="left1">
                <div>
                    <!-- 本地地址-->
                    <!--<input type="hidden" value="" class="preview"/>-->
                    <!-- 服务端返回地址-->
                    <img class="preview none" src="" />
                    <input type="hidden" value="" class="image"/>
                     <span class="uploadIcon">&#xe616;
                        <input type="file" value="" name="" class="uploadphoto" accept="image/*" capture="camera"/>
                    </span>
                    <span class="number">添加照片(<font>1</font>/2)</span>
                    <span class="swat-photo none">&#xe601;</span>
                </div>
            </div>
        </div>
        <!-- 备注信息-->
        <div class="remark-div">
            <p>备注</p>
            <remark :showblock="showblock"  :text_value="placeholder2"/>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/cancelwashwork2.css")
    import getApiUrl from '../js/getApiUrl'
    import {Select} from '../../../../component/Select/index'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import {Indicator} from 'mint-ui'
    import preview from '../../../../../other_modules/previewImg'
    import zipImage from '../js/zipImage'
    import Button from '../component/bottomBtn'
    import remark from '../component/remark'
    export default{
        name: "cancelwashwork2",
        components: {
            remark,
            Button
        },
        data ()
    {
        return {
            length:0,
            showblock:false,//备注信息必填项
            placeholder2:'如发现车辆存在故障，请填写备注信息，200字以内(选填)',//备注信息
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
        var _this=this,
                text = '<div class="left1">' + $(".photo-content .left1").html() + '</div>';
        //上传图片
        $(".photo-content").on("change", ".uploadphoto", function () {
            let pic = $(this).parent().siblings(".preview"),//存储图片的路径
                    image = $(this).parent().siblings(".image"),//存储服务端返回图片的路径
                    uploadIcon= $(this).parent(),//相机icon
                    number=$(this).parent().siblings(".number"),//数字
                    swatphoto=$(this).parent().siblings(".swat-photo"),//重拍icon
                    file = $(this);//上传图片的file
            let ext = file.val().substring(file.val().lastIndexOf(".") + 1).toLowerCase();
            if (ext != 'png' && ext != 'jpg' && ext != 'jpeg' && ext != 'gif') {
                _this.$_LIKE_toast("图片的格式必须为png、gif、jpg、jpeg格式！");
                return false;
            }
            Indicator.open({
                text: '上传中...',
                spinnerType: 'fading-circle'
            });
            let reader = new FileReader();
            reader.readAsDataURL(file[0].files[0]);
            reader.onload = function (e) {
                let imgresult=this.result;
                zipImage(imgresult,{//图片压缩
                    width:500,
                    height:600
                }, function(data){
                    myAjax.post(getApiUrl('/wash/work-order/upload-base64'),{
                        token:sessionStorage.getItem("access_token"),
                        picture:data
                    }).then(res=>{
                        if(res.status==0){
                            pic.attr("src",res.data.url);
                            image.val(res.data.path);//服务端返回的图片的地址
                            let imgpicture=new Image();
                            imgpicture.src=res.data.url;
                            imgpicture.onload=function(){
                                number.hide();
                                uploadIcon.addClass("none");
                                pic.removeClass("none");
                                swatphoto.removeClass("none");
                                Indicator.close();//去除loading
                                if (_this.length < 1) {
                                    $(".photo-content").append(text);
                                    $(".photo-content .left1:last-of-type").find("font").text(2);
                                }
                                _this.length++;
                            }
                        }else if(res.status==401){//验证过期信息
                            Indicator.close();//去除loading
                            _this.$_LIKE_toast("验证信息已失效，请重新登录")
                            setTimeout(function(){
                                window.location.href="index.html#/logon"
                            },2000)
                        }else{
                            Indicator.close();//去除loading
                            _this.$_LIKE_toast(res.msg)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })
            }
        });
        //查看图片
        $(".photo-content").on("click", ".preview", function () {
            if($(this).siblings(".image").val()!=''){
                let url=$(this).attr("src");
                preview({url})
            }
        });
        //重拍
        $(".photo-content").on("click", ".swat-photo", function () {
            _this.length--;
             $(this).parent().parent().remove();
            if(_this.length==0){
                $(".photo-content .left1:last-of-type").find("font").text(1);
            }else if(_this.length==1){
                $(".photo-content").append(text);
                $(".photo-content .left1:last-of-type").find("font").text(2);
            }
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
            myAjax.post(getApiUrl('/wash/work-order/cancel-map'),{
                token:sessionStorage.getItem("access_token")
            }).then(res=>{
                if(res.status == 0){
                    this.cancelresult=res.data;
                }else if(res.status==401){//验证过期信息
                    this.$_LIKE_toast("验证信息已失效，请重新登录")
                    setTimeout(function(){
                        window.location.href="index.html#/logon"
                    },2000)
                }else {
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
            if(this.reason=='4'){//车辆存在呕吐物
                if(pictures.length==0){
                    this.$_LIKE_toast("请先拍照")
                    return false;
                }
            }
            let param={
                token:sessionStorage.getItem("access_token"),
                id:sessionStorage.getItem("carwash_orderid"),//工单id
                reason:this.reason,//取消原因id
                pictures:pictures.toString(),
                remark:$(".void_writeinfo").val(),//备注信息非必填
            }
            myAjax.post(getApiUrl('/wash/work-order/cancel'),param).then(res=>{
                if(res.status == 0){
                    this.$router.push({
                        path:'/networkdetail2',
                        query:{
                            branch_id:res.data.branch_id //网点id
                        }
                    })
                }else if(res.status==401){//验证过期信息
                    this.$_LIKE_toast("验证信息已失效，请重新登录")
                    setTimeout(function(){
                        window.location.href="index.html#/logon"
                    },2000)
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
    }
    }
</script>