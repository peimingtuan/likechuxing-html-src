<template>
    <div id="carwashlist2">
        <div class="header" ref="header">
            <div class="search" @click="goSearch()">
                <span class="iconfont">&#xe605;</span>
                <span class="placeholder">请输入网点名称或者车牌号</span>
            </div>
            <div class="rightIcon" @click="toMyList">
               &#xe60b;
            </div>
        </div>
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
                <li v-for="item in list"  @click="godetail(item.branch_id)">
                <span class="span1">{{item.branch.name}}</span><br/>
                    <span class="net-name">
                        <!-- 0合作 1非合作 2加油站-->
                        <img v-if="item.branch.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="item.branch.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="item.branch.biz_type==2" src="../images/mapoiler.png">
                        {{item.branch.address}}
                    </span><br/>
                    <span class="selectcar">
                        <span class="color-icon"></span>
                        待洗车辆数：<font>{{item.count}}</font>
                    </span>
                </li>
            </ul>
        </PullDownRefresh>
    </div>
</template>
<script>
    require("../css/carwashlistlist2.css")
    import $ from 'jquery'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    export default{
        name: "carwashlist2",
        components: {
            PullDownRefresh
        },
        data ()
    {
        return {
            dataReady:false,
            lng:'',//当前经纬度
            lat:'',//当前经纬度
            list:[],
            page:0,//初始化页面
            opt: {
                height: 1000, // 容器高度
                usePullDown: true,// 是否启用下拉
                usePullUp: true // 是否启用上拉
            }
        }
    }
    ,
    created()
    {
        //高德获取定位
        var geolocation,
                that=this;
        AMap.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonPosition: 'RB'
            });
            geolocation.getCurrentPosition(function (status, data) {
                if (status === 'complete') {
                    that.lng=data.position.lng;
                    that.lat=data.position.lat;
                    that.getList().then(res=>{//初始化列表接口
                        that.list = res;
                    }).catch(that.handleError)
                } else {
                    that.$_LIKE_toast("获取当前定位失败")
                    that.getList().then(res=>{//初始化列表接口
                        that.list = res;
                    }).catch(that.handleError)
                }
            });
        });
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
        var userAgent = navigator.userAgent,
                isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isiOS){
            _this.opt.height =  window.screen.height - 200;
        }else{
            _this.opt.height =  window.screen.height - 150;
        }
    }
    ,
    methods: {
        //去我的工单页面
        toMyList(){
            window.location.href="index.html#/mycarwashlist2"
        },
        //列表展示
        getList(){
            let param = {
                token:sessionStorage.getItem("access_token"),
                lng:this.lng,
                lat:this.lat,
                page:this.page
            }
            return myAjax.post(getApiUrl('/wash/task/group-list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
        })
    },
    pullDown(){
            this.page = 0;
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
        godetail(branch_id){
            this.$router.push({
                path:'/networkdetail2',
                query:{
                    branch_id:branch_id
                }
            })
        },
    handleError(err){
        if(err && err.msg){
            if(err.status==401){//验证过期信息
                setTimeout(function(){
                    window.location.href="index.html#/enterhome"
                },2000)
                this.$_LIKE_toast("验证信息已失效，请重新登录")
            }else{
                this.$_LIKE_toast(err.msg)
            }
        }else{
            console.log(err)
        }
    },
        //去搜索
        goSearch(){
            this.$router.push({
                path:'/search2'
            })
        }
    }
    }
</script>