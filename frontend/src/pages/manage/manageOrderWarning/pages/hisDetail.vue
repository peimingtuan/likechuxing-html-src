<!--
	作者：xurui_518@163.com
	时间：2018-10-24
	描述：1、结束页面进入工单详情
		
-->
<template>
	<div class="hisDetail">
		<history
			:topData='topData'
			:hisContent='hisContent'
			:path='path'
			:hisParam='hisParam'
			@goIndex = 'goIndex()'
			ref='history'>
			
		</history>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import history from '../component/history'
	export default{
		name:'hisDetail',
		components: {
	      history
	    },
		data(){
			return{
				topData:JSON.parse(this.$route.query.list),
				hisContent:{},
				path:'/vehicle-zombie/operate-history',
				hisParam:{//order_id前一个页面进入时带入
					'order_id':this.$route.query.order_id
				}
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
		},
		methods: {
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			goIndex(){
				var item_id = Number(this.$refs.history.item_id);
				switch(item_id){//为了后续追加页面，此处不使用default
					case 3:
			     			this.$router.push({//拖车费
						          path:'/checkDeal',
						          query:{
						          	type:'end',
						          	item_id:this.$refs.history.item_id,
						            his_id:this.$refs.history.his_id,
						            vin:this.topData.plate_no
						          },
						        })
		     				break;
						case 4:
			     			this.$router.push({//还车验车单
						          path:'/checkPhoto',
						          query:{
						          	type:'end',
						          	item_id:this.$refs.history.item_id,
						            his_id:this.$refs.history.his_id
						          },
						        })
		     				break;
						
//						case 9:
//			     			location.href='../manageOrder/chargeWork/charge.html#/checkchargepayment?type=1&his_id='+this.$refs.history.his_id
//							sessionStorage.setItem('resultData',JSON.stringify(this.topData))
//		     				break;
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
	
</style>