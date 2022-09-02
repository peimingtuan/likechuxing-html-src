<template>
    <div id="workdetail">
        <div class="car-detail" v-if="result!=''">
            <div class="car-top">
                <div class="plate_no">
                    <font class="font1">{{result.plate_no}}</font> ({{result.vin.substring(11, 17)}})
                    <span class="status_name">{{result.status_text}}</span>
                </div>
                <!-- 成都限行-->
                <div class="chengdu-limt" v-if="result.chengdu_limit_record && result.chengdu_limit_record==1">今日限行</div>
                <div class="chengdu-limt chengdu-limt2" v-else-if="result.chengdu_limit_record && result.chengdu_limit_record==2">明日限行</div>
                <!-- 广州限行-->
                <div class="gz-limit" v-if="result.limit_record && result.plate_no.indexOf('粤A') != '-1' && result.plate_no != ''">
                    <div class="today-moring" v-for="(item,index) in result.limit_record" v-if="index<2">
                        <div>{{index==0?'今':'明'}}</div>
                        <div class="opencar">
                            开
                        </div>
                    </div>
                    <div class="div-com opencar" v-for="(item,index) in result.limit_record" v-if="index>1">
                        开
                    </div>
                </div>
                <div class="gz-limit" v-if="result.limit_record && result.plate_no && result.plate_no.indexOf('粤A') == '-1'">
                    <div class="today-moring" v-for="(item,index) in result.limit_record" v-if="index<2" :class="item.limit == 0?'':item.limit == 1?'stop-ff8e8e':'wait-D1D1D1'">
                        <div>{{index==0?'今':'明'}}</div>
                        <div :class="item.limit == 0?'opencar':item.limit == 1?'stop-ff8e8e':'waitingcar'">
                            {{item.limit == 0?'开':item.limit==1?'停':'待'}}
                        </div>
                    </div>
                    <div v-for="(item,index) in result.limit_record" v-if="index>1" class="div-com" :class="item.limit==0?'opencar':item.limit==1?'stopcar':'waitingcar'">
                        {{item.limit==0?'开':item.limit==1?'停':'待'}}
                    </div>
                </div>
            </div>
            <div class="car-info">
                <span class="brand_name">{{result.brand_name}}</span>
                <span class="car-color">{{result.color}}</span>
                <span class="carqube">{{result.car_factory}}</span>
                <span class="remain_km">约续航{{result.remain_km}}公里</span>
                <span class="right location" @click="gocarlocation(result.plate_no)">
                    <img src="../images/location2.png"/>
                    当前位置
                </span>
            </div>
            <div class="getnet">
                <div class="get-left">
                    <img v-if="result.biz_type==0" class="mapb" src="../images/mapb.png"/>
                    <img v-else class="mapb" src="../images/map-B.png"/>
                    <span class="branch_addr inline">{{result.branch_name}}</span><br/>
                    <span v-if="result.biz_type==1 && result.parking_fee" class="park_fee">预计停车费<font>{{result.parking_fee}}</font>元</span>
                </div>
                <div class="get-right">
                    <img src="../images/daohang.png" />
                </div>
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

            <p class="p2">
                <!-- 第一步-->
                    <span class="span1 size">
                        <img src="../images/highlinefinsh.png"/>
                        <br/>
                        <font>已创建</font>
                    </span>
                <span class="span2 line"></span>
                <!-- 第二步-->
                    <span class="span3 size">
                        <img src="../images/icon_wait.png"/>
                        <br/>
                        <font>巡检中</font>
                    </span>
                <span class="span4 line"></span>
                <!-- 第三步-->
                    <span class="span5 size">
                        <img src="../images/flow3.png"/>
                        <br/>
                        <font>还车拍照</font>
                    </span>
                <span class="span4 line"></span>
                <!-- 第四步-->
                    <span class="span5 size">
                        <img src="../images/flow4.png"/>
                        <br/>
                        <font>结束工单</font>
                    </span>
            </p>
        </div>
        <!--<div class="flowstatus">-->
        <!--<p class="p1">-->
        <!--<span class="left">工单流程</span>-->
        <!--<span class="right moremany" @click="openmoremany">更多</span>-->
        <!--</p>-->

        <!--<p class="p2" v-if="result.status==1">-->
        <!--&lt;!&ndash; 第一步&ndash;&gt;-->
        <!--<span class="span1 size">-->
        <!--<img v-if="result.current_status == 0" src="../images/flow1.png"/>-->
        <!--<img v-else src="../images/highlinefinsh.png"/>-->
        <!--<br/>-->
        <!--<font>洗车前拍照</font>-->
        <!--</span>-->
        <!--<span class="span2 line"></span>-->
        <!--&lt;!&ndash; 第二步&ndash;&gt;-->
        <!--<span class="span3 size">-->
        <!--<img v-if="Number(result.current_status) > 1" src="../images/highlinefinsh.png"/>-->
        <!--<img v-else src="../images/flow2.png"/>-->
        <!--<br/>-->
        <!--<font>洗车后拍照</font>-->
        <!--</span>-->
        <!--<span class="span4 line"></span>-->
        <!--&lt;!&ndash; 第三步&ndash;&gt;-->
        <!--<span class="span5 size">-->
        <!--<img v-if="Number(result.current_status) > 2" src="../images/highlinefinsh.png"/>-->
        <!--<img v-else src="../images/flow3.png"/>-->
        <!--<br/>-->
        <!--<font>结束工单</font>-->
        <!--</span>-->
        <!--</p>-->
        <!--</div>-->
        <!-- 步骤图，巡检中-->
        <ul class="detail-list" v-if="result!=''">
            <!-- 第一步-->
            <li class="add-item stepcolor"  ref='add-item' v-if="result.photo_flag == 1 && result.next==1" @click="addItem()">1、
                <span class="span_get stepcolor">记录巡检事项</span>
                <span class="span2 stepcolor">&#xe623;</span>
            </li>
            <!-- 不需要拍照-->
            <li class="add-item"  ref='add-item' v-else  @click="addItem()">1、
                <span class="span_get">记录巡检事项</span>
                <span class="span2">&#xe623;</span>
            </li>
            <!-- 第二步-->
            <li class="add-goods"  ref='add-goods' @click="addgoods()">2、
                <span>记录物品补充</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第三步-->
            <li class="deal-trouble stepcolor"  ref='deal-trouble ' @click="dealtrouble(result.car_id)" v-if="result.has_problem==1 && result.photo_flag == 1 && result.next==2">3、
                <span class="stepcolor">处理车辆问题记录</span>
                <span class="stepcolor">&#xe623;</span>
            </li>
            <li class="deal-trouble forbidden"  ref='deal-trouble' v-else-if="result.has_problem==1 && result.photo_flag ==1 && result.next==1">3、
                <span class="forbidden">处理车辆问题记录</span>
                <span class="forbidden">&#xe623;</span>
            </li>
            <li class="deal-trouble"  ref='deal-trouble' v-else-if="result.has_problem==0">3、
                <span class="">处理车辆问题记录(无需处理)</span>
                <span class="">&#xe623;</span>
            </li>
            <!-- 第四步-->
            <li class="add-returnsingle stepcolor" v-if="result.next==4" @click="addreturnsingle(result.photo_flag)">4、
                <span class="stepcolor">添加还车验车单</span>
                <span class="stepcolor">&#xe623;</span>
            </li>
            <li class="add-returnsingle forbidden" v-else-if="result.next<4">4、
                <span class="forbidden">添加还车验车单</span>
                <span class="forbidden">&#xe623;</span>
            </li>
            <li class="add-returnsingle" v-else @click="checkreturnsingle(result.photo_flag)">4、
                <span class="">查看还车验车单</span>
                <span>&#xe623;</span>
            </li>
            <!-- 第五步-->
            <li class="add-endinfo stepcolor" v-if="result.next==5" @click="endInfo()">5、
                <span class="stepcolor">结束工单</span>
                <span class="stepcolor">&#xe623;</span>
            </li>
            <li class="add-endinfo forbidden" v-else>5、
                <span class="forbidden">结束工单</span>
                <span class="forbidden">&#xe623;</span>
            </li>
        </ul>
        <div class="detail-history" v-if="result!=''">
            <p>操作历史</p>
            <div class="status_text" v-if="list.length === 0">
                历史记录为空
            </div>
            <ul class="history-list" v-else>
                <li v-for="item in list">
                    <span class="span1">{{item.time}}</span>
                    <span class="span2">{{item.operate}}</span><br/>
                    <span class="span3">{{item.real_name}}</span>
                    <span class="span3">({{item.user_name}})</span><br/>
                    <!--<span>{{item.remark}}</span>-->
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
        <div class="detail-btn" v-if="result!=''">
            <button class="open-door" @click="opendoor(result.task.plate_no)">开门
            </button>
            <button class="close-door" @click="closedoor(result.task.plate_no)">锁门
            </button>
            <button class="close-door" @click="selectnet()">查询网点
            </button>
        </div>
    </div>
    </div>
