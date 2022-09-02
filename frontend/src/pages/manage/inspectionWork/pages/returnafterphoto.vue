<template>
    <div id="returnafterphoto">
        <div class="carpicture-content">
            <div v-if="photo_flag" class="normal photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆左前照片</p>
            </div>
            <div v-if="photo_flag" class="normal photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆右前照片</p>
            </div>
            <div v-if="photo_flag" class="normal photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆左后照片</p>
            </div>
            <div v-if="photo_flag" class="normal photo-hide">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车辆右后照片</p>
            </div>
            <div class="normal">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>驾驶舱前排照片</p>
            </div>
            <div class="normal">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>驾驶舱后排照片</p>
            </div>
            <div class="">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon choice">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>车钥匙照片(选拍)</p>
            </div>
            <div class="left1">
                <div>
                    <input type="hidden" value="" class="image"/>
                    <span class="uploadIcon record">&#xe616;</span>
                    <span class="end-photo none">已上传</span>
                    <span class="check-photo none">查看</span>
                    <span class="swat-photo none">重拍</span>
                </div>
                <p>其他部位(<font>1</font>/5)</p>
            </div>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/returnafterphoto.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import Button from '../component/bottomBtn'
    import $ from 'jquery'
    export default{
        name: "returnafterphoto",
        components: {
            Button
        },
        data ()
    {
        return {
            photo_flag:true,
            showsubmit:true,//底部按钮
            text:'提交'
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
        var _this = this,
                length = 0,
                length2 = 0,
                imageArray = [],
                imageArray2 = [],
                text = '<div class="left1">' + $(".carpicture-content .left1").html() + '</div>';
        dd.ready(function () {
            //上传图片
            var userAgent = navigator.userAgent,
                    number = 40,
                    isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                number = 80;
            }
            $(".carpicture-content").on("click", '.uploadIcon', function () {
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
                            btn.siblings(".image").val(result[0]);
                            btn.hide();
                            btn.siblings('.end-photo').removeClass("none");
                            btn.siblings('.check-photo').removeClass("none");
                            btn.siblings('.swat-photo').removeClass("none");
                            if (btn.hasClass("record")) {
                                imageArray.push(result[0]);
                                if(length < 4){
                                    $(".carpicture-content").append(text);
                                    $(".carpicture-content .left1:last-of-type").find("font").text(length+2);
                                }
                                length++;
                            }else{
                                if(_this.$route.query.photo_flag==1){
                                    imageArray2.push(result[0]);
                                    if(!btn.hasClass("choice")){
                                        length2++;
                                        if (length2 > 5) {
                                            _this.showsubmit=false;
                                        } else {
                                            _this.showsubmit=true;
                                        }
                                    }
                                }else{
                                    imageArray2.push(result[0]);
                                    if(!btn.hasClass("choice")){
                                        length2++;
                                        if (length2 > 1) {
                                            _this.showsubmit=false;
                                        } else {
                                            _this.showsubmit=true;
                                        }
                                    }
                                }
                            }
                    },
                    onFail: function (err) {
                        _this.$_LIKE_toast("上传图片失败")
                    }
                });
            });
            //查看照片
            $(".carpicture-content").on("click", '.check-photo', function () {
                let btn = $(this),
                        array=imageArray2.concat(imageArray);
                //图片浏览器
                dd.biz.util.previewImage({
                    urls: array,//图片地址列表,数组
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
            $(".carpicture-content").on("click", ".swat-photo", function () {
                let btn = $(this);
                if (btn.siblings('.uploadIcon').hasClass("record")) {
                    let  index = imageArray.indexOf(btn.siblings(".image").val());
                    imageArray.splice(index, 1);
                    btn.siblings(".image").val("");
                    $(".carpicture-content>.left1").each(function () {
                        if ($(this).find(".image").val() == '') {
                            $(this).remove();
                        }
                    });
                    $(".carpicture-content").append(text);
                    $(".carpicture-content .left1:last-of-type").find("font").text(imageArray.length+1);
                    length--;
                    if(imageArray.length==0){
                        length=0;
                        $(".beforephoto-content .left1:last-of-type").find("font").text(1);
                    }
                }else{
                    let  index = imageArray2.indexOf(btn.siblings(".image").val());
                    imageArray2.splice(index, 1);
                    btn.siblings(".image").val("");
                    btn.addClass("none");
                    btn.siblings('.end-photo').addClass("none");
                    btn.siblings('.check-photo').addClass("none");
                    btn.siblings(".uploadIcon").show();
                    length2--;
                    if(!btn.siblings(".uploadIcon").hasClass("choice")){
                        if(_this.$route.query.photo_flag==1){
                            if (length2 > 5) {
                                _this.showsubmit=false;
                            } else {
                                _this.showsubmit=true;
                            }
                        }else{
                            if (length2 > 1) {
                                _this.showsubmit=false;
                            } else {
                                _this.showsubmit=true;
                            }
                        }
                    }
                }
            })
        });
    }
    ,
    methods: {
        //提交信息
        submitInfo(){
            let _this=this,
                    array = [];
            $(".image").each(function () {
                array.push($(this).val())
            })
            $.post(getApiUrl('/vehicle-inspection/operate'),{
                mobile: sessionStorage.getItem("mobile"),
                order_id: _this.$route.query.id, //工单id
                item_id: 6,
                params:{
                    key:sessionStorage.getItem("returnsingleArray").toString(),//key值
                    photo_string:array.toString()
                }
                },function (data) {
                    if(data.status==0){
                        _this.$router.push({
                            path:'/workdetail',
                            query:{
                                 id:_this.$route.query.id
                            }
                        })
                    }else{
                        _this.$_LIKE_toast(data.msg)
                    }
                })
        },
    }
    }
</script>