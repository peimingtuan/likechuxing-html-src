<template>
	<div class="orderDetail is_scroll">
		<div class="status_text" v-if="!dataReady">
			正在加载...
		</div>
		<div v-else>
		<div class="list_cont move_item">
    		<div class="car_card">
				<p class="car_plat">
					<span class="fc33">{{listItem.plate_no}}</span>
					(<span class="fc33" v-show="listItem.vin">{{listItem.vin?listItem.vin.substring(listItem.vin.length-6):listItem.vin}}</span>)
					<span class="car_status">{{listItem.created_car_status_text}}</span>
				</p>
				<div>
					<span class="day_type" v-show='listItem.chengdu_limit_record==1'>
					今日限行
					</span>
					<span class="day_type2" v-show='listItem.chengdu_limit_record==2'>
						明日限行
					</span>
					<p class="fourdet_three" v-show='listItem.limit_record'>
						<span class="three_type">
							
							<span class="limit_type" 
								:class="index<2&&item.limit==0?'limit_type_green':index<2&&item.limit==1?'limit_type_red':''" 
								v-for="(item,index) in listItem.limit_record"
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
			<p class="car_dec"> 
				
				<span>
					{{listItem.brand_name}}{{listItem.model_name}}
				</span>
				<span class="car_type"  v-show="listItem.car_factory">
					{{listItem.car_factory==1?'自研':'三方'}}
				</span>
				<span class="car_color">{{listItem.color}}</span>
				<span>
					约续航{{listItem.remain_km}}公里
				</span>
			</p>
			<p class="detail_addr fc66">
				<!--条件：根据是否是成都限行或广佛限行判断是否显示，判断限行区域内非与限'rule_not':'onNo'限-->
				<span class="icon_addr">
					<img src="../images/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
					<img src="../images/map-B.png" v-else alt=""/>
				</span>
				<span>
					{{listItem.branch_name}}
					{{listItem.parking_floor}}
					{{listItem.parking_no}}
				</span>
			</p>
			<div class="status_modal">
				<div class="status_title">
					<!--待取车，使用中，已完成-->
					<p
						:class="listItem.status == 1?'move_status_zero':'move_status_two'"
					>
						<span 
							class="line_left"
							:class="listItem.status == 1?'line_left_zero':'line_left_two'"
						></span>
						{{listItem.status_name}}
					</p>
					<p class="fc66">
						ID: {{listItem.id}}
					</p>
					
				</div>
				<p class="not_time">
					<span>待挪车时长：</span>
					<span class='fc33'>
						{{listItem.last_time}}
					</span>
				</p>
				<p class="not_time">
					<span>挪车类型：</span>
					<span class='fc33'>
						{{listItem.move_type==1?'现场挪车':listItem.move_type==2?'远程开门挪车':'现场临时开门'}}
					</span>
				</p>
				
			</div>
    	</div>
    	<div class="warn_progress">
    		<p class="pro_title">
				<span>
					工单流程
				</span>
			</p>
			<div class="progress_img">
				<div class="item_img">
					<p class="pro_num">
						<img v-if="listItem.step>='2'" src="../images/icon_ok.png"/>
						<span v-else>1</span>
						
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="listItem.step>='3'" src="../images/icon_ok.png"/>
						<span v-else>2</span>
					</p>
					
				</div>
				<div class="item_txt">
					<p class="item_one">选择挪车原因及拍照</p>
					<p class="item_two">结束工单</p>
					
				</div>
			</div>
			<div class="progress_cont">
				<div class="pro_item" 
					@click="goNext(index,listItem.step)" 
					:class="[listItem.step>index+1?'fc33':listItem.step==index+1?'fc4a90':'fc99']"  
					v-for="(item,index) in proTxt"
					:key = 'index'
				>
					<span :class="index==1&&listItem.step>=3&&listItem.power_history==0?'fc99':''">{{index==0&&listItem.step>1?'1. 查看挪车原因及照片':
						item}}</span>
					<span class='arrdown'></span>
				</div>
			</div>
    	</div>
    	<div class="pro_history">
			<p class="fc33 his_title">操作历史：</p>
			<div class="his_conts fc66" 
				v-for="(items,index) in historyData"
				:key = 'index'
			>
				
				<div class="his_cont">
					<div class="hiscon_left">
						<p class="hiscon_time">{{items.time}}</p>
						<p class="his_name" >
							{{items.real_name}}
							{{items.user_name}}
						</p>
					</div>
					<div class="hiscon_right">
						<p class="fc33">{{items.operate}}</p>

					</div>
				</div>
				<p class="his_note fc33" v-show="items.remark&&items.remark.remark">备注：{{items.remark?items.remark.remark:''}}</p>
				
			</div>
		</div>
    	<div class="pro_footer">
			<p class="footer_item" 
				v-for="(item,index) in footer" 
				:key = 'index'
				@click="goBtn(index)"
			>
				{{item}}
			</p>
		</div>
		</div>
		<deleteAlert ref='dAlert' 
			:pageModal = 'pageModal'
			:modal_txt = 'modal_txt'
			:isDelete = 'isDelete'
			@subOrder = 'subOrder()'
			@cancelOrder = 'cancelOrder()'
		>	
		
		</deleteAlert>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import deleteAlert from '../component/delete'
  	import {goAjax} from '../js/ajaxCommon.js'
	
	export default{
		name:'orderDetail',
		components: {
	      SlideUpBox,
	      deleteAlert
	    },
		data(){
			return{
				order_id:this.$route.query.order_id||'',
				more_show:false,
				moreTxt:[],
				footer:['开门','锁门'],
				proTxt:['1. 选择挪车原因及拍照(现场挪车必填)','2. 结束工单'],
				listItem:{},
				pageModal:false,
				modal_txt:'',
				isDelete:false,//删除
				historyData:[],
				subType:'',
				dataReady:false
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
			this.init().then(res=>{
		     	this.listItem = res;
		   		if(res.power_history==0&&res.step>3){
		   			$('.pro_item1').removeClass('fc33').addClass('fc99')
		   		}
			}).catch(this.handleError)
		   	this.history();
		},
		methods: {
			init(){
				return myAjax.post(getOspApiUrl('/vehicle-move/order-detail'), {
					mobile:userData.state.mobile||sessionStorage.getItem('mobile'),
				    order_id:this.order_id	
				}).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
				
			},
			filterClose(){
				this.more_show = false;
			},
			goBtn(index){//底部开关门
	    		if(index==0){
	    			myAjax.post(getOspApiUrl('car/move-open-door'), {
		        		 mobile:userData.state.mobile,
					    order_id:this.order_id,
					    car_info:this.listItem.plate_no||this.listItem.vin.substring(this.listItem.vin.length-6)
					}).then(res => {
				      	this.$_LIKE_toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}else if(index==1){
	    			myAjax.post(getOspApiUrl('/car/close-door'), {
		        		 mobile:userData.state.mobile,
					    order_id:this.order_id,
					    car_info:this.listItem.plate_no||this.listItem.vin.substring(this.listItem.vin.length-6)
					}).then(res => {
				      	this.$_LIKE_toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}
	    	},
	    	goNext(index,step){//步骤
	    		switch (index){
	    			case 0:
	    				this.$router.push({//取车验车单
				          path:'/moveReason',
				          query:{
				          	move_type:this.listItem.move_type,
					        order_id:this.order_id,
					        type:this.listItem.step>1?'check':''
				          },
				        })
	    				break;
	    			default:
	    			if(this.listItem.step>=2){
	    				var choice = this.listItem.choice_floor.join(',')
	    				this.$router.push({
			          		path:'/endOrder',
			          		query:{
			          			order_id:this.order_id,
			          			branch_id:this.listItem.begin_branch_id,
			          			branch_name:this.listItem.branch_name,
			          			car_num:this.listItem.parking_no,
			          			floor_status:this.listItem.parking_floor,
			          			status_note:this.listItem.created_car_status_text,
			          			choice_floor:choice,
			          		}
			        	})
	    			}
	    				break;
	    		}
	    	},
	    	history(){//操作历史
	    		myAjax.post(getOspApiUrl('/vehicle-move/operate-history'), {
	    			 mobile:userData.state.mobile,
				    order_id:this.order_id	
				}).then(res => {
				  	if (res.status === 0) {
				  		this.historyData = res.data
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
	    	},
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
.orderDetail{
	background: #F6F6F6;
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
.list_cont{
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
	.limit_type i{
		border-radius: 3px;
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
	    padding: .06rem 0 .07rem 0;
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
	    border-radius: 0 4px 4px 0;
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
	.car_type{
		padding: 0 .06rem;
		border-left: 1px solid #CDCDCD;
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
	/*流程*/
	.warn_progress{
		background: #FFFFFF;
		margin-bottom: .1rem;
	}
	.pro_title{
		padding: .19rem .15rem 0 .11rem;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		-webkit-justify-content: space-between;
		align-items: center;
		-webkit-align-items: center;
	}
	.more_cont p {
	    height: .53rem;
	    line-height: .53rem;
	    border-top: 1px solid #f0f0f0;
	    padding: 0 .15rem;
	}
	.orderDetail /deep/ .SlideUpContainer .container .box-body{
   		padding: 0;
   	}
   	/*右箭头*/
	.arrdown {
	    display :inline-block;
	    position: relative;
	    width: 20px;
	    height: 15px;
	}
	.arrdown::after {
	    display: inline-block;
	    content: " ";
	    height: 8px;
	    width: 8px;
	    border-width: 1px 1px 0px 0px;
	    border-color: #b4b4b4;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 10px;
	    margin-top: -5px;
	}
	.pro_footer{
		padding: .1rem;
		background: #FFFFFF;
		box-shadow: 0px -3px 5px #f3f3f3;
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
	    justify-content: space-between;
	    text-align: center;
	    align-items: center;
	    display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
	}
	.pro_footer p{
		padding: .11rem 0;
		width: 48%;
		border: 1px solid #333333;
		text-align: center;
		color: #666;
	}
	.progress_img{
		text-align: center;
	    font-size: .11rem;
	    padding:.27rem .12rem .15rem .12rem;
	    border-bottom: 1px solid #F6F6F6;
	}
	.pro_num {
	    font-size: .15rem;
	    width: .25rem;
	    height: .25rem;
	    text-align: center;
	    color: #666;
	    background: #ededed;
	    border-radius: 50%;
	    line-height: .22rem;
	}
	.pro_num img{
		width: 100%;
		height: 100%;
	}
	.item_img{
		display: inline-flex;
	    justify-content: center;
	    display: -webkit-flex;
	    width: 100%;
	    display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: center;
	    padding: .1rem;
	    padding-bottom: .07rem;
	}
	.line {
	    width: 1rem;
	    height: 1px;
	    background: #e5e5e5;
	    margin: 0 .1rem;
	}
	.item_txt {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    display: -webkit-flex;
	    -webkit-align-items: center;
	   -webkit-justify-content: space-between;
	   padding: 0 .08rem;
	}
	.pro_item{
		display: flex;
	    justify-content: space-between;
	    align-items: center;
	    padding: .13rem .1rem .13rem .12rem;
	     display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
	    border-bottom: 1px solid #F6F6F6;
	}
	.pro_history{
		padding: .18rem .15rem .8rem .15rem;
		width: 100%;
		background-color: #FFFFFF;
	}
	.his_title{
		font-size: .16rem;
		padding-bottom: .09rem;
	}
	.his_cont{
		padding-top: .09rem;
		display: flex;
		display: -webkit-flex;
	}
	.hiscon_right{
		flex: 1;
		-webkit-flex: 1;
		margin-left: .18rem;
	}
	.his_name,.his_note{
		padding-top: .06rem;
	}
	.hiscon_time{
		padding-top: .01rem;
	}
	.is_scroll{
		padding-bottom: .6rem;
	}
	.if_drive{
		position: fixed;
		bottom: 0;
		height: 30%;
		width: 100%;
		display: flex;
	    justify-content: flex-start;
	    align-items: center;
	    flex-flow: column;
		
	}
	.drive_map{
		width: 1.18rem;
		height: 1.18rem;
		border-radius: 50%;
		background-color: #00aaf2;
		color: #FFF;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: .1rem;
	}
	.first_type{
		margin-top: .07rem;
	}
	.item_one{
		margin-left: .4rem;
	}
	.item_two{
		margin-right: .72rem;
	}
	.status_title{
		display: flex;
		justify-content: space-between;
		display: -webkit-flex;
		-webkit-justify-content:space-between;
		padding-right: .1rem;
	}
</style>