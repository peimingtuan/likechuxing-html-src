<template>
    <div id="mycarwashlist">
        <!-- 头部-->
        <HeaderTab
            :module="headerTabModule"
            @tabSearch="toSearch"
            @tabFilter="filterShow"
            @tabRefresh="refresh"
            />
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
            <ul class="carwashlistlist">
                <li v-for="item in list"  @click="godetail(item.status,item.id)">
                    <span class="span1" v-if="item.task.vin"><font class="font1">{{item.task.plate_no}}</font>（{{item.task.vin.substring(11, 17)}}）</span>
                    <span class="span2">{{item.task.car_status}}</span><br/>
                    <span class="span3">{{item.task.model_name}}</span>
                    <span class="span4">{{item.task.color}}</span><br/>
                    <span class="net-name">
                         <!-- 0合作 1非合作 2加油站-->
                        <img v-if="item.task.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="item.task.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="item.task.biz_type==2" src="../images/mapoiler.png">
                        {{item.task.branch_address}}
                    </span>
                    <div class="div1">
                        <span class="span5" v-if="item.status==1">{{item.status_name}}</span>
                        <span class="span5 normal2" v-else-if="item.status==3">{{item.status_name}}</span>
                        <span class="span5 normal" v-else>{{item.status_name}}</span>
                        <span class="right">洗车<font>{{item.id}}</font></span><br/>
                        <span class="work-time"><font>处理时长：</font>{{item.date_interval}}</span>
                    </div>
                </li>
            </ul>
        </PullDownRefresh>
        <!-- 筛选弹框-->
        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">
            <!-- 单选-->
            <FilterSingle
                    title="工单状态"
                    :options="options3"
                    :required="true"
                    ref="filter2"
                    :preselect='status2'
                    />
            <div class="box-footer">
                <LikeButton
                        text="重置"
                        type="gray"
                        @click="filterReset"
                        class="btn left"
                        />
                <LikeButton
                        text="确定"
                        type="primary"
                        @click="filterSearch"
                        class="btn right"
                        />
            </div>
        </SlideUpBox>
    </div>
</template>
<script>
    require("../css/mycarwashlist.css")
    import $ from 'jquery'
    import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
    import FilterSingle from '../../../../../other_modules/like-manageOrder/component/FilterSingle'
    import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    const OrderStatus = require('../js/orderStatus')
    export default{
        name: "mycarwashlist",
        components: {
            HeaderTab,
            PullDownRefresh,
            FilterSingle,
            SlideUpBox,
            LikeButton
        },
        data ()
    {
        return {
            //头部
            headerTabModule: [
                'search',
                'filter',
                'refresh'
            ],
            dataReady:false,
            page:0,//初始化页面
            list:[],
            opt: {
                height: 300, // 容器高度
                usePullDown: true,// 是否启用下拉
                usePullUp: true // 是否启用上拉
            },
            //筛选弹框
            filter_show:false,
            status2:0,
            options3:OrderStatus.bizfun.map(item=>{
                item.id = item.status
                return item
            }),
        }
    }
    ,
    created()
    {
        // 计算列表容器高度
        this.opt.height = window.innerHeight - window.REM * 0.4 - 1;
        this.getList().then(res=>{//初始化列表接口
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
    }
    ,
    methods: {
        //刷新
        refresh(){
            this.list = []
            this.dataReady = false
            this.pullDown()
        },
        //搜索
        toSearch () {
            window.location.href="../manageOrderMain/index.html#/list"
        },
        //打开筛选弹框
        filterShow(){
            this.filter_show=true;
        },
        //关闭弹框
        filterClose(){
            this.filter_show=false;
        },
        //列表展示
        getList(){
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                status:this.status2,//工单状态
                page:this.page
            }
            return myAjax.post(getApiUrl('/wash-task/my-list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
        })
    },
        pullDown(){
            this.page = 0
            this.getList().then(res=>{
                this.list = res;
            this.$refs.pullUpDown.update();
            }).catch(this.handleError);
        },
        pullUp(){
            this.page++;
            this.getList().then(res=>{
                this.list = this.list.concat(res)
            if(res.length === 0){
                this.$refs.pullUpDown.update({noMore:true})
            }else{
                this.$refs.pullUpDown.update()
            }
            }).catch(this.handleError)
        },
        //去详情页面
        godetail(status,id){
            sessionStorage.setItem("carwash_orderid",id);//存储工单id
            if(status==1){//洗车中
               window.location.href="./index.html#/carwashdetail"
            }else {//清洗完成
               window.location.href="./index.html#/finshcarwash"
            }
        },
        //重置
        filterReset(){
            this.$refs.filter2.reset();
        },
        //确定
        filterSearch(){
            this.filter_show = false;
            this.status2 = this.$refs.filter2.getResult();
            this.pullDown()
        },
        handleError(err){
            if(err && err.msg){
                this.$_LIKE_toast(err.msg)
            }else{
                console.log(err)
            }
        }
    },
    }
</script>