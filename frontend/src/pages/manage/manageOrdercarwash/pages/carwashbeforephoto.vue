<template>
    <div id="carwashbeforephoto">
        <div class="carpicture-content">
            <div class="left">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆左前照片</p>
            </div>
            <div class="right photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆右前照片</p>
            </div>
            <div class="left photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆左后照片</p>
            </div>
            <div class="right photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆右后照片</p>
            </div>
            <div class="left">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>驾驶舱前排照片</p>
            </div>
            <div class="right">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>驾驶舱后排照片</p>
            </div>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/carwashbeforephoto.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import Button from '../component/bottomBtn'
    import $ from 'jquery'
    export default{
        name: "carwashbeforephoto",
        components: {
            Button
        },
        data ()
    {
        return {
            showsubmit:true,//底部按钮
            text:'提交',
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
        dd.ready(function () {
            //上传图片
            var length = 0,
                    imageArray = [];
            var userAgent = navigator.userAgent,
                    number = 40,
                    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                number = 80;
            }
            $(".uploadIcon").on("click", function () {
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
                            btn.siblings('.end-photo').removeClass("none");
                            btn.siblings('.check-photo').removeClass("none");
                            btn.siblings('.swat-photo').removeClass("none");
                            console.log(new Date());
                            length++;
                            if (length > 5) {
                                _this.showsubmit=false;
                            } else {
                                _this.showsubmit=true;
                            }
                        }
                    },
                    onFail: function (err) {
                        _this.$_LIKE_toast("上传图片失败")
                    }
                });
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
                        _this.$_LIKE_toast("查看大图失败")
                    }
                });
            });
            //移除当前图片
            $(".swat-photo").on("click", function () {
                length--;
                if (length > 5) {
                    _this.showsubmit=false;
                } else {
                    _this.showsubmit=true;
                }
                $(this).addClass("none");
                $(this).siblings('.end-photo').addClass("none");
                $(this).siblings('.check-photo').addClass("none");
                $(this).siblings(".uploadIcon").show();
                let index = imageArray.indexOf($(this).siblings(".image").val());
                imageArray.splice(index, 1);
                $(this).siblings(".image").val("");
            })
        });
    }
    ,
    methods: {
        //提交信息
        submitInfo(){
            let array = [];
            $(".image").each(function () {
                array.push($(this).val())
            })
            myAjax.post(getApiUrl('/vehicle-wash/before-upload'),{//结束工单
                    id: sessionStorage.getItem('carwash_orderid'),//工单id
                    mobile: sessionStorage.getItem('mobile'),
                    pictures:array.toString()
                }).then(res=>{
                    if(res.status==0){
                    this.$router.push({
                        path:'/carwashdetail',
                        query:{

                        }
                    })
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