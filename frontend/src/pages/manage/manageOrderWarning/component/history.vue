<!--
	作者：xurui_518@163.com
	时间：2018-10-24
	描述：1、工单详情/历史操作等页面
		
-->
<template>
	<div class="history">
		<div class="carpro_header">
			<div class="carpro_card">
				<p>
					<span class="fc33">{{topData.plate_no}} </span>
					<!--(<span class="fc99">{{listItem.vin.substring(0, 11)}}</span>
					<span class="fc33">{{listItem.vin.substring(11, 17)}}</span>)-->
					(<span class="fc99">{{topData.vin}}</span>
					<span class="fc33"></span>)
				</p>
				<span>ID{{topData.id}}</span>
			</div>
			<p class="carsAdd"> 
				<span>{{topData.status_text}}</span>
				<span>约续航 {{topData.remain_km}} km</span>
				<span>
					{{topData.brand_name}}{{topData.model_name}}
				</span>
			</p>
		</div>
		<div class="his_content">
			<div class="status_text" v-if="!dataReady">
            	加载中，请稍后...
    		</div>
			<div v-else class="his_item" 
				v-for="(item,index) in historyData"
				:key = 'index'
			>
				<span class="dot_line"></span>
				<span class="fc66 his_data">{{item.time}}</span>
				<div class="his_right">
					<div>
						<p>{{item.operate}}</p>
						<p class="fc99 his_name">
							<span>{{item.real_name}}</span>
							&nbsp;
							<span>{{item.user_name}}</span>
						</p>
						<p v-show="item.remark" class="fc66">
							<span class="icon_addr" v-show="item.remark.biz_type">
								<img src="../images/de-back-B.png" alt=""  v-if='item.item_id==1&&item.remark.biz_type==0'/>
								<img src="../images/de-back-B+.png" alt="" v-if='item.item_id==1&&item.remark.biz_type==1'/>
								<img src="../images/de-get-B.png" alt=""  v-if='item.item_id==5&&item.remark.biz_type==0'/>
								<img src="../images/de-get-B+.png" alt="" v-if='item.item_id==5&&item.remark.biz_type==1'/>
							</span>
							<span  v-show="item.remark.name">{{item.remark.name}}</span>
							<span :class="item.remark.name?'remark':'remarks'" v-show="item.remark.remark">
								备注：{{item.remark.remark}}
							</span>
						</p>
					</div>
					
					<p class="check" v-if="item.item_id==3&&item.remark.process_mode!=2||item.item_id==4" @click="goIndex(item.id,item.item_id)">
						<span>查看</span>
						<span class="fee_icon"></span>
					</p>
				</div>
				
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
		name:'history',
		props: {

	    	topData:{// 头部车牌信息等
		        /*default:{},
		        type:Object*/
			},
	    	hisContent:{//详情内容
		        default:{},
		        type:Object
			},
	    	path:'',
	    	hisParam:{//入参
	    		default:{},
		        type:Object
	    	}
	      	
	    },
		data(){
			return{
				historyData:[],
				dataReady:false,
				his_id:'',
				item_id:''
			}
		},
		beforeCreate () {
		},
	
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		created(){
			this.history().then(res=>{
		     	this.historyData = res
		   }).catch(this.handleError)
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
		},
		methods: {
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			history(){
				return myAjax.post(getOspApiUrl(this.path), this.hisParam).then(res => {
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
	    	},
	    	goIndex(id,item_id){
	    		this.his_id = id;
	    		this.item_id = item_id;
	    		this.$emit('goIndex');
	    		
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
	.carsAdd{
	margin-top: .15rem;
}
.carsAdd span{
	display: inline-block;
	padding: .08rem .14rem;
    border: 1px solid #cdcdcd;
    border-radius: 2px;
}
.carpro_header{
	background-color: #FFFFFF;
	padding: 0.19rem 0.16rem 0.12rem 0.12rem;
	border-bottom: 1px solid #F6F6F6;
}
.detail_addr{
	padding-top: .14rem;
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	-webkit-align-items: center;
}
.carpro_card{
	display: flex;
    justify-content: space-between;
    display: -webkit-flex;
   -webkit-justify-content: space-between;
    
}
.his_content{
	padding: .2rem .1rem;
}
.his_item{
	display: flex;
	align-items: flex-start;
	display: -webkit-flex;
	-webkit-align-items: flex-start;
	margin-bottom: .2rem;
	position: relative;
}
.dot_line{
	display: inline-block;
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background: #c9c9c9;
	margin-top: .06rem;
	margin-right: .05rem;
}
.his_data{
	margin-right: .1rem;
	width: 40%;
}
.his_right{
	width: 50%;
}
.icon_addr{
	display: inline-block;
	width: .12rem;
	height: .15rem;
}
.his_name{
	padding: .05rem 0;
}
.icon_addr img{
	width: 100%;
	height: 100%;
}
.status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
    }
.remark{
	display: inline-block;
	padding-top: .1rem;
}
.remarks{
	display: inline-block;
	padding-top: 0;
}
/*右箭头*/
	.fee_icon {
	    display :inline-block;
	    position: relative;
	    width: 10px;
	    height: 15px;
	}
	.fee_icon::after {
	    display: inline-block;
	    content: " ";
	    height: 10px;
	    width: 10px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #1490ea;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 0px;
	    margin-top: -5px;
	}
	.check{
		color: #1490ea;
		position: absolute;
		top: 0;
		right: 0;
	}
</style>