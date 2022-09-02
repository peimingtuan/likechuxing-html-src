<template>
	<div class="container">
        <div class="map-wrap" id="map-wrap">
        </div>
        <div class="body">
            <div class="info">
                <div class="car-info">
                    <div class="car">
                        <div class="plato">{{info.plate_no}}</div>
                        <div class="modal">{{info.model_name}}</div>
                    </div>
                    <div class="km">
                        <span class="num">{{info.distance}}</span>
                        <span>km</span>
                    </div>
                </div>
                <div class="branch-info">
                    <div class="icon">
                        <span>检</span>
                    </div>
                <div class="branch">
                    <div class="addr">{{info.branch.name}}</div>
                    <div class="time">{{info.update_time}}</div>
                    </div> 
                </div>
                <div class="btn-group">
                    <div class="btn" @click="goBtn(0)">同步油/电量</div>
                    <div class="btn" @click="goBtn(1)">开门</div>
                    <div class="btn" @click="goBtn(2)">锁门</div>
                </div>
                <div class="km-info">
                    <div class="km">
                        <span>续航里程</span>
                        <span class="num">{{info.remain_km}}</span>
                        <span>km</span>
                    </div>
                    <div class="detail-entrance" @click="goOperationPage">工单详情 ></div>
                </div>
            </div>
            <div class="footer">
                <div class="btn" @click="checkMap">查询网点</div>
                <div class="btn" @click="goIndex">返回首页</div>
            </div>
        </div>
	</div>
</template>

<script>
  	import api from '../js/api'
    import http from '../js/http'
    import { Toast } from 'mint-ui'
    import likeMap from '../js/map'

	export default{
		name:'detailPreview',
		data(){
			return{
                info:{
                    branch:{}
                },
				order_id:'',
				
			}
		},
		created(){
            this.$showLoading('finished')
            this.order_id = this.$route.query.order_id
        },
        mounted(){
            this.initMap()
        },
		methods: {
			getInfo(){
                let mobile = sessionStorage.getItem('mobile')
                let { order_id } = this;
                let _this = this;
				return http.post(api('/vehicle-examine/end-detail'), {
					mobile,
				    id:order_id	
				}).then(res=>{
		          if(res.status == 0){
                    this.info = res.data
		            this.$hideLoading('finished')
		          }else{
		            Toast(res.msg)
		          }
		        }).catch(err=>{
                    console.log(err)
                })
				
            },
            async initMap(){
                await this.getInfo();
                let point = [Number(this.info.branch.lng),Number(this.info.branch.lat)]
                this.map = likeMap.initStaticMap({
                    el:'map-wrap',
                    zoom:16,
                    center:point
                })
                let marker = new AMap.Marker({
                    position: point,
                    offset: new AMap.Pixel(-20.5, -48),
                    content: '<div class="detailPreview-marker">检</div>'
                });
                this.map.add(marker)
            },
            goIndex(){
                window.location.href = './../manageOrderMain/index.html#/list'
            },
			checkMap(){//查看网点地图
				this.$router.push('dotMap')
            },
            goOperationPage(){
                let { order_id } = this;
                let { car_id } = this.info
                this.$router.push({
                    path:'operationList',
                    query:{
                        order_id,
                        car_id
                    }
                })
            },
			goBtn(index){
                let mobile = sessionStorage.getItem('mobile')
                let car_id = this.info.car_id
                let order_id = this.order_id
                let plate_no = this.info.plate_no
				if(index==0){
					http.post(api('/work-order-kerb/endurance-mileage'), {
				        mobile,
				        car_id
				    }).then(res => {
				      Toast(res.msg);
				      	if (res.status == 0) {
				            this.allInfo.remain = res.data.remain
				        }
					}).catch(err => {
					    console.log(err)
					})
				}else if(index==1){
	    			http.post(api('/car/open-door'), {
		        		mobile,
					    car_info:plate_no
					}).then(res => {
				      	Toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}else if(index==2){
	    			http.post(api('/car/close-door'), {
		        		mobile,
					    car_info:plate_no
					}).then(res => {
				      	Toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}
			}
			
        },
        destory(){
            this.$hideLoading('finished')
        }
	}
</script>

<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        min-height: 100vh;
        background: #f6f6f6;
        display: flex;
        flex-direction: column;
        .map-wrap{
            flex:1;
        }
        .body{
            height: 3.18rem;
            .info{
                padding: .12rem;
                background: #fff;
                .car-info{
                    height: .62rem;
                    border-bottom: 1px solid #e6e4e4;
                    .fb();
                    .car{
                        .fd();
                        .fco(.12rem,#666);
                        .plato{
                            .fco(.2rem,#111);
                            margin-right: .02rem;
                        }
                    }
                    .km{
                        .fd();
                        .fco(.16rem,#111);
                        .plato{
                            .fco(.18rem,#111);
                        }
                    }
                }
                .branch-info{
                    height: .8rem;
                    .fd();
                    .icon{
                        height: .44rem;
                        margin-right: .1rem;
                        padding-top: .02rem;
                        span{
                            display:block;
                            background:rgb(129, 221, 87);
                            font-size: .12rem;
                            color: #fff;
                            border-radius: 50%;
                            width: .22rem;
                            height: .22rem;
                            text-align: center;
                            line-height: .22rem;
                        }
                    }
                    .branch{
                        height: .44rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .addr{
                            .fco(.16rem,#333)
                        }
                        .time{
                            .fco(.12rem,#666)
                        }
                    }
                }
                .btn-group{
                    .fd();
                    .btn{
                        min-width: .72rem;
                        margin-right: .1rem;
                        padding: 0 .1rem;
                        height: .32rem;
                        background: #333;
                        border-radius: 16px;
                        .fco(.15rem,#fff);
                        .fc();
                    }
                }
                .km-info{
                    height:.52rem;
                    .fb();
                    .km{
                        .fco(.14rem,#666);
                        .num{
                            color:#333
                        }
                    }
                    .detail-entrance{
                        .fco(.12rem,#333);
                    }
                }
            }
            .footer{
                height: .68rem;
                padding: .13rem;
                background: #fff;
                box-shadow: 0 -1px 2px 0 rgba(0,0,0,0.11);
                .fb();
                .btn{
                    width: 1.65rem;
                    height: .43rem;
                    .fc();
                    .fco(.14rem,#333);
                    border-radius: 2px;
                    border: 1px solid rgb(156, 154, 154);
                }
            }
        }
    }
</style>