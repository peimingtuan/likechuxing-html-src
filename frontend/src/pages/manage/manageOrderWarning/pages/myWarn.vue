<template>
	<div class="myWarn">
		<div class="status_text" v-if="!dataReady">
            正在加载列表...
        </div>
        <div class="status_text" v-else-if="list.length === 0">
            列表为空
        </div>
        <div v-else>
        	<div class="his_item" 
        		v-for="listItem in list"
        		:key = 'listItem.id'
        		@click="goFinish(listItem.id,listItem.status)">
				<div class="car_card">
					<p class="car_plat">
						<span class="fc33">{{listItem.plate_no}}</span>
						(<span class="fc99" v-show="listItem.vin">{{listItem.vin.substring(listItem.vin.length-6)}}</span>)
					</p>
					<div>
						ID:{{listItem.id}}
					</div>
					
				</div>
				<p class="car_dec"> 
					
					<span>
						{{listItem.brand_name}}{{listItem.model_name}}
					</span>
					<span class="car_color">{{listItem.color}}</span>
					<span>
						约续航
						<b>{{listItem.remain_km}}</b>
						公里
					</span>
				</p>
				
				<p class="fc66">处理状态：<span :class="listItem.status==2?'fc33':'fcfe'">{{listItem.status_text}}</span></p>
				<p v-show="listItem.status==2" class="fc66">
					处理时间：<span class="fc66">{{listItem.update_time}}</span>
				</p>
				<p v-show="listItem.status==2" class="fc66">
					处理方式：<span class="fc66">{{listItem.process_mode_text}}</span>
				</p>
			</div>
        </div>
		
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
	export default{
		name:'myWarn',
		data(){
			return{
				dataReady:false,
				list:'',
			}
		},
		beforeCreate () {
		},
	
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			$('body').css('background','#F6F6F6');
		},
		methods: {
			init(){
				var param = {
					"mobile":userData.state.mobile||sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng')||userData.state.locationsLng,		//经度
					'lat':sessionStorage.getItem('lat')||userData.state.locationsLat,		//维度
//					'car_id':this.$route.query.car_id,
					'is_mine':'1',
				}
				return myAjax.post(getOspApiUrl('/vehicle-zombie/order-list'),param).then(res=>{
		          this.dataReady = true;
			          if(res.status !== 0){
			            throw res
			          }else{
			            return res.data;
			          }
		        })
			},
			goFinish(id,status){
				if(status==2){
					this.$router.push({
			          path:'/finishedOrder',
			          query:{
			          	order_id:id
			          }
			        })
				}else if(status==1){
					this.$router.push({
			          path:'/warningOrder',
			          query:{
			          	order_id:id
			          }
			        })
				}
			}
		},
		created(){
			this.init().then(res=>{
		     	this.list = res;
		   	}).catch(this.handleError)
		}
	}
</script>

<style scoped>
	.fc33{
		color: #333333;
	}
	.fcfe{
		color: #fe6d7c
	}
	.fc99{
		color: #999999;
	}
	.fc66{
		color: #666666;
	}
.detail_addr{
	padding-top: .14rem;
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	-webkit-align-items: center;
}
.icon_addr{
	display: inline-block;
	width: 0.15rem;
	height: 0.2rem;
}
.icon_addr img{width: 100%;height: 100%;}
.carpro_card{font-size: .14rem;}
.carpro_date{
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	-webkit-align-items: center;
	justify-content: space-between;
	-webkit-justify-content: space-between;
}
.his_item{
		background-color: #FFFFFF;
		padding: 0.14rem 0.11rem 0.13rem 0.11rem;
		margin-bottom: .1rem;
	}
	.car_card{
		display: flex;
	    align-items: center;
	    justify-content: space-between;
	   	display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
	}
	.is_rule{
		display: inline-block;
		width: .18rem;
		height: .18rem;
	}
	.car_color{
		padding: 0 .06rem;
		border-left: 1px solid #CDCDCD;
		border-right: 1px solid #CDCDCD;
	}
	.car_plat span:first-child{
		font-weight: 700;
	}
	.car_dec{
		padding-bottom: .1rem;
	}
	.car_dec span{
	    display: inline-block;
	    /*padding-right: .05rem;*/
	    color: #666;
	    height: .12rem;
	    line-height: .12rem;
	}
	.status{
	    font-size: 12px;
	    border:solid 1px #dbdbdb;
	    line-height: 0.2rem;
	    padding: 0 0.05rem;
	    border-radius: 3px;
  	}
	
    .status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
    }
</style>