</template>
<script>
    require("../css/workdetail.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
    export default{
        components: {
            SlideUpBox
        },
        data ()
    {
        return {
            result:'',
            more_show:false,//更多弹框
            sorts:[
                {"sortCont":"1.出场缴费里",'sortType':'0'},
                {"sortCont":"2.创建故障工单",'sortType':'1'},
                {"sortCont":"3.删除工单",'sortType':'2'}
            ],
            list:[],//操作历史记录
            opendoorbtn:true,//开门
            closedoorbtn:true //关门
        }
    }
    ,
    created()
    {
        //工单详情
        this.getdetail();
        //操作记录接口
        this.getrecord();
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
        //记录巡检事项
        addItem(){
            this.$router.push({
                path:'/returninspection',
                query:{
                    type:1 //区分来源
                }
            })
        },
        //记录物品补充
        addgoods(){
            this.$router.push({
                path:'/addmatter'
            })
        },
        //处理车辆问题记录
        dealtrouble(car_id){
            sessionStorage.setItem('car_id',car_id);
            window.location.href="../manageOrder/carProblemsList/proOrder.html#/carProDetail?type=1&id="+this.$route.query.id;
        },
        //添加还车验车单
        addreturnsingle(photo_flag){
            this.$router.push({
                path:'/returninspection',
                query:{
                    photo_flag:photo_flag
                }
            })
        },
        //查看还车验车单
        checkreturnsingle(photo_flag){
            this.$router.push({
                path:'/checkafterphoto',
                query:{
                    photo_flag:photo_flag,
                    id:this.$route.query.id //工单id
                }
            })
        },
        //结束工单
        endInfo(){
            sessionStorage.setItem("order_id",this.$route.query.id);//存储工单id
            this.$router.push({
                path:'/endOrder',
                query:{
                    branch_id:this.result.branch_id,
                    branch_name:this.result.branch_name,
                    begin_parking_floor:this.result.begin_parking_floor,
                    begin_parking_no:this.result.begin_parking_no
                }
            })
        },
        //获取工单详情
        getdetail(){
            let _this=this;
            myAjax.post(getApiUrl('/vehicle-inspection/order-detail'),{
                mobile:sessionStorage.getItem("mobile"),
                order_id: _this.$route.query.id //工单id
            }).then(data=>{
                if(data.status==0){
                    _this.result=data.data;
                    sessionStorage.setItem("resultData", JSON.stringify(data.data));//用于更改故障工单
                    sessionStorage.setItem("avenResult", JSON.stringify(data.data));//用于出场缴费
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        },
        //操作记录
        getrecord(){
            myAjax.post(getApiUrl('/vehicle-inspection/operate-history'),{
                mobile:sessionStorage.getItem("mobile"),
                order_id: this.$route.query.id //工单id
            }).then(res=>{
                if(res.status==0){
                    this.list=res.data;
//                    for (var i = 0; i < res.data.length; i++) {
//                        if(res.data[i].status==1){//1洗车中
//                            if (res.data[i].current_status == '1') {//取车信息
//                                this.beforerecordid=res.data[i].id;
//                            } else if (res.data[i].current_status == '2') {//还车信息
//                                this.afterrecordid=res.data[i].id;
//                            }
//                        }
//                    }
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
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
            },3000)
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
            },3000)
        },
        //查询网点
        selectnet(){
            window.location.href = '../endwork/index.html#/selectmapnet2'
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
                window.location.href="../manageOrdercarwash/index.html#/gooutpaymoney?type=1&id="+this.$route.query.id;
            }else if(index==1){//go创建故障工单
                window.location.href="../manageOrder/chargeWork/charge.html#/changetrouble?type=1&id="+this.$route.query.id;
            }else if(index==2){//删除工单

            }
        }
    }
    }
</script>