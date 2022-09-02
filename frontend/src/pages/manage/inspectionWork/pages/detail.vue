<template>
    <div id="detail">
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
                <div class="get-right" @click="gonavi(result.lng,result.lat)">
                    <img src="../images/daohang.png" />
                </div>
            </div>
        </div>
        <div class="status_text" v-else>
            详情加载中，请稍后...
        </div>
        <!--中间空格-->
        <div class="div-center"></div>
        <div class="flowstatus" v-if="result!=''">
            <p class="p1">
                <span class="left">工单流程</span>
                <span class="right delete" @click="deletework()">删除</span>
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
                        <img src="../images/flow2.png"/>
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
        <!--是否已到网点-->
        <div class="task" v-if="result!=''">
            <div class="task-top" @click="getnet()">
                <span>已到网点</span>
            </div>
            <div class="task-bottom">
                到达当前车辆所在网点后<br/>
                点击“已到网点”进行后续操作
            </div>
        </div>

    </div>
</template>
<script>
    require("../css/detail.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    import { MessageBox } from 'mint-ui'
    export default{
        data ()
    {
        return {
            result:''
        }
    }
    ,
    created()
    {
        this.getdetail();
    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {

    }
    ,
    methods: {
        //删除工单
        deletework(){
            let _this=this;
            MessageBox.confirm('', {
                message: '删除后车辆将调为"空闲"状态'
            }).then(action => {
                if (action == 'confirm') { //确认的回调
                    myAjax.post(getApiUrl('/vehicle-inspection/del'),{
                        mobile:sessionStorage.getItem("mobile"),
                        order_id: _this.$route.query.id //工单id
                    }).then(data=>{
                        if(data.status==0){
                            _this.$_LIKE_toast("删除成功")
                            setTimeout(function(){
                                _this.$router.push({
                                    path:'/list',
                                    query:{

                                    }
                                })
                            },2000)
                        }else{
                            _this.$_LIKE_toast(data.msg)
                        }
                    }).catch(data => {
                        console.log(data)
                    })
                }
            }).catch(err =>{
                if (err == 'cancel') {     //取消的回调
                    console.log(12);
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
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        },
        //网点导航
        gonavi(lng,lat){
            var driving,
                    _this=this;
            if(!lng){
                _this.$_LIKE_toast('没有获取到该网点的经纬度')
                return false;
            }
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
                        [res.longitude, res.latitude], [lng,lat],
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
        //查看车辆当前位置
        gocarlocation(plate_no){
            window.location.href="../manageOrder/oilerSingle/carLocation.html?name="+plate_no;
        },
        //到达网点
        getnet(){
            let _this=this;
            //钉钉获取定位
//            dd.getLocation().then(res => {
            $.post(getApiUrl('/vehicle-inspection/operate'),{
                    mobile:sessionStorage.getItem("mobile"),
                    order_id: _this.$route.query.id, //工单id
                    item_id:2,
                    params:{
                        lng:'116.300038'|| res.longitude,
                        lat:'40.044887'|| res.latitude
                    }
                },function (data) {
                    if(data.status=='0'){
                        _this.$router.push({
                            path:'/workdetail',
                            query:{
                                id:_this.$route.query.id //工单id
                            }
                        })
                    }else if(data.status=='11000'){
                        MessageBox('', '请在车辆所在的网点范围内点击!');
                    }else{
                        _this.$_LIKE_toast(data.msg)
                    }
                })
//            }).catch(err => {
//                _this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
//            });
        },
    }
    }
</script>