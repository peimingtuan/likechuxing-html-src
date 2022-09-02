<template>
    <div id="endwork">
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
        <!-- 备注信息-->
        <div class="remark-div">
            <p>备注</p>
            <remark :showblock="showblock"  :text_value="placeholder2"/>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/endwork.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import Button from '../component/bottomBtn'
    import remark from '../component/remark'
    import $ from 'jquery'
    export default{
        name: "endwork",
        components: {
            remark,
            Button
        },
        data ()
    {
        return {
            result: JSON.parse(sessionStorage.getItem("avenResult")) || '',//获取缓存信息
            showblock:false,//备注信息必填项
            placeholder2:'如发现车辆存在故障，请填写备注信息，200字以内(选填)',//备注信息
            showsubmit:false,//底部按钮
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
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        $("body").css("background", "#f6f6f6");
        $("#endwork").height(window.screen.height-$(".bottom-btn").height()-100);
    }
    ,
    methods: {
        //提交信息
        submitInfo(){
            myAjax.post(getApiUrl('/wash/work-order/finish'),{//结束工单
                token:sessionStorage.getItem("access_token"),
                id:sessionStorage.getItem("carwash_orderid"), //工单id
                remark:$(".void_writeinfo").val()//备注信息非必填
            }).then(res=>{
                if(res.status==0){
                    this.$router.push({
                        path:'/finshcarwashdetail2',
                        query:{

                        }
                    })
                }else if(res.status==401){//验证过期信息
                    this.$_LIKE_toast("验证信息已失效，请重新登录")
                    setTimeout(function(){
                        window.location.href="index.html#/logon"
                    },2000)
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    }
</script>