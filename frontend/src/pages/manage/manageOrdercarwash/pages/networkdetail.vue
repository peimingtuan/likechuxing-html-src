<template>
    <div id="networkdetail">
        <!-- 头部-->
        <div class="header" v-if="resultdetail!=''">
            <p class="p1">
                {{resultdetail.name}}
            </p>
            <p class="p2">
                <span class="net-name">
                        <!-- 0合作 1非合作 2加油站-->
                        <img v-if="resultdetail.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="resultdetail.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="resultdetail.biz_type==2" src="../images/mapoiler.png">
                        {{resultdetail.address}}
                    </span>
                <span class="daoh1" @click="daoh1()">
                    <img src="../images/daohang.png">
                </span>
            </p>
        </div>
        <!-- 列表-->
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
                <span class="span1"><font class="font1">{{item.car.plate_no}}</font>（{{item.car.vin.substring(11, 17)}}）</span>
                <span class="span2">{{item.car.car_status}}</span><br/>
                <span class="span3">{{item.car.model_name}}</span>
                <span class="span4">{{item.car.color}}</span>
                <div class="div1" @click="goworkdetail(item.id)">
                    <!-- 状态2洗车完成-->
                    <span class="span5" v-if="item.status==2">{{item.status_name}}</span>
                    <span class="span5 normal" v-else>{{item.status_name}}</span>
                    <span class="right">洗车<font>{{item.id}}</font></span><br/>
                    <span class="work-time"><font>工单时长：</font>{{item.update_time}}</span><br/>
                    <span class="stop-add"><font>停放位置：</font>{{item.car.parking_floor}}-{{item.car.parking_no}}</span>
                </div>
                <div class="div2">备注：{{item.remark}}</div>
                <div class="div3" v-if="item.status==2">
                    <span class="no-fit" @click="gonofit(item.id)">不合格</span>
                    <span class="fit" @click="gofit(item.id)">合格</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    require("../css/networkdetail.css")
   // import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    import $ from 'jquery'
    export default{
        name: "networkdetail",
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
//                height: 300, // 容器高度
//                usePullDown: true,// 是否启用下拉
//                usePullUp: false // 是否启用上拉
//            },
        }
    }
    ,
    created()
    {
        this.getDetail().then(res=>{//初始化网点详情接口
            this.resultdetail = res;
            this.netlng=res.lng;
            this.netlat=res.lat;
        }).catch(this.handleError);
        this.getList().then(res=>{//初始化网点待洗车辆列表接口
            this.list = res;
        }).catch(this.handleError)
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
        var _this=this;
        // 计算列表容器高度
//        var userAgent = navigator.userAgent,
//                isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//        if(isiOS){
//            _this.opt.height =  window.screen.height - 300;
//        }else{
//            _this.opt.height =  window.screen.height - 220;
//        }
    }
    ,
    methods: {
            //网点详情
            getDetail(){
                return myAjax.post(getApiUrl('/wash-task/branch-detail'),{
                            mobile:sessionStorage.getItem("mobile"),
                            id:this.$route.query.branch_id //网点id
                        }).then(res=>{
                            if(res.status !== 0){
                    throw res
                }else{
                    return res.data;
                }
            })
        },
        //网点待检查车辆列表
        getList(){
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                 id:this.$route.query.branch_id //网点id
            }
            return myAjax.post(getApiUrl('/wash-task/list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
        })
        },
        //列表展示
//        pullDown(){
//            this.getList().then(res=>{
//                this.list = res;
//            this.$refs.pullUpDown.update();
//            $(".detail-list .span5").removeClass("normal");
//            $(".detail-list .span5").text("待检查");
//            $(".detail-list .div3").show();
//            }).catch(this.handleError);
//        },
//        pullUp(){
//            this.$refs.pullUpDown.update({noMore:true})
//        },
        //合格
        gofit(id){
            let btn=$(event.target);
            myAjax.post(getApiUrl('/vehicle-wash/set-qualified'),{//创建洗车工单
                mobile:sessionStorage.getItem("mobile"),
                id:id //工单id
            }).then(res=>{
                if(res.status==0){
                    btn.parent().siblings(".div1").find(".span5").addClass("normal");
                    btn.parent().siblings(".div1").find(".span5").text("合格");
                    btn.parent().hide();
            }else{
                this.$_LIKE_toast(res.msg)
            }
            }).catch(err => {
                console.log(err)
            })
        },
        //go去不合格页面
        gonofit(id){
            sessionStorage.setItem("carwash_orderid",id); //存储工单id
            window.location.href="./index.html#/cancelwashwork"
        },
        //go工单详情页面
        goworkdetail(id){
            sessionStorage.setItem("carwash_orderid",id); //存储工单id
            window.location.href="./index.html#/finshcarwashdetail"
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