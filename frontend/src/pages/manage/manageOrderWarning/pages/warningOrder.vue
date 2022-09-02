<template>
	<div class="warningOrder" :class="is_filter?'is_over':'is_scroll'">
		<div class="status_text" v-if="!dataReady">
			正在加载...
		</div>
		<div v-else>
		<div class="list_cont move_item">
    		<div class="car_card">
				<p class="car_plat">
					<span class="fc33">{{listItem.plate_no}}</span>
					(<span class="fc33" v-show="listItem.vin">{{listItem.vin?listItem.vin.substring(listItem.vin.length-6):listItem.vin}}</span>)
					<span class="car_status">{{listItem.status_text}}</span>
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
					层
					{{listItem.parking_no}}
					车位
				</span>
			</p>
			<p class="not_time fc66">
				<span class="icon_addr no_addr"></span>当前预计停车费
				{{listItem.park_fee}}
				元
			</p>
			<div class="status_modal">
				<p 
					:class="listItem.no_move_status == 0?'move_status_zero':listItem.no_move_status == 1?'move_status_one':'move_status_two'"
				>
					<span 
						class="line_left"
						:class="listItem.no_move_status == 0?'line_left_zero':listItem.no_move_status == 1?'line_left_one':'line_left_two'"
					></span>
					{{listItem.no_move_status_text}}
				</p>
				<p class="not_time">
					<span>里程未动时长：</span>
					<span class='fc33'>
						{{listItem.unmove_hours}}小时
					</span>
				</p>
				<p class="not_time">
					<span>处理后未动时长：</span>
					<span class='fc33' v-if="listItem.uncheck_hours">
						{{listItem.uncheck_hours}}小时
					</span>
					<span class='fc33' v-else>
						0
					</span>
				</p>
			</div>
			<p class="move_note fc33" v-show="listItem.remark">
				<span class="note_title">备注：</span>
				<span class="note_con" v-if='listItem.remark'>
					{{listItem.remark}}
				</span>
			</p>
    	</div>
    	<div class="warn_progress">
    		<p class="pro_title">
				<span>
					工单流程
				</span>
				<span v-if="is_filter" @click="driven(1)">
					删除
				</span>
				<span @click="more_show=true" v-else>
					更多
				</span>
			</p>
			<div class="progress_img">
				<div class="item_img">
					<p class="pro_num">
						<img v-if="listItem.next>='2'&&listItem.source=='1'" src="../images/icon_ok.png"/>
						<span v-else>1</span>
						
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="listItem.next>='3'" src="../images/icon_ok.png"/>
						<span v-else>2</span>
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="listItem.next>='4'" src="../images/icon_ok.png"/>
						<span v-else>3</span>
					</p>
				</div>
				<div class="item_txt">
					<p>选择处理方式</p>
					<p>还车验车</p>
					<p>结束工单</p>
				</div>
			</div>
			<div class="progress_cont" :class="is_filter?'not_filter':''">
				<div class="pro_item" 
					@click="goNext(index,listItem.next)" 
					:class="listItem.next>index+1?'fc33':listItem.next==index+1?'fc4a90':'fc99'"  
					v-for="(item,index) in proTxt"
					:key = 'index'
				>
					<span>{{index==0&&listItem.next>1?'1. 查看处理方式':
						index==1&&listItem.next>2?'2. 查看还车验车单':
						item}}</span>
					<span class='arrdown'></span>
				</div>
			</div>
    	</div>
    	<div class="pro_history" :class="is_filter?'not_filter':''">
			<p class="fc33 his_title">操作历史：</p>
			<div class="his_cont fc66" 
				v-for="(items,index) in historyData"
				:key = 'index'
			>
				<div class="hiscon_left">
					<p>{{items.time}}</p>
					<p class="his_name">{{items.real_name}}（{{items.user_name}}）</p>
				</div>
				<div class="hiscon_right">
					<p>{{items.operate}}</p>
					<p class="his_note" v-show="items.remark.remark">备注：{{items.remark.remark}}</p>
				</div>
				
			</div>
		</div>
    	<div class="pro_footer" :class="is_filter?'not_filter':''">
			<p class="footer_item" 
				v-for="(item,index) in footer" 
				:key = 'index'
				@click="goBtn(index)"
			>
				{{item}}
			</p>
		</div>
		</div>
    	<SlideUpBox v-if="more_show" title="更多" ref="slideUpBox" @close="filterClose">
		 	<div class="more_cont">
		 		<p v-for='(item,index) in moreTxt'
		 			:key = 'index'
		 			@click="goMore(index)">
		 			{{item}}
		 		</p>
		 	</div>
		 </SlideUpBox>
		<div v-show="is_filter" class="if_drive">
			<p class="drive_map" @click="driven(2)">已到网点</p>
			<p>到达当前车辆所在网点后</p>
			<p>点击“已到网点”进行后续操作</p>
		</div>
		
		<deleteAlert ref='dAlert' 
			:pageModal = 'pageModal'
			:modal_txt = 'modal_txt'
			:isDrive = 'isDrive'
			:isDelete = 'isDelete'
			:isOne = 'isOne'
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
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	export default{
		name:'warningOrder',
		components: {
	      SlideUpBox,
	      deleteAlert
	    },
		data(){
			return{
				order_id:this.$route.query.order_id||'',
				more_show:false,
				moreTxt:['1.新建故障工单，点这里！','2.出场缴费，点这里！'],
				footer:['开门','锁门','查询网点'],
				proTxt:['1. 选择处理方式',
		        '2. 添加还车验车单',
		        '3. 输入车位结束工单',
		        ],
				listItem:{},
				 is_filter:'',//是否有高斯模糊效果
				 pageModal:false,
				 modal_txt:'',
				 isDrive:false,//到达网点
				 isDelete:false,//删除
				 isOne:false,//是否行使1公里
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
		     	this.is_filter = this.listItem.next>0?false:true;
		     	if(this.is_filter){
		     		$('body').css('overflow','hidden');
		     	}
		   	}).catch(this.handleError)
		   	this.history();
		},
		methods: {
			init(){
				return myAjax.post(getOspApiUrl('/vehicle-zombie/order-detail'), {
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
	    			myAjax.post(getOspApiUrl('/car/open-door'), {
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
	    		}else if(index==2){
	    			this.$router.push({
			          path:'/serviceMap',
			          query:{
			            order_id:this.order_id,
			            type:'2'
			          }
			        })
	    		}
	    	},
	    	driven(type){//已到网点，判断是否在一公里内  type=1，删除     type=2，已到网点  type=3，还车验车判断是否行使1公里
	    		this.pageModal = true;
	    		switch (type){
	    			case 1:
	    				this.isDelete = true;
	    				this.modal_txt = '是否删除预警工单？'
	    				break;
	    			case 2:
						this.driverBtn();
	    				break;
	    			case 3:
	    				this.oneDrive();
	    			    break;
	    		}
	    	},
	    	oneDrive(){
	    		myAjax.post(getOspApiUrl('/vehicle-zombie/check-km'), {
	        		 mobile:userData.state.mobile,
				    order_id:this.order_id,
				}).then(res => {
					if(res.status==1){
			      		this.isOne = true;
	    				this.modal_txt = '车辆行驶里程未达到1公里，请检查车机或调故障！'
					}else{
						this.$router.push({
			          		path:'/carParts',
			          		query:{
	    						order_id:this.order_id,
	    						photo_flag:this.listItem.photo_flag
			          		}
			        	})
					}
				}).catch(err => {
				    console.log(err)
				})
	    	},
	    	driverBtn(){
	    		dd.getLocation().then(res => {
		          	userData.save({
		            	locationsLng: res.longitude||this.$route.query.lng,
		            	locationsLat: res.latitude||this.$route.query.lat
		          	})
		    		var param = {
							mobile:userData.state.mobile,
						    order_id:this.$route.query.order_id,
						    item_id:'2',
						    params:{
						    	'lng':userData.state.locationsLng||sessionStorage.getItem('lng'),		//经度
								'lat':userData.state.locationsLat||sessionStorage.getItem('lat'),
						    }
					};
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						//如果已到达网点位置，模糊消失
		    			this.is_filter = false;
		    			this.isDrive = false;
		    			this.pageModal = false;
		    			$('body').css('overflow','auto');
		    			window.location.reload();
					}else if(isajax.status == 10013){
						this.$_LIKE_toast(isajax.msg)
					}else{
						this.isDrive = true;
						this.modal_txt = isajax.msg;
					}
				}).catch(err => {
			          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
			   	});
	    	},
	    	subOrder(){
	    		if(this.$refs.dAlert.subType==1){
	    			myAjax.post(getOspApiUrl('/vehicle-zombie/del'), {
	    				mobile:userData.state.mobile,
					    id:this.order_id	
					}).then(res => {
					  	if (res.status === 0) {
					  		this.pageModal = false;
					  		this.isDelete = false;
					  		window.location.href = '../manageOrderCardetail/index.html?plate_no='+this.listItem.plate_no;
				      	}else{
				      		this.$_LIKE_toast(res.msg)
				      	}
					}).catch(err => {
					    console.log(err)
					})
	    		}else{
	    			this.pageModal = false;
	    			this.isDelete = false;
		    		this.isDrive = false;
		    		this.isOne = false;
	    		}
	    	},
	    	cancelOrder(){
	    		this.pageModal = false;
	    		this.isDelete = false;
	    		this.isDrive = false;
	    		this.isOne = false;
	    	},
	    	goNext(index,step){
	    		if(!this.is_filter){
		    		switch (index){
		    			case 0:
		    			if(this.listItem.next==1){
		    				this.$router.push({
		    					path:'/checkDeal',
		    					query:{
		    						order_id:this.order_id,
		    						list:JSON.stringify(this.listItem),
						        }
		    				})
		    			}else if(this.listItem.next>1){
		    				this.$router.push({
		    					path:'/checkDeal',
		    					query:{
		    						type:'check',
		    						order_id:this.order_id,
		    						item_id:'3',
		    						list:JSON.stringify(this.listItem),
						        }
		    				})
		    			}
		    				break;
		    			case 1:
		    			if(this.listItem.next==2){
		    				this.driven(3);
		    			}else if(this.listItem.next>2){
		    				this.$router.push({//取车验车单
						          path:'/checkPhoto',
						          query:{
						          	type:'check',
						          	item_id:'4',
						            order_id:this.order_id
						          },
						        })
		    			}
		    				break;
		    			default:
		    			if(this.listItem.next==3){
		    				this.$router.push({
				          		path:'/endOrder',
				          		query:{
				          			order_id:this.order_id,
				          			branch_id:this.listItem.branch_id,
				          			branch_name:this.listItem.branch_name,
				          			car_num:this.listItem.parking_no,
				          			floor_status:this.listItem.parking_floor
				          		}
				        	})
		    			}
		    				break;
		    		}
		    	}
	    	},
	    	goMore(index){
	    		switch (index){
		    		case 1:
	    				location.href='../manageOrder/chargeWork/charge.html#/chargepayment?type=2'
						sessionStorage.setItem('resultData',JSON.stringify(this.listItem))
						break;
					case 0:
						location.href='../manageOrder/faultWork/newbuiltfault.html?warn_id='+this.order_id
						sessionStorage.setItem('resultData',JSON.stringify(this.listItem))
						break;
				}
	    	},
	    	history(){
	    		myAjax.post(getOspApiUrl('/vehicle-zombie/operate-history'), {
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
.warningOrder{
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
	    padding: .06rem 0 .18rem 0;
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
	.warningOrder /deep/ .SlideUpContainer .container .box-body{
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
	    height: 10px;
	    width: 10px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #b4b4b4;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 10px;
	    margin-top: -10px;
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
		width: 31%;
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
	    width: .52rem;
	    height: 1px;
	    background: #e5e5e5;
	    margin: 0 .1rem;
	}
	.item_txt {
	    display: flex;
	    align-items: center;
	}
	.item_txt p:first-child{
		width: 33%;
		text-align: right;
	}
	.item_txt p:nth-child(2){
		width: 24.5%;
		text-align: right;
	}
	.item_txt p:last-child{
		width: 42%;
		text-align: center;
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
	.not_filter{
		filter: blur(4px);
		-webkit-filter: blur(4px);
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
</style>