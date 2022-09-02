<template>
    <div id="finshcarwashdetail">
        <div class="recordtails-content">
            <p class="p1">

            </p>
        </div>
        <ul class="recordtails-list">

        </ul>
    </div>
</template>
<script>
    require("../css/finshcarwashdetail.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import Loading from '../../../../component/loading'
    import $ from 'jquery'
    export default{
        data ()
    {
        return {
            resultData: ''//获取缓存数据
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
        var loading = new Loading()//加载loading
        //获取洗车工单详情
        myAjax.post(getApiUrl('/vehicle-wash/detail'),{
            mobile:sessionStorage.getItem("mobile"),
            id:sessionStorage.getItem("carwash_orderid") //工单id
        }).then(data=>{
            if (data.status == '0') {
        _this.resultData = data.data;
        let strstart = data.data.task.vin.substring(0, 11),
                strend = data.data.task.vin.substring(11, 17);
        let string = data.data.task.plate_no + " <font class='font1'>(" + strend + ")</font><span class='right'>洗车" + data.data.id + "</span><br/>" +
                "<span>" + data.data.status_name + "</span><span>" + data.data.task.model_name +"</span>";
        $(".recordtails-content .p1").html(string);
        //展示页面
        loading.destroy()//清除loading
    } else {
        _this.$_LIKE_toast(data.msg);
    }
    }).catch(data => {
        console.log(data)
    });
    //操作记录
    myAjax.post(getApiUrl('/vehicle-wash/record'),{
        mobile:sessionStorage.getItem("mobile"),
        id:sessionStorage.getItem("carwash_orderid") //工单id
    }).then(res=>{
        if(res.status==0){
            let str = '';
            if(res.data.length==0){
                _this.$_LIKE_toast("操作记录为空")
            }else{
                for (var i = 0; i < res.data.length; i++) {
                    let checkli = '';
                    if(res.data[i].status==1){//1洗车中
                        if (res.data[i].current_status == '1') {//取车信息
                            checkli = '<span class="check check-before right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                        } else if (res.data[i].current_status == '2') {//还车信息
                            checkli = '<span class="check check-after right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                        }
                    }
                    str += '<li><span class="span1">&#xe608;' + res.data[i].update_time + '</span>' + checkli + '<span class="span2">' + res.data[i].status_name + '</span><br/><span class="span3">' + res.data[i].user_name + '</span>' +
                            '<span class="span3">(' + res.data[i].phone + ')</span><br/><span>' + res.data[i].remark + '</span></li>';
                }
            }
            $(".recordtails-list").html(str);
            //跳转查看取车验车单信息
            $(".check-before").on("click", function () {
                window.location.href = "index.html#/checkbeforephoto?beforerecord_id="+$(this).find(".id").val();
            });
            //跳转查看还车验车单信息
            $(".check-after").on("click", function () {
                window.location.href = "index.html#/checkafterphoto?afterrecord_id="+$(this).find(".id").val();
            });
            //跳转查看录入费用信息
            //        $(".check-addmoneyhs").on("click", function () {
            //            window.location.href = "charge.html#/checkcostinfo";
            //        });
            //跳转查看缴纳停车费信息
            //        $(".check-payment").on("click", function () {
            //            window.location.href = "charge.html#/checkchargepayment?record_id=" + $(this).find(".id").val();
            //        });
        }else{
            _this.$_LIKE_toast(res.msg)
        }
    }).catch(err => {
        console.log(err)
    })
    }
    ,
    methods: {
    }
    }
</script>