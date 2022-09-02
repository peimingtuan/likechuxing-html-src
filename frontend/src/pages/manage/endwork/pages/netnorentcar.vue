<template>
    <div id="netnorentcar">
        <!-- 头部-->
        <HeaderTab
                :module="headerTabModule"
                @tabSearch="toSearch"
                @tabRefresh="refresh"
                />
        <!-- 列表-->
        <div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="dataReady && list.length === 0">
            列表为空
        </div>
        <!-- 下拉与刷新-->
        <PullDownRefresh
                v-else
                :opt="opt"
                @pullDown="pullDown"
                @pullUp="pullUp"
                ref="pullUpDown"
                >
            <ul class="netlist">
                <li v-for="item in list"  @click="godetail(item.plate_no)">
                    <p>{{item.plate_no}}
                        （<font class='font1' v-if="item.vin">{{item.vin.substring(0, 11)}}</font>
                        <font class='font2' v-if="item.vin">{{item.vin.substring(11, 17)}}</font>）<br/>
                        <span>{{item.status_name}}</span>
                        <span>约续航{{item.remain_km}}公里</span>
                        <span>{{item.brand_name}}</span>
                        <span v-if="item.car_factory">{{item.car_factory}}</span>
                    </p>
                    <!-- 限行情况-->
                    <div v-if="item.limit_record" class="limit-icon">
                        <span class='span1'>今</span>
                        <span class='span1'>明</span>
                        <div v-if="item.plate_no.indexOf('粤A') != '-1' && item.plate_no != ''">
                            <span class="span1 opencar" v-for="limit_record in item.limit_record">开</span>
                        </div>
                        <!-- 0不限行，1限行,2表示不确定-->
                        <div v-else>
                            <span class="span1 opencar" v-for="limit_record in item.limit_record" v-if="limit_record.limit == '0'">开</span>
                            <span class="span1 stopcar" v-for="limit_record in item.limit_record" v-if="limit_record.limit == '1'">停</span>
                            <span class="span1 waitingcar" v-for="limit_record in item.limit_record" v-if="limit_record.limit == '2'">待</span>
                        </div>
                    </div>
                    <!-- 24小时未动和远距离车辆-->
                    <div class='not_time' v-if="item.unmove_time">
                        <span>未动时长：</span>
                        <span class='not_content'>
                            <span class='fcec6e'>
                                {{item.unmove_time[0]}}
                            </span>天
                            <span class='fcec6e'>
                                {{item.unmove_time[1]}}
                            </span>小时
                            <span class='fcec6e'>
                                {{item.unmove_time[2]}}
                            </span>分
                        </span>
                    </div>
                    <div class='long_distance' v-if="item.city_distance">
                        <span>距离城市中心：</span>
                    <span class='long_content'>
                        <span class='fcec6e'>
                            {{item.city_distance}}
                        </span>KM
                    </span>
                    </div>
                    <div v-if="item.during_sec" class="during_sec">
                        状态时长：{{item.during_sec}}
                    </div>
                    <p>
                        <!-- 网点是否限行-->
                        <img v-if="item.area && item.area==1" class="img2" src="../images/traffic.png" />
                        <img v-else-if="item.area && item.area!=1" class="img2" src="../images/notraffic.png" />
                        <img v-if="item.biz_type==0"  src="../images/mapb.png" />
                        <img v-else-if="item.biz_type==1"  src="../images/map-B.png" />
                        <img v-else-if="item.biz_type==2"  src="../images/mapoiler.png" />
                        <a @click.stop="gocarlocation(item.plate_no)">{{item.branch_addr}}</a>
                    </p>
                    <div  v-if="item.during_sec" class='bottom'>
                        <span class='span1'>备注：</span>
                    <span class='span2'>
                        {{item.during_sec}}
                    </span>
                    </div>
                </li>
            </ul>
        </PullDownRefresh>
    </div>
</template>
<script>
    require("../css/netnorentcar.css")
    import $ from 'jquery'
    import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    export default{
        name: "netnorentcar",
        components: {
            HeaderTab,
            PullDownRefresh
        },
        data ()
    {
        return {
            headerTabModule: [
                'search',
                'refresh'
            ],
            dataReady:false,
            list:[],
            opt: {
                height: 300, // 容器高度
                usePullDown: false,// 是否启用下拉
                usePullUp: true // 是否启用上拉
            }
        }
    }
    ,
    created()
    {
        // 计算列表容器高度
        this.opt.height = window.innerHeight - window.REM * 0.4 - 1;
        this.getList()//初始化网点列表详情
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
        //搜索
        toSearch () {
            window.location.href="index.html#/rentlistsearch"
        },
        //刷新
        refresh(){
            this.list = []
            this.dataReady = false
            this.getList()
        },
        //上拉
        pullUp(){
            this.$refs.pullUpDown.update({noMore:true})
        },
        getList(){
            myAjax.post(getApiUrl('/work-order/car-list'),{//网点非租赁列表接口
                mobile:sessionStorage.getItem("mobile"),
                branch_id:this.$route.query.branch_id //网点id
            }).then(res=>{
                if(res.status==0){
                    this.list=res.data;
                    this.dataReady=true;
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //去车辆详情页面
        godetail(plate_no){
            window.location.href="../manageOrderCardetail/index.html?plate_no="+plate_no;
        },
        //去车辆当前位置页面
        gocarlocation(plate_no){
            window.location.href="../manageOrder/oilerSingle/carLocation.html?name="+plate_no;
        },
    }
    }
</script>