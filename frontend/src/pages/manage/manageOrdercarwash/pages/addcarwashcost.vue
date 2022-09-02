<template>
    <div id="addcarwashcost">
        <ul class="cost-list">
            <li>
                <span>车牌(vin)：</span>
                <input v-if="resultData !=''" class="plate-vin input-foucs" v-model="resultData.task.plate_no"   type="text" value="" placeholder="" readonly/>
            </li>
            <li>
                <span>洗车地点：</span>
                <input class="wash-addresss input-foucs" type="text" value="" placeholder="请输入洗车地点"/>
            </li>
            <li>
                <span>洗车费用：</span>
                <input class="fee input-foucs" type="text" value="" placeholder="请输入洗车费用"/>
                <span class="endwork-span right">元</span>
            </li>
        </ul>
        <div class="cost-photo">
            <div>
                <input type="hidden" value="" class="image"/>
                <span class="uploadIcon">&#xe616;</span>
                <span class="end-photo none">已上传</span>
                <span class="check-photo none">查看</span>
                <span class="swat-photo none">重拍</span>
            </div>
            <p>添加洗车费照片</p>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/addcarwashcost.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import Button from '../component/bottomBtn'
    import $ from 'jquery'
    export default{
        name: "addcarwashcost",
        components: {
            Button
        },
        data ()
    {
        return {
            resultData:JSON.parse(sessionStorage.getItem('avenResult')) || '',//获取缓存车辆信息
            showsubmit:true,//底部按钮
            text:'提交'
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
                            length++;
                            if (length > 0) {
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
                if (length > 0) {
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
            if($(".wash-addresss").val()==''){
                this.$_LIKE_toast("请输入洗车地点")
                return false;
            }
            if($(".fee").val()==''){
                this.$_LIKE_toast("请输入洗车费用")
                return false;
            }
            if($(".image").val()==''){
                this.$_LIKE_toast("请添加洗车照片")
                return false;
            }
            myAjax.post(getApiUrl('/vehicle-wash/add-fee'),{
                mobile:sessionStorage.getItem("mobile"),
                order_id:sessionStorage.getItem("carwash_orderid"), //工单id
                price:$(".fee").val(),//洗车费用
                pictures:$(".image").val(),//洗车费用照片
                place:$(".wash-addresss").val()//洗车地点
            }).then(res=>{
                if(res.status == 0){
                window.location.href="./index.html#/carwashdetail";
            }else
            {
                this.$_LIKE_toast(res.msg)
            }
            }).catch(err => {
                console.log(err)
            })
        },
    }
    }
</script>