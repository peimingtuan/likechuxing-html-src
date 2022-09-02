<template>
    <div id="mycarwashlist2">
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
                    <span class="span1"><font class="font1">{{item.task.plate_no}}</font></span><br/>
                    <!--<span class="span2">{{item.task.model_name}}</span><br/>-->
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
                        <span class="work-time"><font>接单时间：</font>{{item.create_time}}</span>
                    </div>
                </li>
            </ul>
        </PullDownRefresh>
        <!-- 筛选弹框-->
        <!--<SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">-->
            <!--&lt;!&ndash; 多选&ndash;&gt;-->
            <!--<FilterMultiple-->
                    <!--title="工单状态"-->
                    <!--:options="options"-->
                    <!--:preselect="status"-->
                    <!--ref="filter"-->
                    <!--/>-->
            <!--&lt;!&ndash; 单选&ndash;&gt;-->
            <!--<FilterSingle-->
                    <!--title="检查情况"-->
                    <!--:options="options3"-->
                    <!--:required="true"-->
                    <!--ref="filter2"-->
                    <!--:preselect='status2'-->
                    <!--/>-->
            <!--<div class="box-footer">-->
                <!--<LikeButton-->
                        <!--text="重置"-->
                        <!--type="gray"-->
                        <!--@click="filterReset"-->
                        <!--class="btn left"-->
                        <!--/>-->
                <!--<LikeButton-->
                        <!--text="确定"-->
                        <!--type="primary"-->
                        <!--@click="filterSearch"-->
                        <!--class="btn right"-->
                        <!--/>-->
            <!--</div>-->
        <!--</SlideUpBox>-->
        <!--confirm筛选提示框-->
        <div class="carstock_window common_cover">
            <div class="carstock_content">
                <div class="carstock-title">
                    筛选
                    <span class="close-carstock">&#xe601;</span>
                </div>
                <div class="confirm-carstock">
                    <p>工单状态</p>

                    <p class="confirm-carstate">
                        <span class="allcarstate color">全部<input type="hidden" value="0"/></span>
                        <span class="state">洗车中<input type="hidden" value="1"/></span>
                        <span class="state">待检查<input type="hidden" value="2"/></span>
                        <span class="state finsh">已完成<input type="hidden" value="3"/></span>
                        <span class="state">已取消<input type="hidden" value="4"/></span>
                    </p>

                    <p class="hide">检查情况</p>

                    <p class="confirm-carnetstate hide">
                        <span class="allnettype color">全部<input type="hidden" value="0"/></span>
                        <span class="nettype">合格<input type="hidden" value="1"/></span>
                        <span class="nettype">不合格<input type="hidden" value="2"/></span>
                    </p>
                </div>
                <div class="carstate-bottom">
                    <button class="carstate-reset">重置</button>
                    <button class="carstate-sure">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/mycarwashlist2.css")
    import $ from 'jquery'
    import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
