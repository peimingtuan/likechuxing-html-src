<template>
    <div id="newbuiltcarwash">
        <div class="header" v-if="resultData !=''">
            <span class="span1"><font class="font1">{{resultData.plate_no}}</font>（{{resultData.vin.substring(11, 17)}}）</span>
            <span class="span2">{{resultData.status_name}}</span><br/>
            <span class="span3">{{resultData.brand_name}}</span>
            <span class="span4">约续航{{resultData.remain_km}}公里</span>
            <div class="net-info">
                <span class="net-name">
                    <img v-if="resultData.biz_type==0"  src="../images/mapb.png" />
                    <img v-else-if="resultData.biz_type==1"  src="../images/map-B.png" />
                    <img v-else-if="resultData.biz_type==2"  src="../images/mapoiler.png" />
                    {{resultData.branch_addr}}
                </span>
                <img src="../images/daohang.png" class="daoh1 none"/>
            </div>
        </div>
        <div v-else class="status_text">
            暂无获取到车辆信息,稍后重试
        </div>
        <div class="top">
            <span>更改车辆状态：</span>
            <span class="quick-charge quick"><input type="radio" name="chargestyle" value="1"/>是</span>
            <span class="quick-charge slowly"><input type="radio" name="chargestyle" value="0"/>否</span>
        </div>
        <div class="content">
            请确认是否将车辆更改为洗车状态;<br/>
            不更改状态，洗车工单将由服务商处理;<br/>
            更改为洗车状态，洗车工单需要由您处理。
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/newbuiltcarwash.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import Button from '../component/bottomBtn'
    export default{
        name: "newbuiltcarwash",
        components: {
            Button
        },
        data ()
    {
        return {
            resultData:JSON.parse(sessionStorage.getItem('resultData')) || '',//获取缓存车辆信息
            showsubmit:false,//底部按钮
            text:'提交'
        }
    }
    ,
    beforeCreate()
    {

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
    }
    ,
    methods: {
        //提交信息
        submitInfo(){
            let type = '';//1更改车辆状态，0不更改
            $(".quick-charge input").each(function () {
                if ($(this).is(':checked')) {
                    type = $(this).val();
                    return false;
                }
            });
            if (type == '') {
                this.$_LIKE_toast("请选择是否更改车辆状态");
                return false;
            }
            if(this.$route.query.carwash_orderid){//原有洗车工单
                myAjax.post(getApiUrl('/vehicle-wash/handel'),{//创建洗车工单
                    mobile:sessionStorage.getItem("mobile"),
                    id:this.$route.query.carwash_orderid, //原有洗车工单id
                    car_status:type //是否更改车辆状态
                }).then(res=>{
                    if(res.status==0){
                    if(type=='1'){//1更改车辆状态，0不更改
                        sessionStorage.setItem("carwash_orderid",res.data.id)//存储洗车工单id
                        window.location.href="./index.html#/carwashdetail"
                    }else{
                        window.location.href="../manageOrderCardetail/index.html?plate_no="+this.resultData.plate_no;
                    }
                }else{
                    this.$_LIKE_toast(res.msg)
                }
                }).catch(err => {
                    console.log(err)
                })
            }else{//新洗车工单
                myAjax.post(getApiUrl('/wash-task/create'),{//创建洗车工单
                    mobile:sessionStorage.getItem("mobile"),
                    car_id:sessionStorage.getItem("car_id"), //车辆id
                    car_status:type //是否更改车辆状态
                }).then(res=>{
                    if(res.status==0){
                    if(type=='1'){//1更改车辆状态，0不更改
                        sessionStorage.setItem("carwash_orderid",res.data.id)//存储洗车工单id
                        window.location.href="./index.html#/carwashdetail"
                    }else{
                        window.location.href="../manageOrderCardetail/index.html?plate_no="+this.resultData.plate_no;
                    }
                }else{
                    this.$_LIKE_toast(res.msg)
                }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
    }
    }
</script>