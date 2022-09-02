<template>
    <div id="finshworkdetail">
        <div class="recordtails-content">
            <p class="p1">

            </p>
        </div>
        <ul class="recordtails-list">

        </ul>
    </div>
</template>
<script>
    require("../css/finshworkdetail.css")
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
        //获取工单详情
        myAjax.post(getApiUrl('/vehicle-inspection/order-detail'),{
            mobile:sessionStorage.getItem("mobile"),
            order_id:_this.$route.query.id //工单id
        }).then(data=>{
            if (data.status == '0') {
        _this.resultData = data.data;
                sessionStorage.setItem("avenResult", JSON.stringify(data.data));//用于出场缴费
        let strstart = data.data.vin.substring(0, 11),
                strend = data.data.vin.substring(11, 17);
        let string = data.data.plate_no + " <font class='font1'>(" + strend + ")</font><span class='right'>ID" + data.data.id + "</span><br/>" +
                "<span>" + data.data.order_status_text + "</span><span>" + data.data.task.color +"</span><span>" + data.data.task.brand_name +" " +data.data.task.model_name +"</span>";
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
    myAjax.post(getApiUrl('/vehicle-inspection/operate-history'),{
        mobile:sessionStorage.getItem("mobile"),
        order_id: _this.$route.query.id //工单id
    }).then(res=>{
        if(res.status==0){
            let str = '';
            if(res.data.length==0){
                _this.$_LIKE_toast("操作记录为空")
            }else{
                for (var i = 0; i < res.data.length; i++) {
                    let checkli = '';
                    if (res.data[i].item_id == '3') {//巡检事项
                        checkli = '<span class="check check-dinspection right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                    } else if (res.data[i].item_id == '4') {//物品补充
                        checkli = '<span class="check check-matter right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                    }else if (res.data[i].item_id == '6') {//还车验车单
                        checkli = '<span class="check check-after right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                    }else if (res.data[i].item_id == '8') {//出场缴费
                        checkli = '<span class="check check-payment right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                    }
                    str += '<li><span class="span1">&#xe608;' + res.data[i].time + '</span>' + checkli + '<span class="span2">' + res.data[i].operate + '</span><br/><span class="span3">' + res.data[i].real_name + '</span>' +
                            '<span class="span3">(' + res.data[i].user_name + ')</span><br/><span>' + res.data[i].remark + '</span></li>';
                }
            }
            $(".recordtails-list").html(str);
            //跳转查看巡检事项信息
            $(".check-dinspection").on("click", function () {
                window.location.href = "index.html#/checkdinspection?id="+_this.$route.query.id;
            });
            //跳转查看物品补充信息
            $(".check-matter").on("click", function () {
                window.location.href = "index.html#/checkmatter?id="+_this.$route.query.id;
            });
            //跳转查看还车验车单信息
            $(".check-after").on("click", function () {
                window.location.href = "index.html#/checkafterphoto?id="+_this.$route.query.id;
            });
            //跳转查看缴纳停车费信息
            $(".check-payment").on("click", function () {
                window.location.href = "../manageOrdercarwash/index.html#/checkpaymoney?type=1&id=" + _this.$route.query.id;
            });
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