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
				path:'/vehicle-move/operate-history',
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
     			this.$router.push({//取车验车单
			          path:'/moveReason',
			          query:{
			          	type:'end',
			          	item_id:this.$refs.history.item_id,
			            his_id:this.$refs.history.his_id,
			            'order_id':this.$route.query.order_id
			          },
			        })
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