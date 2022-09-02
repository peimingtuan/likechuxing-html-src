<!--
	作者：xurui_518@163.com
	时间：2018-10-24
	描述：1、工单详情/历史操作等页面
		
-->
<template>
	<div class="history">
		<div class="carpro_header">
			<div class="list_cont move_item">
	    		<div class="car_card">
					<p class="car_plat">
						<span class="fc33">{{topData.plate_no}}</span>
						(<span class="fc33" v-show="topData.vin">{{topData.vin?topData.vin.substring(topData.vin.length-6):topData.vin}}</span>)
						<span class="car_status">{{topData.status_text}}</span>
					</p>
					<div>
						<span class="day_type" v-show='topData.chengdu_limit_record==1'>
						今日限行
						</span>
						<span class="day_type2" v-show='topData.chengdu_limit_record==2'>
							明日限行
						</span>
						<p class="fourdet_three" v-show='topData.limit_record'>
							<span class="three_type">
								
								<span class="limit_type" 
									:class="index<2&&item.limit==0?'limit_type_green':index<2&&item.limit==1?'limit_type_red':''" 
									v-for="(item,index) in topData.limit_record"
									:key = 'index'
								>
									<i v-show="index<2" class="limit_date">{{index==0?'今':index==1?'明':''}}</i>
									<i :class="item.limit==0?'is_drive':item.limit==1?'is_park':'is_stay'">
										{{item.limit==0?'开':item.limit==1?'停':'待'}}
									</i>
									
								</span>
							</span>
						</p>
					</div>
					
				</div>
				<div class="car_location">
					<p class="car_dec"> 
					
						<span>
							{{topData.brand_name}}{{topData.model_name}}
						</span>
						<span class="car_color">{{topData.color}}</span>
						<span>
							约续航{{topData.remain_km}}公里
						</span>
					</p>
				</div>
				<div class="status_modal">
					<div class="car_location find_time">
						<p>
							<span>发现时间：</span>
							<span class='fc33'>
								{{topData.begin_time}}
							</span>
						</p>
						<span class="car_id">ID {{topData.id}}</span>
					</div>
					
					<p class="not_time">
						<span>追车时长：</span>
						<span class='fc33'>
							{{topData.last_time}}
						</span>
					</p>
					<p class="not_time" v-show="person">
						<span>随行人员：</span>
						<span class='fc33'>
							{{person}}
						</span>
					</p>
				</div>
				<p class="move_note fc33" v-show="topData.remark">
					<span class="note_title">备注：</span>
					<span class="note_con" v-if='topData.remark'>
						{{topData.remark}}
					</span>
				</p>
	    	</div>
		</div>
		<div class="his_content">
			<div class="status_text" v-if="!dataReady">
            	加载中，请稍后...
    		</div>
			<div v-else class="his_items"
				v-for="(item,index) in historyData"
				:key = 'index'
			>
				<div class="his_item">
					<span class="dot_line"></span>
					<div class="fc66 his_data">
						<span>{{item.time}}</span>
						
					</div>
					<div class="his_right">
						<p>{{item.operate}}</p>
						
						<p class="check" v-if="item.item_id==1||item.item_id==2" @click="goIndex(item.id,item.item_id)">
							<span>查看</span>
							<span class="fee_icon"></span>
						</p>
					</div>
				</div>
				<div class="his_bottom">
					<p class="fc99 his_name">
						<span>{{item.real_name}}</span>
						<span>{{item.user_name}}</span>
					</p>
					<p v-if="item.remark||item.branch_name" class="fc66">
						<span class="icon_addr" v-if="item.branch_name||item.remark.name">
							<img src="../images/de-back-B.png" alt=""  v-if='item.item_id==3&&item.remark.biz_type==0'/>
							<img src="../images/de-back-B+.png" alt="" v-if='item.item_id==3&&item.remark.biz_type==1'/>
							<img src="../images/go_car.png" alt=""  v-if='item.item_id==1'/>
							<img src="../images/lost_car.png" alt=""  v-if='item.branch_name'/>
						</span>
						<span  v-show="item.branch_name||item.remark.name">{{item.branch_name?item.branch_name:item.remark.name}}</span>
						
					</p>
					<p v-if="item.remark"  class="fc66" :class="item.remark.name?'remark':'remarks'" v-show="item.remark.remark">
							备注：{{item.remark.remark}}
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
				item_id:'',
				person:''
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
			for(var i=0;i<this.topData.again_person.length;i++){//处理随行人员格式
		     		this.person = this.topData.again_person.length>1&&this.person.length>0?this.person+'、'+this.topData.again_person[i]:this.topData.again_person[i];
		     	}
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
	overflow: hidden;
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
}
.his_items{
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
	.first_type{
		margin-top: .07rem;
		color: #999999;
	}
	.type_one{
		margin: 0;
	}
	.his_bottom{
		padding-left: .1rem;
	}
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
	.car_card{
		display: flex;
	    align-items: center;
	    justify-content: space-between;
	   	display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
		padding-bottom: .1rem;
	}
	.is_rule{
		display: inline-block;
		width: .18rem;
		height: .18rem;
	}
	.three_title,.three_type{
		display: flex;
	}
	.three_title{
		margin-bottom: .05rem;
	}
	.is_drive,.is_park,.is_stay,.three_title span{
		  display: flex;
		  display: -webkit-flex;
	    width: .18rem;
	    height: .18rem;
	    line-height: .18rem;
	    font-size: .14rem;
	    text-align: center;
	    /*border-radius: 3px;*/
	    justify-content: center;
	    align-items: center;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	
	.is_drive{
		color: #fff;
		background-color: #b6e088;
	}
	.is_park{
		color: #fff;
		background-color: #ff8e8e;
	}
	.is_stay{
		color: #fff;
		background-color: #D2D2D2;
	}
	.day_type,.day_type2{
		display: inline-block;
		padding: .03rem .06rem;
		border: 1px solid #ed3800;
		color: #ef5633;
		border-radius: 2px;
	}
	.day_type2{
		border: 1px solid #ff9500;
		color: #ff9500;
	}
	.car_status{
		display: inline-block;
		padding: .03rem .045rem;
		border: 1px solid #CDCDCD;
		border-radius: 2px;
		
	}
	i{
		font-style: normal;
	}
	.limit_type{
		display: flex;
		margin-right: .05rem;
		border-radius: 3px;
		overflow: hidden;
	}
	.limit_date{
		display: flex;
		display: -webkit-flex;
	    width: .18rem;
	    height: .18rem;
	    line-height: .18rem;
	    font-size: .14rem;
	    text-align: center;
	    margin-right: .05rem;
	    justify-content: center;
	    align-items: center;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	.limit_type_green{
		border: 1px solid #b6e088;
	}
	.limit_type_red{
		border: 1px solid #ff8e8e;
	}
	.move_rule{
		display: flex;
		display: -webkit-flex;
		width: .18rem;
		height: .18rem;
		border-radius: 50%;
		border: 1px dotted #f84b4b;
		color: #f84b4b;
		font-size: .12rem;
		text-align: center;
		line-height: .15rem;
		background-color: #ffeded;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
		overflow: hidden;
	}
	.rule_not{
		color: #e4f4ff;
		background-color: #5cb0dc;
		border: 1px dotted #e4f4ff;
	}
	.status_modal {
	    padding: 0rem 0 .12rem 0;
	    border: 1px dashed #e6e6e6;
	    background: #fdfdfd;
	    margin-top: .12rem;
	    border-radius: 2px;
	}
	.move_status_zero{
		color: #FD5264;
	    /*border-left: 5px solid #FD5264;*/
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.move_status_one{
		color: #ffa500;
	    /*border-left: 5px solid #ffa500;*/
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.move_status_two{
		color: #666666;
	    /*border-left: 5px solid #666666;*/
	    border-radius: 2px;
	    /*padding-left: .07rem;*/
	}
	.line_left{
		display: inline-block;
	    height: .2rem;
	    width: 4px;
	    vertical-align: bottom;
	    border-radius: 0 3px 3px 0;
	    margin-right: .03rem;
	}
	.line_left_zero{
	    background: #FD5264;
	}
	.line_left_one{
	    background: #ffa500;
	}
	.line_left_two{
	    background: #666666;
	}
	.car_color{
		padding: 0 .06rem;
		border-left: 1px solid #CDCDCD;
		border-right: 1px solid #CDCDCD;
	}
	.car_dec span{
	    display: inline-block;
	    /*padding-right: .05rem;*/
	    color: #666666;
	    height: .12rem;
	    line-height: .12rem;
	}
	.status_modal .not_time{
		padding-top: .1rem;
		color: #9b9b9b;
		padding-left: .1rem;
	}
	.move_note{
		padding-top: 0.1rem;
		display: flex;
		display: -webkit-flex;
		align-items: flex-start;
		-webkit-align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		line-height: .18rem;
	}
	.note_title{
		display: inline-block;
		white-space: nowrap;
		flex: 10%;
	}
	.note_con{
		flex: 90%;
		/*margin-left: .15rem;*/
		
	}
	.car_location{
		display: flex;
	    justify-content: space-between;
	    align-items: center;
		display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    -webkit-align-items: center;
	    color: #666;
	    
	}
	.find_time{
		padding-top: .1rem;
		color: #9b9b9b;
		padding-left: .1rem;
	}
	.location_right{
		padding: 0 0 0 .06rem;
    	border-left: 1px solid #cdcdcd;
	}
	.car_id{
		margin-right: .1rem;
	}
	.guide_img{
		display: inline-block;
		width: .11rem;
		height: .17rem;
	}
	.guide_img img{
		width: 100%;
		height: 100%;
	}
	.hiscon_time{
		padding-top: .01rem;
	}
</style>