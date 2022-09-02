<template>
    <div id="checkwashcost">
        <ul class="cost-list">
            <li>
                <span>车牌(vin)：</span>
                <input class="plate-vin input-foucs"  type="text" value="" readonly/>
            </li>
            <li>
                <span>洗车地点：</span>
                <input class="wash-addresss input-foucs" type="text" value="" readonly/>
            </li>
            <li>
                <span>洗车费用：</span>
                <input class="fee input-foucs" type="text" value="" readonly/>
                <span class="endwork-span right">元</span>
            </li>
        </ul>
        <div class="cost-photo">
            <div>
                <img src="" alt="" name="pic" class="img-circle"/>
                <input type="hidden" value="" class="img-val"/>
            </div>
            <p>添加洗车费照片</p>
        </div>
    </div>
</template>
<script>
    require("../css/checkwashcost.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import Button from '../component/bottomBtn'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {

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
        var _this = this;
        _this.$_LIKE_toast("暂时没有提供接口");
        //上传图片
        var imageArray = [];
        dd.ready(function () {
            //初始化查询图片接口
            myAjax.post(getApiUrl('/vehicle-charging/item-result'),{
                mobile:sessionStorage.getItem("mobile"),
                order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                item_id: '9'//操作id
            }).then(data=>{
                if(data.status==0){
                imageArray = data.data.photo.split(",");//转化为数组
                $(".img-circle").each(function (index, element) {
                    $(this).attr("src", imageArray[index])
                })
                $(".img-val").each(function (index, element) {
                    $(this).val(imageArray[index])
                });
                //钉钉查看大图
                $(".img-circle").on("click", function () {
                    let btn = $(this);
                    dd.biz.util.previewImage({
                        urls: imageArray,//图片地址列表,数组
                        current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                        onSuccess: function (result) {
                            /**/
                        },
                        onFail: function (err) {
                            _this.$_LIKE_toast("查看大图失败");
                        }
                    });
                });
            }else{
                _this.$_LIKE_toast(data.msg)
            }
        }).catch(data => {
            console.log(data)
        })

        })
    }
    ,
    methods: {
    }
    }
</script>