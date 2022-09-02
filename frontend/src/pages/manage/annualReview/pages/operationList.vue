<template>
	<div class="container">
        <WorkListItem
            :id="carInfo.id"
            :plate_no="carInfo.plate_no" 
            :vin="carInfo.vin" 
            :carStatus="carInfo.car_status_name"
            :model_name="carInfo.model_name" 
            :color="carInfo.car_color"
            :branch="carInfo.branch.name"
            :parking_no="carInfo.branch.parking_no" 
            :parking_floor="carInfo.branch.parking_floor"
            :car_factory_name="carInfo.car_factory_name"
            :remain_km="carInfo.remain_km"
            :fromType="1"
        />
        <div class="op-history">
            <div class="title">操作历史：</div>
            <div class="h-list">
                <div class="item" v-for="(item,index) in info" :key="index">
                    <div class="op">
                        <span>{{item.update_time}}</span>
                        <span class="weight">{{item.status_name}}</span>
                    </div>
                    <div class="op-author">
                        <span>{{item.user_name}}</span>
                        <span>{{item.phone}}</span>
                    </div>
                    <div class="remark" v-show="item.remark">备注：{{item.remark}}</div>
                    <div class="branch" v-show="item.branch.name">
                        <div class="icon"></div>
                        <div class="label">{{item.branch.name}}</div>
                    </div>
                    <div class="more" v-show="item.current_status==1 && item.status==1" @click="goImagePage">查看 ></div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
  	import api from '../js/api'
    import http from '../js/http'
    import { Toast } from 'mint-ui'
    import WorkListItem from '../components/indexPageWorkListItem.vue'

	export default{
        name:'operation',
        components:{
            WorkListItem,
        },
		data(){
			return{
                carInfo:{
                    branch:{}
                },
                info:[],
				order_id:'',
				car_id:''
			}
        },
		created(){
            this.$showLoading('opreration')
            this.order_id = this.$route.query.order_id
            this.car_id = this.$route.query.car_id
            Promise.all([this.getCarInfo(),this.getInfo()]).then(()=>{
                this.$hideLoading('opreration')
            })
        },
		methods: {
			getInfo(){
                let mobile = sessionStorage.getItem('mobile')
                let { order_id } = this;
                let _this = this;
				return http.post(api('/vehicle-examine/record'), {
					mobile,
				    id:order_id	
				}).then(res=>{
		          if(res.status == 0){
                    _this.info = res.data
		          }else{
		            Toast(res.msg)
		          }
		        }).catch(err=>{
                    console.log(err)
                })
				
            },
            getCarInfo(){

                let mobile = sessionStorage.getItem('mobile')
                let { order_id } = this;
                let _this = this;
				return http.post(api('/vehicle-examine/end-detail'), {
					mobile,
				    id:order_id	
				}).then(res=>{
		          if(res.status == 0){
                    this.carInfo = res.data
		          }else{
		            Toast(res.msg)
		          }
		        }).catch(err=>{
                    console.log(err)
                })
            },
            goImagePage(){
                this.$router.push({
                    path:'seeImage',
                    query:{
                        order_id:this.order_id
                    }
                })
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
        .op-history{
            padding: .15rem;
            background:#fff;
            margin-top:.1rem;
            .title{
                .fco(.14rem,#333);
                margin-bottom:.1rem;
            }
            .h-list{
                .item{
                    padding-bottom: .1rem;
                    padding-left: .18rem;
                    position: relative;
                    &::before{
                        content:'';
                        width: 1px;
                        height: 100%;
                        border-radius: 100%;
                        background:  #C9C9C9;
                        position: absolute;
                        left: .03rem;
                        top: 10%;
                    }
                    &:last-child{
                       &::before{
                            display: none;
                        } 
                    }
                    .more{
                        position: absolute;
                        right: 0;
                        top: 0;
                        font-size: .13rem;
                        color: rgb(40, 128, 230);
                    }
                }

                .fco(.12rem,#666);
                .op{
                    .weight{
                        color: #333;
                        font-weight: 700;
                    }
                    span{
                        margin-right: .2rem;
                    }
                    margin-bottom: .06rem;
                    position: relative;
                    &::before{
                        content:'';
                        width: .08rem;
                        height: .08rem;
                        border-radius: 100%;
                        background:  #C9C9C9;
                        position: absolute;
                        left: -.18rem;
                        top: 50%;
                        margin-top: -.04rem;
                    }
                }
                .op-author{
                    span{
                        margin-right: .1rem;
                    }
                }
                .remark{
                    .fco(.12rem,#333);
                    margin:.06rem 0;
                }
                .branch{
                    .fd();
                    .icon{
                        width:.12rem;
                        height: .15rem;
                        background: url('../images/de-get-B.png') no-repeat;
                        background-size: 100% 100%;
                        margin-right: .04rem;
                    }
                }
            }     
        }
    }
</style>