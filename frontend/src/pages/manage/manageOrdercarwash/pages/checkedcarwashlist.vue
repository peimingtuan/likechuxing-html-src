<template>
    <div id="checkedcarwashlist">
        <!-- 头部-->
        <HeaderTab
                :module="headerTabModule"
                @tabFilter="filterShow"
                @tabSort='sort'
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
            <ul class="carwashlistlist">
                <li v-for="(item,index) in list">
                    <span class="span1"><font class="font1">{{item.car.plate_no}}</font>（{{item.car.vin.substring(11, 17)}}）</span>
                    <span class="span2">{{item.car.car_status}}</span><br/>
                    <span class="span3">{{item.car.model_name}}</span>
                    <span class="span4">{{item.car.color}}</span><br/>
                    <span class="net-name">
                        <!-- 0合作 1非合作 2加油站-->
                        <img v-if="item.car.biz_type==0" src="../images/mapb.png">
                        <img v-else-if="item.car.biz_type==1" src="../images/map-B.png">
                        <img v-else-if="item.car.biz_type==2" src="../images/mapoiler.png">
                        {{item.car.branch_address}}
                    </span>
                    <div class="div1">
                        <span class="span5">{{item.status_name}}</span>
                        <span class="right">洗车<font>{{item.id}}</font></span><br/>
                        <span class="work-time"><font>取消原因：</font>{{item.cancel_reason}}</span><br/>
                        <span class="stop-add"><font>取消时间：</font>{{item.cancel_time}}</span>
                    </div>
                    <div class="div2">备注：{{item.remark}}</div>
                    <div class="div3">
                        <!-- 状态为4的话是无需处理的，4代表车内存在呕吐物-->
                        <span v-if="item.current_status==4" class="no-fit" @click="gonofit(item.id,$event,index)">无需处理</span>
                        <span v-else  class="no-fit" @click="gosolve(item.id)">已解决</span>
                        <span class="fit" @click="godetail(item.car.plate_no,item.id)">去处理</span>
                    </div>
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
        <!-- 筛选弹框-->
        <SlideUpBox v-if="filter_show" title="筛选" ref="slideUpBox" @close="filterClose">
            <FilterMultiple
                    title="取消原因"
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
    <!--备注信息弹框-->
    <div class="editremark_window none">
        <div class="editremark">
            <p class="title">备注信息</p>
            <div class="center">
            <textarea class="void_writeinfo" placeholder="请确认无需处理并输入备注，200字以内" maxlength="200">
            </textarea>
            </div>
            <div class="bottom">
                <span class="cancel" @click="cancel()">取消</span>
                <span class="sure" @click="sure()">确认无需处理</span>
            </div>
        </div>
    </div>
        <!-- 确认已解决-->
        <div class="editremark_window2">
            <div class="editremark2">
                <div class="center2">
                    请确认问题已经解决。
                </div>
                <div class="bottom2">
                    <span class="cancel2" @click="cancel2()">取消</span>
                    <span class="sure2" @click="sure2()">确认已解决</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/checkedcarwashlist.css")
    import $ from 'jquery'
    import HeaderTab from '../../../../../other_modules/like-manageOrder/component/HeaderTab'
    import PullDownRefresh from '../../../../../other_modules/vue-pullDownRefresh'
    import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
    import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
    import userData from '../../../../../other_modules/like-manageOrder/UserData'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    const OrderStatus = require('../js/orderStatus')
    export default{
        name: "checkedcarwashlist",
        components: {
            HeaderTab,
            PullDownRefresh,
            SlideUpBox,
            FilterMultiple,
            LikeButton
        },
        data ()
    {
        return {
            headerTabModule: [
                'filter',
                'sort',
                'refresh'
            ],
            dataReady:false,
            page:0,
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
                {"sortCont":"距离完成时间从大到小",'sortType':'2'}
            ],
            sort_type:1,
            //筛选弹框
            filter_show:false,
            status2:[],
            options3:OrderStatus.disfun.map(item=>{
                item.id = item.status
                return item
            }),
        nodealid:'',//无需处理的工单id
        dom:'',//无需处理的当前元素
        domlist:[],//无需处理的当前元素
            nodealid2:'',//已解决的工单id
            dom2:''//已解决的当前元素
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
            this.getList().then(res=>{//初始化待检查车辆列表接口
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
        //筛选
        filterShow () {
            this.filter_show = true;
            this.sort_show=false;
        },
        //打开排序弹框
        sort(){
            this.sort_show=true;
            this.filter_show = false;
        },

        //待检查车辆列表
        getList(){
            let param = {
                mobile:sessionStorage.getItem("mobile"),
                status:this.status2.join(','),
                sort:this.sort_type,//排序，1:按照距离从近到远; 2:按照完成时间从大到小排序
                lng: userData.state.locationsLng||'116.298611',
                lat: userData.state.locationsLat||'40.044257',
                page:this.page,
                size:10,//每页大小
            }
            return myAjax.post(getApiUrl('/wash-task/cancel-list'),param).then(res=>{
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
            if(this.domlist.length!=0){
                for(var i= 0;i<this.domlist.length;i++){
                    this.domlist[i].parent().siblings(".div2").text("备注：");
                }
            }
            this.getList().then(res=>{
                this.list = res;
                this.$refs.pullUpDown.update();
                $(".carwashlistlist .div3").show();
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
            this.filter_show=false;
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
    //无需处理弹框
    gonofit(id,e,index){
        this.nodealid=id;
        this.dom=$(e.target);
            $(".void_writeinfo").val('');//清空文本域
        $(".editremark_window").removeClass("none");
        $(".void_writeinfo").focus();
    },
    //备注信息弹框取消
    cancel(){
        $(".editremark_window").addClass("none");
    },
    //备注信息弹框确定
    sure(){
        if($(".void_writeinfo").val()!=''){
            myAjax.post(getApiUrl('/vehicle-wash/not-handel'),{
                mobile:sessionStorage.getItem("mobile"),
                id:this.nodealid,//工单id
                remark:$(".void_writeinfo").val()//备注信息
            }).then(res=>{
                if(res.status== 0){
                    $(".editremark_window").addClass("none");
                    this.dom.parent().hide();
                    this.domlist.push(this.dom);
                    this.dom.parent().siblings(".div2").text("备注："+res.data.remark);
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            })
        }else{
            this.$_LIKE_toast('备注信息不能为空')
        }
    },
    //去车辆详情页面,去处理
    godetail(plate_no,id){
        window.location.href="../manageOrderCardetail/index.html?plate_no="+plate_no+"&carwash_orderid="+id;
    },
    //已解决
    gosolve(id){
        this.nodealid2=id;
        this.dom2=$(event.target);
        $(".editremark_window2").fadeIn(500);
    },
    //取消已解决弹框
    cancel2(){
        $(".editremark_window2").fadeOut(500);
    },
    //确认已解决
    sure2(){
        myAjax.post(getApiUrl('/vehicle-wash/resolved'),{
            mobile:sessionStorage.getItem("mobile"),
            id:this.nodealid2,//工单id
        }).then(res=>{
            if(res.status== 0){
                this.dom2.parent().hide();
            }else{
                this.$_LIKE_toast(res.msg)
            }
        }).catch(err => {
            console.log(err)
        })
        $(".editremark_window2").fadeOut(500);
    }
    }
    }
</script>