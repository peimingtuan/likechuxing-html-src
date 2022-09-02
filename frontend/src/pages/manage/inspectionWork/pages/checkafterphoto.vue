<template>
    <div id="checkafterphoto">
        <div class="content">
            <div v-if="photo_flag" class="">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆左前照片</p>
            </div>
            <div v-if="photo_flag" class="">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆右前照片</p>
            </div>
            <div v-if="photo_flag" class="">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆左后照片</p>
            </div>
            <div v-if="photo_flag" class="">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车辆右后照片</p>
            </div>
            <div class="">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>驾驶舱前排照片</p>
            </div>
            <div class="">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>驾驶舱后排照片</p>
            </div>
            <div class="" v-if="choicekey">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>车钥匙照片(选拍)</p>
            </div>
            <div class="left1">
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
                <p>其他部位</p>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checkafterphoto.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            photo_flag:true,
            choicekey:true,
            pictureArray:false,//图片是否请求回来
            imageArray:[]//存储图片地址
        }
    }
    ,
    created()
    {
        if(this.$route.query.photo_flag==0)this.photo_flag=false
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
            let _this=this;
            myAjax.post(getApiUrl('/vehicle-inspection/item-result'),{
                mobile:sessionStorage.getItem("mobile"),
                order_id:_this.$route.query.id, //工单id
                item_id:6
            }).then(res=>{
                if(res.status==0){
                    _this.pictureArray=true;
                    _this.imageArray=res.data.photo_string;
                    if(this.$route.query.photo_flag==1){
                        if(_this.imageArray[6]==''){
                            _this.choicekey=false;
                        }
                        $(".img-circle").each(function (index, element) {
                            $(this).attr("src", _this.imageArray[index])
                        })
                        $(".img-val").each(function (index, element) {
                            $(this).val(_this.imageArray[index])
                        })
                    }else{
                        if(_this.imageArray[2]==''){
                            _this.choicekey=false;
                        }
                        $(".img-circle").each(function (index, element) {
                            $(this).attr("src", _this.imageArray[index])
                        })
                        $(".img-val").each(function (index, element) {
                            $(this).val(_this.imageArray[index])
                        })
                    }
                }else{
                    _this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
    }
    }
    }
</script>