//    import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
    import FilterSingle from '../../../../../other_modules/like-manageOrder/component/FilterSingle'
    import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
    import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    const OrderStatus = require('../js/orderStatus')
    export default{
        name: "mycarwashlist2",
        components: {
            HeaderTab,
            PullDownRefresh,
            FilterSingle,
            FilterMultiple,
           // SlideUpBox,
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
            list:[],
            page:0,//初始化页面
            opt: {
                height: 1000, // 容器高度
                usePullDown: true,// 是否启用下拉
                usePullUp: true // 是否启用上拉
            },
            //筛选弹框
            //filter_show:false,
            status:[],//多选
//            options:OrderStatus.disfun.map(item=>{
//                item.id = item.status
//            return item
//        }),
            status2:0,//单选
//            options3:OrderStatus.bizfun.map(item=>{
//                item.id = item.status
//            return item
//        }),
            colorArray:[]//记录打开弹框前已筛选的值
        }
    }
    ,
    created()
    {
        this.getList().then(res=>{//初始化列表接口
            this.list = res;
        }).catch(this.handleError)
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
        this.opt.height =1000;
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        var _this=this;
        // 计算列表容器高度
        _this.opt.height =  window.innerHeight - window.REM * 0.4 - 1;
        //点击选项变换颜色
        $(".state").on("click", function () {
            if ($(".confirm-carstate .color").length > 0) {
                if ($(this).hasClass("color") && $(".confirm-carstate .color").length > 1) {
                    $(this).removeClass("color");
                } else {
                    $(this).addClass("color");
                }
            } else {
                $(this).addClass("color");
            }
            if($(".finsh").hasClass("color")){
                $(".hide").show();
            }else{
                $(".hide").hide();
                $(".nettype").removeClass("color");
                $(".allnettype").addClass("color");
            }
            $(".allcarstate").removeClass("color");
        });
        $(".nettype").on("click", function () {
            if ($(".confirm-carnetstate .color").length > 0) {
                if (!$(this).hasClass("color")) {
                    $(".nettype").removeClass("color");
                    $(this).addClass("color");
                }
            } else {
                $(this).addClass("color");
            }
            $(".allnettype").removeClass("color");
        });
        //点击重置按钮
        $(".carstate-reset").on("click", function () {
            $(".nettype").removeClass("color");
            $(".allnettype").addClass("color");
            $(".state").removeClass("color");
            $(".allcarstate").addClass("color");
            $(".hide").show();
        });
        //点击全部
        $(".allcarstate").on("click", function () {
            $(".state").removeClass("color");
            $(this).addClass("color");
            $(".hide").show();
        });
        $(".allnettype").on("click", function () {
            $(".nettype").removeClass("color");
            $(this).addClass("color");
        });

        //关闭筛选弹框
        $(".close-carstock").on("click", function () {
            $(".confirm-carstock span").removeClass("color");
            for (var i = 0; i < _this.colorArray.length; i++) {
                _this.colorArray[i].addClass("color");
            }
            $(".carstock_window").fadeOut(800);
            $(".carstock_content").animate({bottom:'-100%'},800);
        });
        //点击确定按钮关闭弹框
        $(".carstate-sure").on("click", function () {
            _this.status=[];
            $(".confirm-carstate .color").each(function () {//工单状态
                if ($(this).find("input").val() == 0) {
                    return false;
                } else {
                    _this.status.push($(this).find("input").val());
                }
            });

            _this.status2=$(".confirm-carnetstate .color").find("input").val();//检查情况
            $(".carstock_window").fadeOut(800);
            $(".carstock_content").animate({bottom:'-100%'},800);
            _this.pullDown()
        })
    }
    ,
    methods: {
        //列表展示
        getList(){
            let param = {
                token:sessionStorage.getItem("access_token"),
                status:this.status.join(','),//工单状态
                check_status:this.status2,//检查状态
                page:this.page
            }
            return myAjax.post(getApiUrl('/wash/work-order/list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
        })
    },
        //刷新
        refresh(){
            this.list = []
            this.dataReady = false
            this.pullDown()
        },
        //搜索
        toSearch () {
            window.location.href="index.html#/carwashlist2"
        },
        //打开筛选弹框
        filterShow(){
            //this.filter_show=true;
        let _this=this;
        _this.colorArray = [];
            $(".confirm-carstock span").each(function () {
                if ($(this).hasClass("color")) {
                    _this.colorArray.push($(this));
                    if($(this).hasClass("finsh")|| $(this).hasClass("allcarstate")){
                        $(".hide").show();
                    }
                }
            });
            $(".carstock_window").fadeIn(300);
            $(".carstock_content").animate({bottom:0},800);
        },
        //关闭弹框
//        filterClose(){
//            this.filter_show=false;
//        },
        //列表展示
        pullDown(){
            this.page = 0
            this.getList().then(res=>{
                this.list = res;
                this.$refs.pullUpDown.update();
            }).catch(this.handleError);
        },
        pullUp(){
            this.page++
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
                window.location.href="./index.html#/carwashdetail2"
            }else {//清洗完成
                window.location.href="./index.html#/finshcarwashdetail2"
            }
        },
        //重置
//        filterReset(){
//            this.$refs.filter.reset();
//            this.$refs.filter2.reset();
//        },
        //确定
//        filterSearch(){
//            this.filter_show = false;
//            this.status = this.$refs.filter.getResult();
//            this.status2 = this.$refs.filter2.getResult();
//            this.pullDown()
//        },
    handleError(err){
        if(err && err.msg){
            if(err.status==401){//验证过期信息
                this.$_LIKE_toast("验证信息已失效，请重新登录")
                setTimeout(function(){
                    window.location.href="index.html#/logon"
                },2000)
            }else{
                this.$_LIKE_toast(err.msg)
            }
        }else{
            console.log(err)
        }
    }
    },
    }
</script>