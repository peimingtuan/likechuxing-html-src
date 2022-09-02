<template>
    <div id="carwashdetail">
            <div class="header" v-if="result!=''">
                <span class="span1"><font class="font1">{{result.task.plate_no}}</font>（{{result.task.vin.substring(11, 17)}}）</span>
                <span class="span2">{{result.task.car_status}}</span>
                <span class="right">洗车{{result.id}}</span><br/>
                <span class="span3">{{result.task.model_name}}</span>
                <span class="span4">{{result.task.color}}</span>
                <span class="span5">约续航{{result.task.remain}}公里</span>
                <div class="net-info">
                     <span class="net-name">
                        <!-- 0合作 1非合作 2加油站-->
                         <img v-if="result.task.biz_type==0" src="../images/mapb.png">
                         <img v-else-if="result.task.biz_type==1" src="../images/map-B.png">
                         <img v-else-if="result.task.biz_type==2" src="../images/mapoiler.png">
                         {{result.task.branch_address}}
                     </span>
                    <img src="../images/daohang.png" class="daoh1" @click="daoh1()"/>
                </div>
        </div>
        <div class="status_text" v-else>
            详情加载中，请稍后...
        </div>
        <div class="flowstatus" v-if="result!=''">
            <p class="p1">
                <span class="left">工单流程</span>
                <span class="right moremany" @click="openmoremany">更多</span>
            </p>

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
        <!-- 更多弹框-->
        <SlideUpBox v-if="more_show" title="更多" ref="slideUpBox" @close="morseClose">
            <ul class="sort_content">
                <li :id="'sort'+sortItem.sortType"
                    v-for="sortItem in sorts"
                    @click="sortCheck(sortItem.sortType,$event)">
                    <span>{{sortItem.sortCont}}</span>
                </li>
            </ul>
        </SlideUpBox>
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
    require("../css/carwashdetail.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    import $ from 'jquery'
    export default{
        name: "carwashdetail",
        components: {
            SlideUpBox
        },
        data ()
    {
        return {
            result:'',//洗车工单详情
            netlng:'',
            netlat:'',//当前网点经纬度
            //更多弹框
            more_show:false,
            sorts:[
                {"sortCont":"1.出场缴费,点这里",'sortType':'0'},
                {"sortCont":"2.录入洗车费用",'sortType':'1'}
            ],
            list:[],//操作历史记录
            opendoorbtn:true,//开门
            closedoorbtn:true //关门
        }
    }
    ,
    created()
    {
        this.getdetail().then(res =>{//初始化详情接口
            this.result = res;
            this.netlng = res.task.lng;
            this.netlat = res.task.lat;
            sessionStorage.setItem("avenResult", JSON.stringify(res));//存储工单详情
        }).catch(this.handleError);
        //操作记录接口
        this.getrecord();
    },
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
                mobile:sessionStorage.getItem("mobile"),
                id:sessionStorage.getItem("carwash_orderid") //工单id
            }
                return myAjax.post(getApiUrl('/vehicle-wash/detail'),param).then(res=>{
                            if(res.status !== 0){
                    throw res
                }else{
                    sessionStorage.setItem("avenResult",res.data);//存储详情车辆信息
                    return res.data;
                }
            })
        },
        //洗车前拍照
        addSingle(){
            window.location.href="index.html#/carwashbeforephoto";
        },
        //洗车后拍照
        addReturn(){
            window.location.href="index.html#/carwashafterphoto";
        },
        //查看洗车前拍照
        checkSingle(){
            if(this.beforerecordid==''){
                this.$_LIKE_toast("请先获取操作记录id")
            }else{
                window.location.href = "index.html#/checkbeforephoto?beforerecord_id="+this.beforerecordid;
            }
        },
        //查看洗车后拍照
        checkReturn(){
            if(this.afterrecordid==''){
                this.$_LIKE_toast("请先获取操作记录id")
            }else{
                window.location.href = "index.html#/checkafterphoto?afterrecord_id="+this.afterrecordid;
            }
        },
        //结束工单
        endInfo(){
            window.location.href="index.html#/endOrder";
        },
        //操作记录
        getrecord(){
            myAjax.post(getApiUrl('/vehicle-wash/record'),{
                mobile:sessionStorage.getItem("mobile"),
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
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
    //网点导航
    daoh1(){
        //导航
        var driving,
                _this=this;
        AMap.plugin(["AMap.Driving"], function () {
            var drivingOption = {
                policy: AMap.DrivingPolicy.LEAST_TIME,
                map: ''
            };
            driving = new AMap.Driving(drivingOption); //构造驾车导航类
        });
        //钉钉获取定位
        dd.getLocation().then(res => {
            driving.search(
                [res.longitude, res.latitude], [_this.netlng, _this.netlat],
                function (status, result) {
                    driving.searchOnAMAP({
                        origin: result.origin,
                        destination: result.destination
                    });
                });
    }).catch(err => {
        _this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
    });
    },
        //开门
        opendoor(plate_no){
            if(this.opendoorbtn){
                this.opendoorbtn=false;
                myAjax.post(getApiUrl('/car/open-door'),{
                    mobile:sessionStorage.getItem("mobile"),
                    car_info:plate_no
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
        closedoor(plate_no){
            if(this.closedoorbtn){
                this.closedoorbtn=false;
                myAjax.post(getApiUrl('/car/close-door'),{
                    mobile:sessionStorage.getItem("mobile"),
                    car_info:plate_no
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
        //打开更多弹框
        openmoremany(){
            this.more_show=true;
        },
        //关闭更多弹框
        morseClose(){
            this.more_show=false;
        },
        //更多弹框内容的点击事件
        sortCheck(index,event){
            this.more_show=false;
            if(index==0){//go出场缴费
                this.$router.push({
                    path:'/gooutpaymoney',
                    query:{

                    }
                })
            }else if(index==1){//go录入费用信息
                this.$router.push({
                    path:'/addcarwashcost',
                    query:{

                    }
                })
            }
        },
        //处理错误信息
        handleError(err){
            if(err && err.msg){
                this.$_LIKE_toast(err.msg)
            }else{
                console.log(err)
            }
        }
    }
    }
</script>