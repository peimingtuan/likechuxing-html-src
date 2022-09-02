<template>
    <div id="finsheddetail" class="none">
        <div class="recordtails-content">
            <p class="p1">

            </p>
        </div>
        <ul class="recordtails-list">

        </ul>
    </div>
</template>

<script>
    require('../../css/chargeWork/finsheddetail.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl';
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import Loading from '../../../../../component/loading'
    export default{
        data()
    {
        return {
            resultData: ''//获取缓存数据
        }
    }
    ,
        beforeCreate ()
    {
        document.title = '工单详情';
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
        //获取充电工单详情
        myAjax.post(getApiUrl('/vehicle-charging/order-detail'), {
            mobile: sessionStorage.getItem("mobile"),
            order_id: sessionStorage.getItem("chargeorder_id")//充电工单id
        }, function (data) {
            if (data.status == '0') {
                _this.resultData = data.data;
                let strstart = data.data.vin.substring(0, 11),
                        strend = data.data.vin.substring(11, 17);
                let string = data.data.plate_no + " (<font class='font1'>" + strstart + "</font>" + strend + ")<span class='right'>充电" + data.data.id + "</span><br/>" +
                        "<span>" + data.data.status_name + "</span><span>续航里程" + data.data.remain_km + "km</span><span>" + data.data.brand_name + " " + data.data.model_name + "</span>";
                $(".recordtails-content .p1").html(string);
                //展示页面
                loading.destroy()//清除loading
                $("#finsheddetail").removeClass("none");
            } else {
                new Toast(data.msg);
            }
        });

//操作历史
        myAjax.post(getApiUrl('/vehicle-charging/operate-history'), {
            mobile: sessionStorage.getItem("mobile"),
            order_id: sessionStorage.getItem("chargeorder_id")//充电工单id
        }, function (data) {
            if (data.status == '0') {
                let str = '';
                for (var i = 0; i < data.data.length; i++) {
                    let checkli = '';
                    if (data.data[i].item_id == '1') {//取车验车单信息
                        checkli = '<span class="check check-before right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '2') {//充电还车验车单信息
                        checkli = '<span class="check check-chargebefore right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '3') {//充电信息
                        checkli = '<span class="check check-chargeinfohs right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '4') {//充电中上线信息
                        checkli = '<span class="check check-chargelinehs right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '5') {//录入费用信息
                        checkli = '<span class="check check-addmoneyhs right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '6') {//还车验车单信息
                        checkli = '<span class="check check-after right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    } else if (data.data[i].item_id == '9') {//缴纳停车费信息
                        checkli = '<span class="check check-payment right">查看<input class="id" type="hidden" value="' + data.data[i].id + '" /></span>';
                    }
                    str += '<li><span class="span1">&#xe608;' + data.data[i].time + '</span>' + checkli + '<span class="span2">' + data.data[i].operate + '</span><br/><span class="span3">' + data.data[i].real_name + '</span>' +
                            '<span class="span3">(' + data.data[i].user_name + ')</span><br/>';
                    if (data.data[i].item_id == '7') {
                        str += '<span>';
                        if (data.data[i].remark.name) {
                            if (data.data[i].remark.biz_type == '0') {
                                str += '<img class="net_type" src="' + require('../../image/colorredb.png') + '" />' + data.data[i].remark.name + ' ';
                            } else {
                                str += '<img class="net_type" src="' + require('../../image/color-redB.png') + '" />' + data.data[i].remark.name + ' ';
                            }
                        }
                        str += data.data[i].remark.remark + '</span></li>';
                    } else {
                        str += '<span>' + data.data[i].remark + '</span></li>'
                    }
                }
                $(".recordtails-list").html(str);
                //跳转查看取车验车单信息
                $(".check-before").on("click", function () {
                    window.location.href = "../oilerSingle/checksingle.html?type=1";
                });
                //跳转查看充电还车验车单信息
                $(".check-chargebefore").on("click", function () {
                    if (_this.resultData.photo_flag == '0') {//关闭拍照
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=1&photo_flag=0";
                    } else {
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=1";
                    }
                });
                //跳转查看充电信息页面
                $(".check-chargeinfohs").on("click", function () {
                    window.location.href = "charge.html#/checkchargeinfo";
                });
                //跳转查看充电中上线信息
                $(".check-chargelinehs").on("click", function () {
                    window.location.href = "charge.html#/checkgolineinfo";
                });
                //跳转查看录入费用信息
                $(".check-addmoneyhs").on("click", function () {
                    window.location.href = "charge.html#/checkcostinfo";
                });
                //跳转查看还车验车单信息
                $(".check-after").on("click", function () {
                    if (_this.resultData.photo_flag == '0') {//关闭拍照
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=2&photo_flag=0";
                    } else {
                        window.location.href = "../oilerSingle/checkreturnsingle.html?type=2";
                    }
                });
                //跳转查看缴纳停车费信息
                $(".check-payment").on("click", function () {
                    window.location.href = "charge.html#/checkchargepayment?record_id=" + $(this).find(".id").val();
                });
            } else {
                new Toast(data.msg)
            }
        });

    }
    }
</script>
