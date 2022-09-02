<template>
    <div class="container">
        <div class="header-wrap" v-show="branch.name">
            <div class="branch-wrap">
                <div class="branch">{{ branch.name }}</div>
                <div class="branch-addr">
                    <div class="icon"></div>
                    <div class="addr">{{ branch.address }}</div>
                    <div class="nav" @click.stop="navigation"></div>
                </div>
            </div>
            <div class="stat" @click="goAll">
                <div class="model">
                    <span>当前车辆数：</span>
                    <span class="num">{{branch.car_num}}</span>
                </div>
                <div class="status">
                    <span>剩余车位</span>
                    <span class="num">{{branch.remaining_parking_qty}}</span>
                </div>
                <div class="icon-right"></div>
            </div>
            <div class="des">长租空闲 {{carList.length}} 辆</div>
        </div>
        <div class="car-list">
            <div class="item" v-for="(item,index) in carList" :key="index">
                <div class="row">
                    <div class="plate">{{item.plate_no}}</div>
                    <div class="num">({{item.vin}})</div>
                    <div class="status">{{item.car_status_name}}</div>
                </div>
                <div class="row car-info">
                    <span>{{item.current_parking_floor}}</span>
                    <span class="divider">|</span>
                    <span>{{item.car_model}}</span>
                    <span class="divider">|</span>
                    <span >{{item.car_color}}</span>
                    <span class="divider" >|</span>
                    <span >约续航 {{item.remain_km}} 公里</span>
                </div>
                <div class="limit" v-if="item.car_limit.length">
                    <div class="link" :class="item.car_limit[0].limit?'rb':'gb'">
                        <div class="col1">今</div>
                        <div class="col2" :class="item.car_limit[0].limit?'red':'green'">{{item.car_limit[0].limit | filterLimit}}</div>
                    </div>
                    <div class="link" :class="item.car_limit[1].limit?'rb':'gb'">
                        <div class="col1">明</div>
                        <div class="col2" :class="item.car_limit[1].limit?'red':'green'">{{item.car_limit[1].limit | filterLimit}}</div>
                    </div>
                    <div class="limit-item" :class="item.car_limit[2].limit?'red':'green'">{{item.car_limit[2].limit | filterLimit}}</div>
                    <div class="limit-item" :class="item.car_limit[3].limit?'red':'green'">{{item.car_limit[3].limit | filterLimit}}</div>
                    <div class="limit-item" :class="item.car_limit[4].limit?'red':'green'">{{item.car_limit[4].limit | filterLimit}}</div>
                </div>
                <div class="dashed">
                    <div class="time">
                        <span class="label">停放时长：</span>
                        <span>{{item.car_status_duration}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import http from '../js/http'
import api from '../js/api'
import { Toast } from 'mint-ui'
export default {
    name:'listDetail',
    data(){
        return {
            branch_id:'',
            user_poi:[],
            branch:{},
            carList:[
                {
                    car_limit:[

                    ]
                }
            ]
        }
    },
    created(){
        this.$showLoading('detail')
        this.branch_id = this.$route.query.branch_id
        this.user_poi = this.$store.state.workList.user_poi
        this.$DD.init();
        this.getDetail()
        this.initNavigation()
    },
    methods:{
        initNavigation(){
            let _this = this;
            AMap.plugin(["AMap.Driving"], function () {
                var drivingOption = {
                    policy: AMap.DrivingPolicy.LEAST_TIME,
                    map: ''
                };
                _this.driving = new AMap.Driving(drivingOption); //构造驾车导航类
            });
        },
        navigation(){
            var that = this;
            let { lat, lng,  } = this.branch
            if(this.$DD.inDDApp){
                this.$DD.getLocation().then(data=>{
                    this.driving.search(
                        [data.longitude, data.latitude], [lng,lat],
                        function (status, result) {
                            that.driving.searchOnAMAP({
                                origin: result.origin,
                                destination: result.destination
                            });
                        }
                    );
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                this.driving.search(
                    [113.2560825348,23.1245740244], [lng,lat],
                    function (status, result) {
                        that.driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    }
                );
            }
        },
        getDetail(){
            let mobile = sessionStorage.getItem('mobile')
            let data = {
                mobile,
                branch_id:this.branch_id,
                status:3
            }
            const _this = this;
            http.post(api('/long-rental/branch-detail'),data).then(res=>{
                if(res.status===0){
                    _this.branch = res.data.branch
                    _this.carList = res.data.cars
                    this.$hideLoading('detail')
                }else{
                    Toast(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        goAll(){
            this.$router.push({
                path:'allList',
                query:{
                    branch_id:this.branch_id
                }
            })
        }
    },
    filters:{
        filterLimit(v){
            if(v===0){
                return '开'
            }else if(v===1){
                return '停'
            }else{
                return '待'
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        .header-wrap{
            background: #fff;
            .branch-wrap{
                padding: .16rem .16rem .1rem;
            }
            .branch{
                .fco(.14rem,#333);
                margin-bottom: .07rem;
            }
            .branch-addr{
                .fd();
                position: relative;
                .icon{
                    width:.11rem;
                    height: .14rem;
                    background: url('../images/map-B.png') no-repeat;
                    background-size: 100% 100%;
                    margin-right: .04rem;
                }
                .addr{
                    .fco(.12rem,#666);
                }
                .nav{
                    position: absolute;
                    right: 0;
                    top: 0;
                    width:.18rem;
                    height: .18rem;
                    background: url('../images/nav.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
            .stat{
                position: relative;
                padding-left: 11px;
                margin-bottom: .05rem;
                border-top: 1px solid #f6f6f6;
                height: .4rem;
                padding: 0  16px 0 27px;
                &::before{
                    content: '';
                    position: absolute;
                    top:50%;
                    left: 16px;
                    width: 6px;
                    height: 6px;
                    background: #108EE9;
                    margin-top: -3px;
                    border-radius: 50%;
                }
                .fc();
                .fco(.14rem,#333);
                .model{
                    flex:1;
                }
                .status{
                    flex:1;
                }
                .num{
                    color: #ED3800;
                }
                .icon-right{
                    width: .34rem;
                    height: .34rem;
                    background: url('../images/icon-right.png') no-repeat  center center;
                    background-size: 50% 50%;
                    position: absolute;
                    right: .05rem;
                    top: 50%;
                    margin-top: -.17rem;
                }
            }
            .des{
                height: .37rem;
                padding-left: .16rem;
                padding-top: .15rem;
                .fco(.12rem,#333);
                background: #f6f6f6;
            }
        }
        .car-list{
            .item{
                padding: .1rem;
                background: #fff;
                margin-bottom: .1rem;
                .limit{
                    margin-bottom: .1rem;
                    .fd();
                    .limit-item{
                        width: .16rem;
                        height: .16rem;
                        color:#fff;
                        font-size: .11rem;
                        border-radius: 2px;
                        margin-right: .05rem;
                        .fc();
                    }
                    .green{
                        background:#77D777;
                    }
                    .red{
                        background: #FF858C
                    }
                    .link{
                        width: .32rem;
                        height: .16rem;
                        border-radius: 2px;
                        margin-right: .05rem;
                        font-size: .11rem;
                        overflow: hidden;
                        .fd();
                        color: #fff;
                        .col1{
                            color: #666;
                            flex: 1;
                            .fc();
                        }
                        .col2{
                            flex: 1;
                            .fc();
                        }
                        
                    }
                    .gb{
                        border: 1px solid #77D777
                    }
                    .rb{
                        border: 1px solid #FF858C
                    }
                }
                .row{
                    .fd();
                    .plate{
                        font-size: .14rem;
                        color: #333333;
                    }
                    .num{
                        font-size: .14rem;
                        color: #999;
                        margin:  0 .1rem;
                    }
                    .status{
                        padding: 0 .02rem;
                        border: 1px solid #CDCDCD;
                        border-radius: 2px;
                        font-size:.11rem;
                        color: #5e5e5e;
                    }
                }
                .car-info{
                    margin:.03rem 0 .1rem;
                    font-size: .11rem;
                    color: #666;
                    .divider{
                        margin: 0 .04rem;
                    }
                }
                .dashed{
                    .fco(.12rem,#666)
                }
            }
        }
    }
</style>


