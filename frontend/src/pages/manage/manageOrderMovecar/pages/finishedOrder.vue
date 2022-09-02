<!--
	作者：xurui_518@163.com
	时间：2018-10-23
	描述：结束工单
		
-->
<template>
	<div class="status_text" v-if="!dataReady">
            	加载中，请稍后...
    </div>
	<div class="finishedOrder" v-else>
		<end
			@checkMap='checkMap()'
			@goDetail = 'goDetail()'
			@goBtn = 'goBtn()'
			:allInfo = 'allInfo'
			:buttons = 'buttons'
			ref='mapCom'></end>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  	import end from '../component/end'
  	import {Select} from '../../../../component/Select/index'
	export default{
		name:'finishedOrder',
		components: {
	      end
	    },
		data(){
			return{
				listData:'',
				allInfo:{},
				buttons:['同步油/电量','开门','锁门'],
				dataReady:false,
				order_id:this.$route.query.order_id,
				
			}
		},
		beforeCreate () {
		},
		created(){
			this.init().then(res=>{
		     	this.listData = res;
		     	this.dataReady = true
		     	this.allInfo = {'plate_no':res.plate_no,'car_info':res.brand_name,'total_km':res.coord_km,
					'addrs':[{'icon_color':'1','icon_img':'取','branch_name':res.begin_branch,'time':res.start_time},
					{'icon_color':'3','icon_img':'还','branch_name':res.end_branch,'time':res.end_time}],
					'remain':res.remain_km,'end_coord_list':res.coord_list,
					'end_type':res.end_type,
					
				}
		   }).catch(this.handleError)
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
		},
		methods: {
			init(){
				return myAjax.post(getOspApiUrl('/vehicle-move/order-detail'), {
					 mobile:userData.state.mobile||sessionStorage.getItem('mobile'),
				    order_id:this.order_id	
				}).then(res=>{
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
				
			},
			checkMap(){//查看网点地图
				this.$router.push({
		          path:'/serviceMap',
		          query:{
		            order_id:this.order_id,
		            type:'3'
		          }
		        })
			},
			goDetail(){//工单历史详情
				this.$router.push({
		          path:'/hisDetail',
		          query:{
		          	list:JSON.stringify(this.listData),
		          	order_id:this.listData.id
		          }
		        })
			},
			goBtn(){
				var index = this.$refs.mapCom.btnNum;
				if(index==0){
					myAjax.post(getOspApiUrl('/work-order-kerb/endurance-mileage'), {
				        mobile:userData.state.mobile,
				        car_id:this.listData.car_id
				    }).then(res => {
				      	this.$_LIKE_toast(res.msg);
				      	if (res.status == '0') {
				            this.allInfo.remain = res.data.remain
				        }
					}).catch(err => {
					    console.log(err)
					})
				}else if(index==1){
	    			myAjax.post(getOspApiUrl('car/move-open-door'), {
		        		 mobile:userData.state.mobile,
					    order_id:this.order_id,
					    car_info:this.listData.plate_no||this.listData.vin.substring(this.listData.vin.length-6)
					}).then(res => {
				      	this.$_LIKE_toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}else if(index==2){
	    			myAjax.post(getOspApiUrl('/car/close-door'), {
		        		 mobile:userData.state.mobile,
					    order_id:this.order_id,
					    car_info:this.listData.plate_no||this.listData.vin.substring(this.listData.vin.length-6)
					}).then(res => {
				      	this.$_LIKE_toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}
			}
			
		}
	}
</script>

<style scoped>
	*{
   	 box-sizing: border-box;
   	}
    .fc33{
    	color: #333333;
    }
   .fc99{
   		color: #999999;
   }
   .fc66{
   		color: #666666;
   }
   .f15b{
		color: #F15B5B;
	}
	.fc4a90{
		color: #4a90e2;
	}
	.status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
    }
	
</style>