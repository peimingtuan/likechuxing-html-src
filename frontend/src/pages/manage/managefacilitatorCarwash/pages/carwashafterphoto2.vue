<template>
    <div id="carwashafterphoto2">
        <div class="carpicture-content">
            <div class="left">
                <div>
                    <!-- 本地地址-->
                    <!--<input type="hidden" value="" class="preview"/>-->
                    <!-- 服务端返回地址-->
                    <img class="preview none" src="" />
                    <input type="hidden" value="" class="image"/>
                     <span class="uploadIcon">&#xe616;
                        <input type="file" value="" name="" class="uploadphoto" accept="image/*" capture="camera"/>
                    </span>
                    <span class="swat-photo none">&#xe601;</span>
                </div>
                <p>车辆左前照片</p>
            </div>
            <div class="right">
                <div>
                    <!-- 本地地址-->
                    <!--<input type="hidden" value="" class="preview"/>-->
                    <!-- 服务端返回地址-->
                    <img class="preview none" src="" />
                    <input type="hidden" value="" class="image"/>
                     <span class="uploadIcon">&#xe616;
                        <input type="file" value="" name="" class="uploadphoto" accept="image/*" capture="camera"/>
                    </span>
                    <span class="swat-photo none">&#xe601;</span>
                </div>
                <p>车辆右后照片</p>
            </div>
            <div class="left">
                <div>
                    <!-- 本地地址-->
                    <!--<input type="hidden" value="" class="preview"/>-->
                    <!-- 服务端返回地址-->
                    <img class="preview none" src="" />
                    <input type="hidden" value="" class="image"/>
                     <span class="uploadIcon">&#xe616;
                        <input type="file" value="" name="" class="uploadphoto" accept="image/*" capture="camera"/>
                    </span>
                    <span class="swat-photo none">&#xe601;</span>
                </div>
                <p>驾驶舱前排照片</p>
            </div>
            <div class="right">
                <div>
                    <!-- 本地地址-->
                    <!--<input type="hidden" value="" class="preview"/>-->
                    <!-- 服务端返回地址-->
                    <img class="preview none" src="" />
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;
                        <input type="file" value="" name="" class="uploadphoto" accept="image/*" capture="camera"/>
                    </span>
                    <span class="swat-photo none">&#xe601;</span>
                </div>
                <p>驾驶舱后排照片</p>
            </div>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/carwashafterphoto2.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import preview from '../../../../../other_modules/previewImg'
    import zipImage from '../js/zipImage'
    import Button from '../component/bottomBtn'
    import $ from 'jquery'
    import {Indicator} from 'mint-ui'
    export default{
        name: "carwashafterphoto",
        components: {
            Button
        },
        data ()
    {
        return {
            showsubmit:true,//底部按钮
            text:'提交',
            length:0,//点亮按钮
        }
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
        $("body").css("background","#fff");
        var _this=this;
        //上传图片
        $(".uploadphoto").change(function () {
            let pic = $(this).parent().siblings(".preview"),//存储图片的路径
                    image = $(this).parent().siblings(".image"),//存储服务端返回图片的路径
                    uploadIcon= $(this).parent(),//相机icon
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
                            _this.length++;
                            let imgpicture=new Image();
                            imgpicture.src=res.data.url;
                            imgpicture.onload=function(){
                                uploadIcon.addClass("none");
                                pic.removeClass("none");
                                swatphoto.removeClass("none");
                                Indicator.close();//去除loading
                                if( _this.length==4){
                                    _this.showsubmit=false;
                                }else{
                                    _this.showsubmit=true;
                                }
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
                });
            }
        });
        //查看图片
        $(".preview").on("click",function(){
            if($(this).siblings(".image").val()!=''){
                let url=$(this).attr("src");
                preview({url})
            }
        });
        //重拍
        $(".swat-photo").on("click",function(){
            _this.length--;
            if( _this.length==4){
                _this.showsubmit=false;
            }else{
                _this.showsubmit=true;
            }
            $(this).siblings(".preview").attr('src','');//清除服务端返回图片的路径
            $(this).siblings(".image").val('');//清除服务端返回图片的路径
            $(this).addClass("none");
            $(this).siblings(".preview").addClass("none");
            $(this).siblings(".uploadIcon").removeClass("none");
        });
    }
    ,
    methods: {
        //提交信息
        submitInfo(){
            Indicator.open({
                text: '提交中...',
                spinnerType: 'fading-circle'
            });
            let pictures=[];
            $(".image").each(function () {
                pictures.push($(this).val())
            })
            myAjax.post(getApiUrl('/wash/work-order/after-upload'),{
                token:sessionStorage.getItem("access_token"),
                pictures:pictures.toString(),
                id:sessionStorage.getItem("carwash_orderid") //工单id
            }).then(res=>{
                Indicator.close();
                if(res.status==0){
                    this.$router.push({
                        path:'/carwashdetail2',
                        query:{

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