<template>
    <div id="checkbeforephoto">
        <div class="content">
            <div class="left">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆左前照片</p>
            </div>
            <div class="right photo-hide none">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆右前照片</p>
            </div>
            <div class="left photo-hide none">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆左后照片</p>
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
    require("../css/checkbeforephoto.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            pictureArray:false,//图片是否请求回来
            imageArray:[]//存储图片地址
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
        var _this=this;
        _this.getpicture();
        //调取钉钉接口
        dd.ready(function () {
            //钉钉查看大图
            $(".img-circle").on("click", function () {
                let btn = $(this);
                if(_this.pictureArray){
                    dd.biz.util.previewImage({
                        urls: _this.imageArray,//图片地址列表,数组
                        current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                        onSuccess: function (result) {
                            /**/
                        },
                        onFail: function (err) {
                            new Toast("查看大图失败")
                        }
                    });
                }else{
                    _this.$_LIKE_toast("图片正在加载中，请稍后")
                }
            });
        });
    }
    ,
    methods: {
        //初始化获取接口
        getpicture(){
            myAjax.post(getApiUrl('/vehicle-wash/record-picture'),{
                mobile:sessionStorage.getItem("mobile"),
                id:this.$route.query.beforerecord_id //工单操作记录id
            }).then(res=>{
                if(res.status==0){
                    this.pictureArray=true;
                    this.imageArray=res.data;
                    if(this.imageArray.length==4){
                        $(".photo-hide").remove();
                    }else{
                        $(".photo-hide").removeClass("none");
                    }
                    $(".img-circle").each(function (index, element) {
                        $(this).attr("src", res.data[index])
                    })
                    $(".img-val").each(function (index, element) {
                        $(this).val(res.data[index])
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