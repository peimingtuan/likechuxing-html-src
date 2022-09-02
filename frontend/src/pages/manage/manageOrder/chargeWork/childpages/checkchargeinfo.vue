<template>
    <div id="checkchargeinfo">
        <div class="endwork-netname">
            <span>选择充电站：</span>
            <input class="choice-net input-foucs" type="text" value="" readonly />
        </div>
        <div class="charge-style">
            <div class="top">
                <span>充电方式：</span>
                <span class="quick-charge"><input type="radio" name="chargestyle" value="1" disabled />快充</span>
                <span class="quick-charge"><input type="radio" name="chargestyle" value="2" disabled/>慢充</span>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/checkchargeinfo.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data ()
    {
        return {

        }
    }
    ,
    beforeCreate()
    {
        document.title = '充电信息';
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
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '充电信息',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
            //初始化查询
            myAjax.post(getApiUrl('/vehicle-charging/item-result'), {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('chargeorder_id'),
                item_id:'3'
            },function(data) {
                if(data.status=='0'){
                    $(".choice-net").val(data.data.name);
                    $(".quick-charge input").each(function () {
                        if ($(this).val() == data.data.type) {
                            $(this).attr("checked", true);//充电类型
                        }
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