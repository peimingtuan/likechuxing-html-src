<template>
    <div class="wrap" @click="press">
        <div class="branch">{{ branchName }}</div>
        <div class="branch-addr">
            <div class="icon"></div>
            <div class="addr">{{ branchAddress }}</div>
            <div class="nav" @click.stop="navigation"></div>
        </div>
        <div class="car-list">
            <div class="item" v-for="(item,index) in stat" :key="index">
                <div class="model">
                    <span>{{item.car_model}}：</span>
                    <span class="num">{{item.demandQty}}</span>
                </div>
                <div class="status">
                    <span>已完成：</span>
                    <span class="num">{{item.completionQty}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name:'longRentListItem',
    props:['id', 'branchName', 'branchAddress', 'branchType', 'lat', 'lng', 'stat', 'user_poi'],
    created(){
        this.$DD.init();
        this.initNavigation()
    },
    methods:{
        press(){
            this.$emit('press')
        },
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
            let { lat, lng } = this;
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
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .wrap{
        padding: .16rem;
        background: #fff;
        margin-bottom: .1rem;
        .branch{
            .fco(.14rem,#333);
            margin-bottom: .07rem;
        }
        .branch-addr{
            .fd();
            position: relative;
            margin-bottom: .15rem;
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
        .car-list{
            .item{
                position: relative;
                padding-left: 11px;
                margin-bottom: .05rem;
                &::before{
                    content: '';
                    position: absolute;
                    top:50%;
                    left: 0;
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
            }
        }
    }
</style>


