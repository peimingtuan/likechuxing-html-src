<template>
    <div id="checkcostinfo">
        <ul class="endwork-netname">
            <li>
                <span>选择充电桩公司：</span>
                <span>{{resultData.charging_hub}}</span>
            </li>
            <li>
                <span>电量：</span>
                <span>{{resultData.electricity}}度</span>
            </li>
            <li>
                <span>电费：</span>
                <span>{{resultData.fee}}元</span>
            </li>
            <li>
                <span>服务费：</span>
                <span>{{resultData.service_fee}}元</span>
            </li>
        </ul>
        <div class="cost-finshtime">
            充电完成时间：<span>{{resultData.end_time}}</span>
        </div>
        <div class="cost-photo">
            <div>
                <img src="" alt="" name="pic" class="img-circle"/>
                <input type="hidden" value="" class="img-val"/>
            </div>
            <p>充电费用信息</p>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/checkcostinfo.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data ()
    {
        return {
            resultData:''//存储数据
        }
    }
    ,
    beforeCreate()
    {
        document.title = '费用信息';
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
            dd.biz.navigation.setTitle({
                title: '费用信息',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
            var imageArray = [];//存放图片路径的数组
            //初始化查询
            myAjax.post(getApiUrl('/vehicle-charging/item-result'), {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('chargeorder_id'),
                item_id:'5'
            },function(data) {
                if(data.status=='0'){
                    _this.resultData=data.data;
                    imageArray = data.data.photo;
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
                                new Toast("查看大图失败")
                            }
                        });
                    });
                }else{
                    new Toast(data.msg)
                }
            });
        });
    }
    ,
    methods: {
    }
    }
</script>