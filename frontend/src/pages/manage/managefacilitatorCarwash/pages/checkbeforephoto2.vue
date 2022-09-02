<template>
    <div id="checkbeforephoto2">
        <div class="content">
            <div class="left">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆左前照片</p>
            </div>
            <div class="right">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆右后照片</p>
            </div>
            <div class="left">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>驾驶舱前排照片</p>
            </div>
            <div class="right">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>驾驶舱后排照片</p>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checkbeforephoto2.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import preview from '../../../../../other_modules/previewImg'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            pictureArray:false,//图片是否请求回来
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
        _this.getpicture();
        //查看图片
        $(".img-circle").on("click",function(){
            if(_this.pictureArray){
                let url=$(this).siblings(".img-val").val();
                preview({url})
            }else{
                _this.$_LIKE_toast("图片正在加载中，请稍后")
            }
        });
    }
    ,
    methods: {
        //初始化获取接口
        getpicture(){
            myAjax.post(getApiUrl('/wash/work-order-record/pic-list'),{
                token:sessionStorage.getItem("access_token"),
                id:this.$route.query.beforerecord_id  //工单操作记录id
            }).then(res=>{
                if(res.status==0){
                    this.pictureArray=true;
                    $(".img-circle").each(function (index, element) {
                        $(this).attr("src", res.data[index])
                    })
                    $(".img-val").each(function (index, element) {
                        $(this).val(res.data[index])
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
        }
    }
    }
</script>