<!--
	作者：xurui_518@163.com
	时间：2018-08-23
	描述：24小时未动
	1、列表入口     1）24小时待追车
			 2）24小时未动
			 3）远距离车辆
-->
<template>
	<div class="List">
		<ul class="stateList">
		    <li class="warn_item" 
		    	v-for="(list_item,index) in listData"
		    	:key = 'index'
		    	@click="goDetail(index+1)" 
		    	v-if='list_item.islimit==1'
		    >
		    	<span>{{list_item.name}} <b>({{list_item.num}})</b></span>
		    	<span class="right_icon"><img src="../images/icon_right.png" alt="" /></span>
		    </li>
		    
		</ul>
	</div>
</template>

<script>
	import $ from 'jquery'
  import userData from '../../../../../other_modules/like-manageOrder/UserData'
  import {getOspApiUrl} from '../js/getApiUrl'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'

	export default{
		data () {
			return{
				listData:[],
		        numTotal:'',//数量
		        limitList:''//权限

			}
		},
		beforeCreate () {
			document.title = '预警列表';
		},
		created(){
		},
		destroyed(){
		
		},
		mounted () {
			dd.getLocation().then(res => {
	          	userData.save({
	            	locationsLng: res.longitude||this.$route.query.lng,
	            	locationsLat: res.latitude||this.$route.query.lat
	          	})
	          	//为了之前工单使用
	          	sessionStorage.setItem('lng',result.longitude);
				sessionStorage.setItem('lat',result.latitude);	
			}).catch(err => {
				console.log(err)
		          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
		   	});
			this.init();
	   },
		methods:{
			init(){
				var _this = this;
				//权限       list_two_four	24小时未动列表、list_city_distance	选距离车辆列表、list_car_catch	待追车列表
				var params = {
					'mobile':sessionStorage.getItem('mobile')||userData.state.mobile,
					'items':'list_two_four,list_city_distance,list_car_catch'
				}
				myAjax.post(getOspApiUrl('/permission/list'), params).then(data => {
					if(data.status==0){
						_this.limitList = data.data;
						//数量，需要分配权限，所以请求权限后请求数量
						var param = {
							'mobile':sessionStorage.getItem('mobile')||userData.state.mobile,
							'city_id':sessionStorage.getItem('city_id')||userData.state.city_ids
						}
						myAjax.post(getOspApiUrl('/car-catch/count'), param).then(res => {
							if(res.status==0){
								_this.numTotal = res.data;
								_this.listData=[{'name':'24小时待追车','num':_this.numTotal.catch,'islimit':_this.limitList.list_car_catch},{'name':'24小时未动','num':_this.numTotal.two_four,'islimit':_this.limitList.list_two_four},{'name':'远距离车辆','num':_this.numTotal.distance,'islimit':_this.limitList.list_city_distance}];
							}else{
						 		this.$_LIKE_toast(res.msg)
					 		}
						}).catch(err => {
						    console.log(err)
						})
					}else{
				 		this.$_LIKE_toast(data.msg)
			 		}
				}).catch(err => {
				    console.log(err)
				})
				
			},
     		goDetail(enter){//页面跳转
     			//清除列表页筛选等条件
				sessionStorage.removeItem('fourStatus');
				sessionStorage.removeItem('check_biz_type');
     			switch(enter){//为了后续追加页面，此处不使用default
     				case 1:
	     				window.location.href = '../manageOrder/chasingCars/earlywarning.html';
	     				break;
     				case 2:
	     				this.$router.push({
				          path:'/notMove',
				          query:{
				          }
				          
				        })
	     				break;
	     			case 3:
	     				window.location.href = '../manageOrder/chasingCars/warnIndex.html#/longDistance';
	     				break;
     			}
     			
     		}
		},
		created(){
			
		}
	}
	
	
</script>
<style scoped>
.List{
	width: 100%;
	height: 100%;
	font-size: .14rem;
	background: #FFFFFF;
	-webkit-overflow-scrolling:touch;
	position: relative;
	overflow: hidden;
}
.fc33{color: #333333;}
.fc99{color: #999999;}
.fc66{color: #666666;}
.fcec6e{color: #ec6e6e;}
.right_icon{
	display: inline-block;
	width: .17rem;
	height: .17rem;
}
.right_icon img{
	width: 100%;
	height: 100%;
}
.warn_item{
	background: #fff;
    padding:0.2rem 0.1rem;
    border-bottom: 1px solid #f6f6f6;
    display: -webkit-box;
    display: flex;
	display: -webkit-flex;
    align-items: center;
	-webkit-align-items: center;
    justify-content: space-between;
  -webkit-justify-content: space-between;
}
</style>