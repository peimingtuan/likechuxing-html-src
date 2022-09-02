<template>
    <div id="networkdetail2">
        <!-- 头部-->
        <div class="header" v-if="resultdetail!='' && !resultdetail.branch">
            <p class="p1">
                {{resultdetail.task.branch_name}}
            </p>
            <p class="p2">
                <span class="net-name">
                       <!-- 0合作 1非合作 2加油站-->
                        <img v-if="resultdetail.task.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="resultdetail.task.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="resultdetail.task.biz_type==2" src="../images/mapoiler.png">
                        {{resultdetail.task.branch_address}}
                    </span>
                <span class="daoh1" @click="daoh1()">
                    <img src="../images/daohang.png">
                </span>
            </p>
        </div>
        <div class="header" v-else-if="resultdetail!='' && resultdetail.branch">
            <p class="p1">
                {{resultdetail.branch.branch_name}}
            </p>
            <p class="p2">
                <span class="net-name">
                       <!-- 0合作 1非合作 2加油站-->
                        <img v-if="resultdetail.branch.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="resultdetail.branch.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="resultdetail.branch.biz_type==2" src="../images/mapoiler.png">
                        {{resultdetail.branch.branch_address}}
                    </span>
                <span class="daoh1" @click="daoh1()">
                    <img src="../images/daohang.png">
                </span>
            </p>
        </div>
        <!-- 已有洗车详情-->
        <div class="carwash-list"  v-if="resultdetail!='' && !resultdetail.branch">
            <span class="span1"><font class="font1">{{resultdetail.task.plate_no}}</font></span>
            <span class="span3">{{resultdetail.task.model_name}}</span>
            <span class="span4">{{resultdetail.task.color}}</span><br/>
            <span class="span2">{{resultdetail.task.parking_floor}}</span>
            {{resultdetail.task.parking_no}}车位
            <span class="check-detail" @click="checkDetail(resultdetail.id)">
                查看详情
            </span>
        </div>
        <!-- 待接单列表-->
        <div class="carwash-num" v-if="list.length !=0">
            待洗车辆<span>{{list.length}}</span>辆
        </div>
        <div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="dataReady && list.length === 0">
            列表为空
        </div>
        <ul class="detail-list" v-else>
            <li v-for="item in list">
                <span class="span1"><font class="font1">{{item.plate_no}}</font></span>
                <span class="span3">{{item.model_name}}</span>
                <span class="span4">{{item.color}}</span><br/>
                <span class="span2">{{item.parking_floor}}</span>
                {{item.parking_no}}车位
                <div class="div3">
                    <span class="no-fit" @click="gonofit(item.id,item.plate_no)">车辆不在网点</span>
                    <span class="fit" @click="godetail(item.id)">接单</span>
                </div>
            </li>
        </ul>
        <!--车辆不在网点弹框-->
        <div class="editremark_window none">
            <div class="editremark">
                <div class="center">
                    请仔细查找车辆，如未找到车，请点击确认！<br/>
                    车牌号：{{plate}}
                </div>
                <div class="bottom">
                    <span class="sure" @click="sure()">确认</span>
                    <span class="cancel" @click="cancel()">取消</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/networkdetail2.css")
