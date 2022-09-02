<template>
    <div id="carwashdetail2">
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
        <div class="flowstatus" v-if="result!=''">
            <p class="p1">
                <span class="left">洗车工单</span>
                <span class="right cancel-work" @click="cancelWork()">取消工单</span>
            </p>
            <!-- 洗车中-->
            <p class="p2" v-if="result.status==1">
                <!-- 第一步-->
                <span class="span1 size">
                    <img v-if="result.current_status == 0" src="../images/flow1.png"/>
                    <img v-else src="../images/highlinefinsh.png"/>
                    <br/>
                    <font>洗车前拍照</font>
                </span>
                <span class="span2 line"></span>
                <!-- 第二步-->
                <span class="span3 size">
                    <img v-if="Number(result.current_status) > 1" src="../images/highlinefinsh.png"/>
                    <img v-else src="../images/flow2.png"/>
                    <br/>
                    <font>洗车后拍照</font>
                </span>
                <span class="span4 line"></span>
                <!-- 第三步-->
                <span class="span5 size">
                    <img v-if="Number(result.current_status) > 2" src="../images/highlinefinsh.png"/>
                    <img v-else src="../images/flow3.png"/>
                    <br/>
                    <font>结束工单</font>
                </span>
            </p>
        </div>
        <!-- 步骤图，洗车中-->
        <ul class="carwashdetail-list" v-if="result!='' && result.status==1">
           <!-- 第一步-->
            <li class="add-single stepcolor"  ref='add_single' v-if="result.current_status==0" @click="addSingle()">1、
                <span class="span_get stepcolor">洗车前拍照</span>
                <span class="span2 stepcolor">&#xe623;</span>
            </li>
            <li class="add-single"  ref='add_single' v-else  @click="checkSingle()">1、
                <span class="span_get">查看洗车前拍照</span>
                <span class="span2">&#xe623;</span>
            </li>
            <!-- 第二步-->
            <li class="add-return forbidden"  ref='add_return' v-if="result.current_status==0">2、
                <span class="span_add2 forbidden">洗车后拍照</span>
                <span class="forbidden">&#xe623;</span>
            </li>
            <li class="add-return stepcolor"  ref='add_return' v-else-if="result.current_status==1" @click="addReturn()">2、
                <span class="span_add2 stepcolor">洗车后拍照</span>
                <span class="stepcolor">&#xe623;</span>
            </li>
            <li class="add-return"  ref='add_return' v-else-if="result.current_status==2" @click="checkReturn()">2、
                <span>查看洗车后拍照</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第三步-->
            <li class="add-info forbidden" v-if="result.current_status !=2">3、
                <span class="span_add3 forbidden">结束工单</span>
                <span class="forbidden">&#xe623;</span>
            </li>
            <li class="add-info stepcolor" v-else-if="result.current_status ==2" @click="endInfo()">3、
                <span class="span_add3 stepcolor">结束工单</span>
                <span class="stepcolor">&#xe623;</span>
            </li>
        </ul>
        <div class="carwashdetail-history" v-if="result!=''">
            <p>操作历史</p>
            <div class="status_text" v-if="list.length === 0">
                历史记录为空
            </div>
            <ul class="history-list" v-else>
                <li v-for="item in list">
                    <span class="span1">{{item.update_time}}</span>
                    <span class="span2">{{item.status_name}}</span><br/>
                    <span class="span3">{{item.user_name}}</span>
                    <span class="span3">({{item.phone}})</span><br/>
                    <span>{{item.remark}}</span>
                </li>
            </ul>
        </div>
        <!-- 底部按钮-->
        <div class="carwashdetail-btn" v-if="result!=''">
            <button class="open-door" @click="opendoor(result.task.plate_no)">开门
            </button>
            <button class="close-door" @click="closedoor(result.task.plate_no)">锁门
            </button>
        </div>
    </div>
</template>
<script>
    require("../css/carwashdetail2.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        name: "carwashdetail2",
        data ()
    {
        return {
            result:'',
            beforerecordid:'',//洗车前拍照记录id
            afterrecordid:'',//洗车后拍照记录id
            list:[],//操作历史记录
            opendoorbtn:true,//开门
            closedoorbtn:true //关门
        }
    }
    ,
    created()
    {
        this.getdetail().then(res=>{//初始化详情接口
            this.result = res;
            sessionStorage.setItem("avenResult",JSON.stringify(res));//存储工单详情
        }).catch(this.handleError);
        //操作记录接口
        this.getrecord();
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
        //取消工单
        cancelWork(){
            window.location.href="index.html#/cancelwashwork2";
        },
        //洗车前拍照
        addSingle(){
            window.location.href="index.html#/carwashbeforephoto2";
        },
        //洗车后拍照
        addReturn(){
            window.location.href="index.html#/carwashafterphoto2";
        },
        //查看洗车前拍照
        checkSingle(){
            if(this.beforerecordid==''){
                this.$_LIKE_toast("请先获取操作记录id")
            }else{
                window.location.href = "index.html#/checkbeforephoto2?beforerecord_id="+this.beforerecordid;
            }
        },
        //查看洗车后拍照
        checkReturn(){
            if(this.afterrecordid==''){
                this.$_LIKE_toast("请先获取操作记录id")
            }else{
                window.location.href = "index.html#/checkafterphoto2?afterrecord_id="+this.afterrecordid;
            }
        },
        //结束工单
        endInfo(){
            window.location.href="index.html#/endwork";
        },
        //开门
        opendoor(){
            if(this.opendoorbtn) {
                this.opendoorbtn = false;
                myAjax.post(getApiUrl('/wash/car/open-door'),{
                    token:sessionStorage.getItem("access_token"),
                    id:sessionStorage.getItem("carwash_orderid") //工单id
                }).then(res=>{
                    this.$_LIKE_toast(res.msg)
                }).catch(err => {
                    console.log(err)
                })
            }else{
                this.$_LIKE_toast('开门过于频繁，请稍后重试')
            }
            setTimeout(function(){
                this.opendoorbtn=true;
            },5000)
        },
        //关门
        closedoor(){
            if(this.closedoorbtn) {
                this.closedoorbtn = false;
                myAjax.post(getApiUrl('/wash/car/close-door'),{
                    token:sessionStorage.getItem("access_token"),
                    id:sessionStorage.getItem("carwash_orderid") //工单id
                }).then(res=>{
                    this.$_LIKE_toast(res.msg)
                }).catch(err => {
                console.log(err)
                })
            }else{
                this.$_LIKE_toast('关门过于频繁，请稍后重试')
            }
                setTimeout(function(){
                    this.closedoorbtn=true;
                },5000)
        },
        //操作记录
        getrecord(){
            myAjax.post(getApiUrl('/wash/work-order-record/list'),{
                token:sessionStorage.getItem("access_token"),
                id:sessionStorage.getItem("carwash_orderid") //工单id
            }).then(res=>{
                if(res.status==0){
                    this.list=res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        if(res.data[i].status==1){//1洗车中
                            if (res.data[i].current_status == '1') {//取车信息
                                this.beforerecordid=res.data[i].id;
                            } else if (res.data[i].current_status == '2') {//还车信息
                                this.afterrecordid=res.data[i].id;
                            }
                        }
                    }
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
        },
    }
    }
</script>