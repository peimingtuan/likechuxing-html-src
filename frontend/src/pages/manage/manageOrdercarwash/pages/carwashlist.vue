<template>
    <div id="carwashlist">
        <!-- 头部-->
        <HeaderTab
                :module="headerTabModule"
                @tabRefresh="refresh"
                @tabSort='sort'
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
                        待检查车辆数：<font>{{item.count}}</font>
                    </span>
                </li>
            </ul>
        </PullDownRefresh>
        <!-- 排序弹框-->
        <SlideUpBox v-if="sort_show" title="排序" ref="slideUpBox" @close="filterClose">
            <ul class="sort_content">
                <li :id="'sort'+sortItem.sortType"
                    v-for="sortItem in sorts"
                    @click="sortCheck(sortItem.sortType,$event)">
                    <span :class="sort_type==sortItem.sortType?'is_sort':'no_sort'">{{sortItem.sortCont}}</span>
                    <img v-show="sort_type==sortItem.sortType" src="../images/duigou.png"/>
                </li>
            </ul>
        </SlideUpBox>
    </div>
</template>
<script>
    import $ from 'jquery'
    import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import userData from '../../../../../other_modules/like-manageOrder/UserData'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    export default{
        name: "carwashlist",
        components: {
            HeaderTab,
            PullDownRefresh,
            SlideUpBox,
        },
        data ()
    {
        return {
            headerTabModule: [
                'sort',
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
            //排序弹框
            sort_show:false,
            sorts:[
                {"sortCont":"距离网点从近到远",'sortType':'1'},
                {"sortCont":"网点车辆数从大到小",'sortType':'2'}
            ],
            sort_type:1,
        }
    }
    ,
    created()
    {
        // 计算列表容器高度
        this.opt.height = window.innerHeight - window.REM * 0.4 - 1;
        dd.getLocation().then(res => {
            userData.save({
                    locationsLng: res.longitude,
                    locationsLat: res.latitude
                })
            this.getList().then(res=>{
                this.list = res;
            }).catch(this.handleError)
        }).catch(err => {
            this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
        });
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
            this.list = [];
            this.dataReady = false;
                dd.getLocation().then(res => {
                    userData.save({
                            locationsLng: res.longitude,
                            locationsLat: res.latitude
                        })
                this.pullDown()
            }).catch(err => {
                this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
            });
        },
        //打开排序弹框
        sort(){
            this.sort_show=true;
        },
        //列表展示
        getList(){
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                sort:this.sort_type,//排序，1默认距离网点从近到远,2网点车辆数从大到小
                lng: userData.state.locationsLng||'116.298611',
                lat: userData.state.locationsLat||'40.044257',
                page:this.page,
                size:10 //分页大小
            }
            return myAjax.post(getApiUrl('/wash-task/group-list'),param).then(res=>{
                this.dataReady = true;
            if(res.status !== 0){
                throw res
            }else{
                return res.data;
            }
            })
        },
        //列表展示
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
        //关闭排序弹框
        filterClose(){
            this.sort_show=false;
        },
        //排序弹框点击触发事件
        sortCheck(sortType,e){
            this.sort_type = sortType;
            setTimeout(()=>{
                this.sort_show = false;
                this.page=0;
                this.getList().then(res=>{
                    this.list = res;
                }).catch(this.handleError)
            },500)
        },
        //去详情页面
        godetail(branch_id){
            this.$router.push({
                path:'/networkdetail',
                query:{
                    branch_id:branch_id //网点id
                }
            })
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
<style scoped>
    /*<!-- 列表样式-->*/
   .carwashlistlist li{
       margin-bottom:.12rem;
       padding:.12rem;
       background:#fff;
    }
    .carwashlistlist li span{
        display:inline-block;
        line-height:.28rem;
    }

    .carwashlistlist li .span1{
        font-size:.15rem;
       font-weight: bold;
    }

    .carwashlistlist li .net-name{
        width:3.5rem;
        color:gray;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .carwashlistlist li .selectcar{
        font-size:.15rem;
        line-height:.35rem;
    }

    .carwashlistlist li .selectcar font{
        font-size:.15rem;
        color:#f38361;
    }
    .carwashlistlist li img{
        width:.23rem;
        vertical-align: middle;
        margin-right:.02rem;
    }
    .carwashlistlist li .color-icon{
        position: relative;
        top: -.02rem;
        width:5px;
        height:5px;
        border-radius:50%;
        background:#108ee9;
    }
</style>