//    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    export default{
        name: "networkdetail2",
        components: {
//            PullDownRefresh,
        },
        data ()
    {
        return {
            resultdetail:'',//网点详情
            netlng:'',
            netlat:'',//当前网点经纬度
            dataReady:false,
            list:[],
//            opt: {
//                height: 1000, // 容器高度
//                usePullDown: true,// 是否启用下拉
//                usePullUp: true // 是否启用上拉
//            },
            plate:'',//车辆未在网点的车牌号
            no_orderid:'',//车辆未在网点的网点工单id
        }
    }
    ,
    created()
    {
        //this.opt.height =  window.screen.height - window.REM * 0.82 - 1;
        this.getDetail().then(res=>{//初始化网点详情接口
            this.resultdetail = res;
            if(res.branch){
                this.netlng=res.branch.lng;
                this.netlat=res.branch.lat;
            }else{
                this.netlng=res.task.lng;
                this.netlat=res.task.lat;
            }
        }).catch(this.handleError);
        this.getList().then(res=>{//初始化网点待洗车辆列表接口
            this.list = res;
        }).catch(this.handleError)
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
//        this.opt.height =1000;
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        var _this=this;
        // 计算列表容器高度
//        var userAgent = navigator.userAgent,
//                isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//        if(isiOS){
//            _this.opt.height =  window.screen.height - 320;
//        }else{
//            _this.opt.height =  window.screen.height - 220;
//        }
    }
    ,
    methods: {
        //网点详情
        getDetail(){
            return myAjax.post(getApiUrl('/wash/work-order/current-order'),{
                        token:sessionStorage.getItem("access_token"),
                        branch_id:this.$route.query.branch_id //网点id
                    }).then(res=>{
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
            })
        },
        //网点待洗车辆列表
        getList(){
            let param = {
                token:sessionStorage.getItem("access_token"),
                branch_id:this.$route.query.branch_id //网点id
            }
            return myAjax.post(getApiUrl('/wash/task/list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
        })
    },
//        pullDown(){
//            this.getList().then(res=>{
//                this.list = res;
//                this.$refs.pullUpDown.update();
//            }).catch(this.handleError);
//        },
//        pullUp(){
//            this.$refs.pullUpDown.update({noMore:true})
//        },
        //车辆未在网点
        gonofit(id,plate){
            this.plate=plate;
            this.no_orderid=id;
            $(".editremark_window").removeClass("none");
        },
        //取消车辆未在网点弹框
            cancel(){
                $(".editremark_window").addClass("none");
            },
        //确认车辆未在网点弹框
        sure(){
        myAjax.post(getApiUrl('/wash/task/not-found'),{
            token:sessionStorage.getItem("access_token"),
            id:this.no_orderid //网点工单id
        }).then(res=>{
            if(res.status == 0){
                this.$_LIKE_toast("上报成功")
                setTimeout(function(){
                    window.location.reload();
                },1000)
            }else
            {
                this.$_LIKE_toast(res.msg)
            }
            }).catch(err => {
                console.log(err)
            })
            $(".editremark_window").addClass("none");
        },
        //接单去工单详情页面
        godetail(id){
        myAjax.post(getApiUrl('/wash/task/found'),{
            token:sessionStorage.getItem("access_token"),
            id:id //网点工单id
        }).then(res=>{
            if(res.status == 0){
                sessionStorage.setItem("carwash_orderid",res.data.id);//存储洗车工单id
                this.$router.push({
                    path:'/carwashdetail2',
                })
            }else if(res.status == 302){
                this.$_LIKE_toast("该车辆当前为租赁中，无法洗车")
                setTimeout(function(){
                    window.location.reload();
                },2000)
            }else{
                this.$_LIKE_toast(res.msg)
            }
        }).catch(err => {
        console.log(err)
        })
        },
        //网点已有洗车工单，查看详情
        checkDetail(id){
        sessionStorage.setItem("carwash_orderid",id);//存储洗车工单id
        this.$router.push({
            path:'/carwashdetail2'

            })
        },
        handleError(err){//返回错误信息
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
        //网点导航
        daoh1(){
        let _this=this;
        //导航
        var driving;
        AMap.plugin(["AMap.Driving"], function () {
            var drivingOption = {
                policy: AMap.DrivingPolicy.LEAST_TIME,
                map: ''
            };
            driving = new AMap.Driving(drivingOption); //构造驾车导航类
            //高德获取定位
            var geolocation;
            AMap.plugin('AMap.Geolocation', function () {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonPosition: 'RB'
                });
                geolocation.getCurrentPosition(function (status, data) {
                    if (status === 'complete') {
                        driving.search(
                                [data.position.lng, data.position.lat], [_this.netlng,_this.netlat],
                                function (status, result) {
                                    driving.searchOnAMAP({
                                        origin: result.origin,
                                        destination: result.destination
                                    });
                                });
                    } else {
                        _this.$_LIKE_toast("获取当前定位失败")
                    }
                });
            });
        });
        }
    }
    }
</script>