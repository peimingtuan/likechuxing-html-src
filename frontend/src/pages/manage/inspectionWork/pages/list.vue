<template>
    <div id="worklist">
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
            <div class="list" v-for="item in list"  @click="godetail(item.status,item.id)">
                    <span class="span1"><font class="font1">{{item.plate_no}}</font>（{{item.vin.substring(11, 17)}}）</span>
                    <span class="span2">{{item.car_status_text}}</span><br/>
                    <span class="span3">{{item.brand_name}} {{item.model_name}}</span>
                    <span class="span4">{{item.color}}</span>
                    <span class="carqube">{{item.car_factory}}</span><br/>
                    <span class="net-name">
                         <!-- 0合作 1非合作-->
                        <img v-if="item.biz_type==0"  src="../images/mapb.png">
                        <img v-else  src="../images/map-B.png">
                        {{item.branch_name}}
                    </span>
                    <div class="div1">
                        <span class="border-color" :class="item.status==0?'wait-color':item.status==1?'':'normal-color'"></span>
                        <span class="span5" :class="item.status==0?'wait':item.status==1?'':'normal'">{{item.status_text}}</span>
                        <span class="right">巡检<font>{{item.id}}</font></span><br/>
                        <span class="work-time"><font>状态时长：</font>{{item.last_state_time}}</span>
                    </div>
                    <!-- 新增备注信息展示-->
                    <div class="trouble-remark">备注：{{item.remark}}</div>
            </div>
        </PullDownRefresh>
        <!-- 筛选弹框-->
        <!--confirm筛选提示框-->
        <div class="carstock_window common_cover">
            <div class="carstock_content">
                <div class="carstock-title">
                    筛选
                    <span class="close-carstock" @click="closeconfirm()">&#xe601;</span>
                </div>
                <div class="confirm-carstock">
                    <div class="title" v-if="citys.length>1">城市</div>

                    <div class="confirm-carcity" v-if="citys.length>1">
                        <span class="allcity" :class="{color:trueAll}" @click="handleClickAll">全部</span>
                        <span class="citytype" v-for="city in citys" :class="{color:choice.includes(city.id)}" :key="city.id" @click="choicecity(city.id)">{{city.name}}</span>
                    </div>
                    <div class="center-part"></div>
                    <div class="title">工单状态</div>

                    <div class="confirm-carworkstate">
                        <span class="allworktype" :class="{color:trueAll2}" @click="handleClickAll2">全部</span>
                        <span class="worktype" v-for="status in workstatus" :class="{color:choice2.includes(status.id)}" :key="status.id" @click="choicestatus(status.id)">{{status.name}}</span>
                    </div>
                </div>
                <div class="carstate-bottom">
                    <button class="carstate-reset" @click="reset">重置</button><button class="carstate-sure" @click="sure">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/list.css")
    import $ from 'jquery'
    import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    export default{
        name: "worklist",
        components: {
            HeaderTab,
            PullDownRefresh
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
            page:1,//初始化页面
            list:[],
            opt: {
                height: 300, // 容器高度
                usePullDown: true,// 是否启用下拉
                usePullUp: true // 是否启用上拉
            },
            trueAll:true,
            citys:[],//存放权限城市
            choice:[],//选择项id
            status:sessionStorage.getItem("xun-j") || '-1',//权限城市id
            trueAll2:true,
            workstatus:[{id:'0',name:'待巡检'},{id:'1',name:'巡检中'},{id:'2',name:'已完成'}],//存放工单状态
            choice2:[],//选择项id
            status2:sessionStorage.getItem("xun-j2") || '-1'//工单状态
        }
    }
    ,
    created()
    {
        //获取权限城市
        if(sessionStorage.getItem("work-citys")){
            this.citys = JSON.parse(sessionStorage.getItem("work-citys"));
        }else{
            this.getcity().then(res=>{
                this.citys = res;
                sessionStorage.setItem("work-citys",JSON.stringify(res))
            }).catch(this.handleError)
        }
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
        sessionStorage.setItem("xun-j",this.status)
        sessionStorage.setItem("xun-j2",this.status2)
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        if(sessionStorage.getItem("xun-j") && sessionStorage.getItem("xun-j2")){
            if(!sessionStorage.getItem("xun-j").split(',').includes(-1)){
                this.trueAll = false;
                this.choice=sessionStorage.getItem("xun-j").split(',')
            }
            if(!sessionStorage.getItem("xun-j2").split(',').includes(-1)){
                this.trueAll2 = false;
                this.choice2=sessionStorage.getItem("xun-j2").split(',')
            }
        }
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
            window.location.href="./index.html#/search"
        },
        //打开筛选弹框
        filterShow(){
            $(".carstock_window").fadeIn(300);
            $(".carstock_content").animate({bottom:0},500);
        },
        //关闭筛选弹框
        closeconfirm(){
            $(".carstock_window").fadeOut(300);
            $(".carstock_content").animate({bottom:"-100%"},500);
        },
        //选择城市
        choicecity(id){
            if(this.trueAll)this.trueAll = false;
            let index = this.choice.indexOf(id)
            if(index>-1){
                if(this.choice.length>1)this.choice.splice(index, 1)
            }else{
                this.choice.push(id)
            }
        },
        //选择工单状态
        choicestatus(id){
            if(this.trueAll2)this.trueAll2 = false;
            let index = this.choice2.indexOf(id)
            if(index>-1){
                if(this.choice2.length>1)this.choice2.splice(index, 1)
            }else{
                this.choice2.push(id)
            }
        },
        //全部
        handleClickAll(){
            this.choice = [];
            this.trueAll = true;
        },
        handleClickAll2(){
            this.choice2 = [];
            this.trueAll2 = true;
        },
        // 重置
        reset(){
            // 如果有全选，重置时默认全选，否则默认全不选
            this.trueAll = true;
            this.trueAll2 = true;
            this.choice = [];
            this.choice2 = [];
        },
        //筛选确定
        sure(){
            $(".carstock_window").fadeOut(300);
            $(".carstock_content").animate({bottom:"-100%"},500);
            if(this.trueAll){
                this.status='-1';
            }else{
                this.status=this.choice.toString();
            }
            if(this.trueAll2){
                this.status2='-1';
            }else{
                this.status2=this.choice2.toString();
            }
            this.pullDown()
        },
        //获取权限城市
        getcity(){
            return myAjax.post(getApiUrl('/vehicle-inspection/cities'),{
                mobile:sessionStorage.getItem("mobile")
            }).then(res=>{
                if(res.status !== 0){
                    throw res
                }else{
                    return res.data;
                }
            })
        },
        //列表展示
        getList(){
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                lng:'116.300345',
                lat:'40.044833',
                //city_id:this.status,//权限城市
                status:this.status2,//工单状态
                page:this.page,
                limit:10
            }
            return myAjax.post(getApiUrl('/vehicle-inspection/order-list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
        })
    },
        pullDown(){
            this.page = 1
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
            if(status==0){//待巡检
               window.location.href="./index.html#/detail?id="+id;
            }else if(status==1) {//巡检中
               window.location.href="./index.html#/workdetail?id="+id;
            }else{//已完成
                window.location.href="./index.html#/finshcarwork?id="+id;
            }
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