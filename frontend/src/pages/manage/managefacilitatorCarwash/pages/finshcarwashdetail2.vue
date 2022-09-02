<template>
    <div id="finshcarwashdetail2">
        <div class="header" v-if="result!=''">
            <span class="span1">{{result.task.plate_no}}</span>
            <span class="span3">{{result.task.model_name}}</span>
            <span class="span4">{{result.task.color}}</span>
            <span class="span0 right">洗车{{result.id}}</span><br/>
            <div class="net-info">
                <span class="net-name">
                    <!-- 0合作 1非合作 2加油站-->
                        <img v-if="result.task.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="result.task.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="result.task.biz_type==2" src="../images/mapoiler.png">
                        {{result.task.branch_address}}
                </span>
                <!--<img src="../images/daohang.png" class="daoh1 daoh"/>-->
            </div>
        </div>
        <div class="status_text" v-else>
            详情加载中，请稍后...
        </div>
        <ul class="recordtails-list">

        </ul>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/finshcarwashdetail2.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import Button from '../component/bottomBtn'
    export default{
        components: {
            Button
        },
        data ()
    {
        return {
            result:'',//获取工单信息
            showsubmit:false,//底部按钮
            text:'返回首页',
        }
    }
    ,
    created()
    {
        $("body").css("background", "#f6f6f6");
        this.getdetail().then(res=>{//初始化详情接口
            this.result = res;
        }).catch(this.handleError)
    }
    ,
    destroyed()
    {
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        $("#finshcarwashdetail2").height(window.screen.height-$(".bottom-btn").height());
        //操作记录
        myAjax.post(getApiUrl('/wash/work-order-record/list'),{
            token:sessionStorage.getItem("access_token"),
            id:sessionStorage.getItem("carwash_orderid") //工单id
        }).then(res=>{
            if(res.status==0){
                let str = '';
                for (var i = 0; i < res.data.length; i++) {
                    let checkli = '';
                    if(res.data[i].status==1){//1洗车中
                        if (res.data[i].current_status == '1') {//取车信息
                            checkli = '<span class="check check-before right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                        } else if (res.data[i].current_status == '2') {//还车信息
                            checkli = '<span class="check check-after right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                        }
                    }else if(res.data[i].status==3){//洗车不合格
                        sessionStorage.setItem("carwashpictures",res.data[i].pictures);//存储洗车不合格图片信息
                        checkli = '<span class="check check-no-fit right">查看&nbsp;&#xe623;<input class="id" type="hidden" value="' + res.data[i].id + '" /></span>';
                    }
                    str += '<li><span class="span1">&#xe608;' + res.data[i].update_time + '</span>' + checkli + '<span class="span2">' + res.data[i].status_name + '</span><br/><span class="span3">' + res.data[i].user_name + '</span>' +
                            '<span class="span3">(' + res.data[i].phone + ')</span><br/><span>' + res.data[i].remark + '</span></li>';
                }
                $(".recordtails-list").html(str);
                //跳转查看取车验车单信息
                $(".check-before").on("click", function () {
                    window.location.href = "index.html#/checkbeforephoto2?beforerecord_id="+$(this).find(".id").val();
                });
                //跳转查看还车验车单信息
                $(".check-after").on("click", function () {
                    window.location.href = "index.html#/checkafterphoto2?afterrecord_id="+$(this).find(".id").val();
                });
                //跳转查看洗车不合格图片信息
                $(".check-no-fit").on("click", function () {
                    window.location.href = "index.html#/checknofitwork";
                });
                //跳转查看缴纳停车费信息
        //        $(".check-payment").on("click", function () {
        //            window.location.href = "charge.html#/checkchargepayment?record_id=" + $(this).find(".id").val();
        //        });
            }else if(err.status==401){//验证过期信息
                    setTimeout(function(){
                        window.location.href="index.html#/logon"
                    },2000)
                    this.$_LIKE_toast("验证信息已失效，请重新登录")
            }else{
                this.$_LIKE_toast(res.msg)
            }
    }).catch(err => {
        console.log(err)
    })
    }
    ,
    methods: {
        //详情展示
        getdetail(){
            let param = {
                token:sessionStorage.getItem("access_token"),
                id:sessionStorage.getItem("carwash_orderid") //工单id
            }
            return myAjax.post(getApiUrl('/wash/work-order/detail'),param).then(res=>{
                        if(res.status !== 0){
                throw res
            }else{
                sessionStorage.setItem("avenResult",res.data);//存储详情车辆信息
                return res.data;
            }
        })
    },
        //返回首页
        submitInfo(){
            this.$router.push({
                path:'/carwashlist2'
            })
        },
    handleError(err){
        if(err && err.msg){
            if(err.status==401){//验证过期信息
                setTimeout(function(){
                    window.location.href="index.html#/logon"
                },2000)
                this.$_LIKE_toast("验证信息已失效，请重新登录")
            }else{
                this.$_LIKE_toast(err.msg)
            }
        }else{
            console.log(err)
        }
    }
    }
    }
</script>