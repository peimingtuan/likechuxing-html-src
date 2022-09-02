<!--
	作者：xurui_518@163.com
	时间：2018-10-22
	描述：维修前拍照，维修后拍照
		
-->
<template>
	<div class="servicePhoto">
		<div class="service_photo">
			<photo 
				ref='photo'
				:allPhoto='allPhoto'
				:type = 'type'
				@photoArray = 'photoArray'
				>
			</photo>
		</div>
		<div class="creat_btn" @click="submit()">
			<p class="crea_submit fc33" :class="type==0&&length==4||type==1&&length==6?'subf33':'subfc8'">提交</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
//	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import myAjax from '../js/withJq.js'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	import photo from '../component/photo' 
	import {goAjax} from '../js/ajaxCommon.js'
	export default{
		name:'servicePhoto',
		 components: {
	      photo,
	    },
		data(){
			return{
				imageArray:[],
				length:'',
				type:this.$route.query.type,//判断入口，如果是0是取车验车，否则是1还车验车单
				allPhoto:[],
				plate:'',
				repair_list:'',
				invoice:'',
				repair_parts:[],
				is_val:'',
				item_id:this.$route.query.item_id
			}
		},
		beforeCreate () {
			
		},
		created(){
			var type = this.type
			switch(type){//0 取车验车单 1换车验车单
				case '0':
					this.$route.meta.title='取车验车单'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
					break;
				case '1':
					this.$route.meta.title='还车验车单'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
					break;
			}
		},
		mounted () {
			this.allPhoto = this.type==0?[
				{'title':'车辆左前照片','top':false},
				{'title':'车辆右前照片','top':false},
				{'title':'车辆左后照片','top':false},
				{'title':'车辆右后照片','top':false},
			]:[
				{'title':'车辆左前照片','top':false},
				{'title':'车辆右前照片','top':false},
				{'title':'车辆左后照片','top':false},
				{'title':'车辆右后照片','top':false},
				{'title':'驾驶舱前排照片','top':false},
				{'title':'驾驶舱后排照片','top':false},
			]

		},
		methods: {
			photoArray(){
				this.imageArray = this.$refs.photo.imageArray;
				this.length = this.$refs.photo.length;
				this.plate = this.$refs.photo.plate;
				this.repair_list = this.$refs.photo.repair_list;
				this.invoice = this.$refs.photo.invoice;
				this.repair_parts = this.$refs.photo.repair_parts;
				this.is_val = $('.allpho0 .image').val();
			},
			submit(){
				var imageArray = this.imageArray.toString()
				var params = {
				    	key:this.$route.query.key||'',
				    	photo_string:imageArray
				    };
				let param = {
						mobile:userData.state.mobile||'13521758602',
					    order_id:this.$route.query.order_id,
					    item_id:this.item_id,
					    params:params
				};
				if(this.type==0&&this.length==4||this.type==1&&this.length == 6){
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						window.location.href = 'index.html#/orderDetail?order_id='+this.$route.query.order_id
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}else{
					this.$_LIKE_toast('请拍照')
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
	.subf33{
		background: #333333;
	}
	.subfc8{
		background: #c8c8c8;
	}
	.truckingInfo{
		background: #F6F6F6;
	}
	.creat_btn{
		width: 100%;
		height: 0.63rem;
		position: fixed;
		bottom: 0;
		background: #FFFFFF;
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
		-moz-box-shadow: 0px -3px 5px #e7e7e7;
	    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
	    box-shadow: 0px -3px 5px #e7e7e7;
	}
	.crea_submit{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
	}
	.service_photo{
		margin-bottom: .64rem;
	}
</style>