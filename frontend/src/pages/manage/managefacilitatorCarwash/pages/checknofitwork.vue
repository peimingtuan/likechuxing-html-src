<template>
    <div id="checknofitwork">
        <!--<div class="header">-->
            <!--取消原因：-->
        <!--</div>-->
        <!--<div class="top">-->
            <!--<span>是否需要重洗：</span>-->
            <!--<span class="quick-charge quick"><input type="radio" name="chargestyle" value="0" disabled/>是</span>-->
            <!--<span class="quick-charge slowly"><input type="radio" name="chargestyle" value="1" disabled/>否</span>-->
        <!--</div>-->
        <!-- 拍照-->
        <div class="photo-content none">
            <!--<p>*照片则为必拍项</p>-->
            <div class="left1">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checknofitwork.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import preview from '../../../../../other_modules/previewImg'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
//            pictures:sessionStorage.getItem("carwashpictures")//获取存储洗车不合格图片信息
        }
    }
    ,
    created()
    {

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
        $("#checknofitwork").height(window.screen.height);
        var _this=this;
        var text = '<div class="left1">' + $(".photo-content .left1").html() + '</div>';
            //存储图片
            var imageArray = [];
            if(sessionStorage.getItem("carwashpictures")){
                imageArray = sessionStorage.getItem("carwashpictures").split(",");//转化为数组
                $(".photo-content").removeClass("none");
                for (var i = 1; i < imageArray.length; i++) {
                    $(".photo-content").append(text);
                }
                $(".img-circle").each(function (index, element) {
                    $(this).attr("src", imageArray[index])
                });
                $(".img-val").each(function (index, element) {
                    $(this).val(imageArray[index])
                });
                //钉钉查看大图
                $(".img-circle").on("click", function () {
                    let url=$(this).siblings(".img-val").val();
                    preview({url})
                });
            }else{
                _this.$_LIKE_toast("暂未获取到图片信息");
            }
    }
    ,
    methods: {


    }
    }
</script>