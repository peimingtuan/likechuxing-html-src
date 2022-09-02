<!--
	作者：xurui_518@163.com
	时间：2018-10-18
	描述：维修工单详情
		
-->
<template>
	<div class="status_text" v-if="!dataReady">
            	加载中，请稍后...
    </div>
	<div class="orderDetail" v-else>
		<div class="order_head move_item">
    		<div class="car_card">
				<p class="car_plat">
					<span class="fc33">{{headerData.plate_no}}</span>
					(<span class="fc33" v-if="headerData.vin">{{headerData.vin.substring(headerData.vin.length-6)}}</span>)
					<span class="day_type" v-show='headerData.chengdu_limit_record==1'>
					今日限行
					</span>
					<span class="day_type2" v-show='headerData.chengdu_limit_record==2'>
						明日限行
					</span>
				</p>
				<p>ID:{{headerData.id}}</p>
			</div>
			<p class="car_dec"> 
				<span>{{headerData.status_name}}</span>
				<span>
					{{headerData.brand_name}}{{headerData.model_name}}
				</span>
				<span>
					约续航{{headerData.remain}}公里
				</span>
				<span>{{headerData.car_factory}}</span>
			</p>
			<p class="fourdet_three" v-show='headerData.limit_record'>
				<span class="three_title">
					<span>今</span>
					<span>明</span>
				</span>
				<span class="three_type">
					<span :class="item.limit==0?'is_drive':item.limit==1?'is_park':'is_stay'"  
						v-for="(item,index) in headerData.limit_record"
						:key = 'index'
					>
						{{item.limit==0?'开':item.limit==1?'停':'待'}}
					</span>
				</span>
			</p>
			
			<p class="detail_addr fc66">
				<!--条件：根据是否是成都限行或广佛限行判断是否显示，判断限行区域内非与限'rule_not':'onNo'限-->
				<span class="icon_addr">
					<img src="../images/mapb.png" alt=""  v-if='headerData.biz_type==0'/>
					<img src="../images/map-B.png" v-else alt=""/>
				</span>
				<span class="fc99">
					{{headerData.branch_name}}
				</span>
			</p>
			<p class="not_time fc99" v-if="headerData.parking_fee">
				当前预计停车费{{headerData.parking_fee}}元
			</p>
			<p class="not_time" v-if="headerData.last_time">
				<span class="fc99">处理时长：</span>
				<span class='fcec6e'>
					{{headerData.last_time}}
				</span>
			</p>
			<p class="move_note" v-if="headerData.remark">
				<span class="note_title fc99">备注：</span>
				<span class="fc66 note_con">
					{{headerData.remark}}
				</span>
			</p>
		</div>
		<div class="progress">
			<p class="pro_title">
				<span>
					工单流程
				</span>
				<span @click="more_show=true">更多</span>
			</p>
			<div class="progress_img">
				<div class="item_img">
					<p class="pro_num">
						<img v-if="headerData.step>='1'&&headerData.source=='1'&&headerData.photo_flag!='0'" src="../images/icon_ok.png"/>
						<img v-else-if="headerData.source=='2'||headerData.photo_flag=='0'" src="../images/icon_not.png"/>
						<span v-else>1</span>
						
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="headerData.step>='2'" src="../images/icon_ok.png"/>
						<span v-else>2</span>
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="headerData.step>='4'" src="../images/icon_ok.png"/>
						<img v-else-if="headerData.step=='3'" src="../images/icon_wait.png"/>
						<span v-else>3</span>
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="headerData.step>='5'" src="../images/icon_ok.png"/>
						<span v-else>4</span>
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="headerData.step>='6'" src="../images/icon_ok.png"/>
						<span v-else>5</span>
					</p>
					<p class="line"></p>
					<p class="pro_num">
						<img v-if="headerData.step>='7'" src="../images/icon_ok.png"/>
						<span v-else>6</span>
					</p>
					
				</div>
				<div class="item_txt">
					<p>取车验车</p>
					<p>维修前拍照</p>
					<p>信息录入</p>
					<p>维修后拍照</p>
					<p>还车验车</p>
					<p>停车登记</p>
				</div>
				
			</div>
			<div class="progress_cont">
				<div class="pro_item" @click="goPhoto(index,headerData.step)" :class="index==0&&headerData.step>0&&headerData.photo_flag==0?'fc99':headerData.step>index?'fc33':headerData.step==index?'fc4a90':'fc99'"  
					v-for="(item,index) in proTxt"
					:key = 'index'
				>
					<span>{{index==0&&headerData.step>0&&headerData.photo_flag==1?'1. 查看取车验车单':
						index==1&&headerData.step>1?'2. 查看维修前照片':
						index==2&&headerData.step>2?'3.1 查看维修信息':
						index==3&&headerData.step>3?'3.2 查看费用信息':
						index==4&&headerData.step>4?'4. 查看维修后照片':
						index==5&&headerData.step>5?'5. 查看还车验车单':
						item}}</span>
					<span v-if="index==0&&headerData.photo_flag==0" class='fc99'>已关闭</span>
					<span v-else class='arrdown'></span>
				</div>
			</div>
		</div>
		<div class="pro_history">
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
		<div class="pro_footer">
			<p class="footer_item" 
				v-for="(item,index) in footer"
				:key = 'index'
				@click="goBtn(index)">
				{{item}}
			</p>
		</div>
		 <SlideUpBox v-if="more_show" title="更多" ref="slideUpBox" @close="filterClose">
		 	<div class="more_cont">
		 		<p v-for='(item,index) in moreTxt' @click="goTrucking(index)">
		 			{{item}}
		 		</p>
		 	</div>
		 </SlideUpBox>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'

	export default{
		name:'orderDetail',
		 components: {
	      SlideUpBox,
	    },
		data(){
			return{
				limit_record:[
			        {'day':18,'limit':0,},
			        {'day':18,'limit':1,},
			        {'day':18,'limit':2,},
			        {'day':18,'limit':0,},
			        {'day':18,'limit':0,},
		        ],
		        proTxt:['1. 添加取车验车单',
		        '2. 维修前拍照',
		        '3.1 维修信息录入',
		        '3.2 费用信息录入',
		        '4. 维修后拍照',
		        '5. 添加还车验车单',
		        '6. 输入车位结束工单'],
				istype:1,
				footer:['开门','锁门','查询网点'],
				more_show:false,
				moreTxt:'',
				order_id:this.$route.query.order_id||'',
				historyData:[],
				headerData:[],
				dataReady:false,
				
				
			}
		},
		beforeCreate () {
			
		},
		created(){
			this.init().then(res=>{
		     	this.headerData = res;
		     	res.step>1?this.moreTxt=['1.拖车费信息','2.处理车辆问题记录','3.出场缴费，点这里']:this.moreTxt=
		     	['1.拖车费信息','2.处理车辆问题记录','3.出场缴费，点这里','4.自处理，创建故障','5.无需处理并上线'];
		   }).catch(this.handleError)
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			this.history();
		},
		methods: {
			init(){
				return myAjax.post(getOspApiUrl('/vehicle-repair/order-detail'), {
					 mobile:userData.state.mobile,
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
			goPhoto(index,step){
				if(this.headerData.step==index){
					switch(index){//为了后续追加页面，此处不使用default
	     				case 0:
		     				if(this.headerData.source!='2'||this.headerData.photo_flag==1){
			     				this.$router.push({//取车验车单
						          path:'/carParts',
						          query:{
						          	type:'0',
							        order_id:this.order_id,
						          },
						        })
			     			}
		     				break;
	     				case 1:
		     				this.$router.push({//维修前拍照
					          path:'/carParts',
					          query:{
					            istruck:'true',
					            type:'1',
					            item_id:'2',
						        order_id:this.order_id
					          },
					        })
		     				break;
		     			case 2:
			     			this.$router.push({//维修信息录入
						          path:'/serviceInfo',
						          query:{
						            type:'1',
						            item_id:'3',
						            order_id:this.order_id
						          }
						        })
		     				break;
		     			case 3:
			     			this.$router.push({//费用信息录入
						          path:'/feeInfo',
						          query:{
						            istruck:'true',
						            item_id:'4',
						            order_id:this.order_id
						          }
						        })
		     				break;
						case 4:
			     			this.$router.push({//维修后拍照
						          path:'/servicePhoto',
						          query:{
						            type:'2',
						            item_id:'5',
						            order_id:this.order_id
						          }
						        })
		     				break;
						case 5:
			     			this.$router.push({//还车验车单
						          path:'/carParts',
						          query:{
						            type:'3',
						            item_id:'6',
						            order_id:this.order_id
						          }
						        })
		     				break;
						case 6:
			     			this.$router.push({//结束工单
						          path:'/endOrder',
						          query:{
						            item_id:'7',
						            order_id:this.order_id
						          }
						        })
		     				break;
					}
				}else if(this.headerData.step>index){
					switch(index){//为了后续追加页面，此处不使用default
	     				case 0:
	     					if(this.headerData.source!='2'&&this.headerData.photo_flag==1){
			     				this.$router.push({//取车验车单
						          path:'/checkPhoto',
						          query:{
						          	type:'check',
						          	item_id:'1',
						            order_id:this.order_id
						          },
						        })
			     			}
	     					break;
	     				case 1:
		     				this.$router.push({//维修前拍照
					          path:'/checkPhoto',
					          query:{
					          	type:'check',
					          	istruck:'true',//是否展示非外观选择
					          	item_id:'2',
						        order_id:this.order_id
					          },
					        })
		     				break;
		     			case 2:
			     			this.$router.push({//维修信息录入
						          path:'/serviceInfo',
						          query:{
						          	type:'check',
						          	item_id:'3',
						        	order_id:this.order_id
						          }
						        })
		     				break;
		     			case 3:
			     			this.$router.push({//费用信息录入
						          path:'/feeInfo',
						          query:{
						            type:'check',
						            item_id:'4',
						        	order_id:this.order_id
						          }
						        })
		     				break;
						case 4:
			     			this.$router.push({//维修后拍照
						          path:'/checkPhoto',
						          query:{
						          	type:'check',
						          	item_id:'5',
						        	order_id:this.order_id
						          },
						        })
		     				break;
						case 5:
			     			this.$router.push({//还车验车单
						          path:'/checkPhoto',
						          query:{
						          	type:'check',
						          	item_id:'6',
						        	order_id:this.order_id
						          },
						        })
		     				break;
					}
				}
				
			},
			goTrucking(type){
				switch(type){
					case 0:
						this.$router.push({
				          path:'/truckingInfo',
				          query:{
				            vin:this.headerData.plate_no,
				            order_id:this.order_id,
				          }
				        })
						break;
					case 1:
						this.$router.push({
				          path:'/carProblem',
				          query:{
				            car_id:this.headerData.car_id,
				            order_id:this.order_id
				          }
				        })
						break;
					case 2:
						location.href='../manageOrder/chargeWork/charge.html#/chargepayment?type=1'
						sessionStorage.setItem('resultData',JSON.stringify(this.headerData))
						break;
					case 3:
						location.href='../manageOrder/faultWork/newbuiltfault.html?order_id='+this.order_id
						sessionStorage.setItem('resultData',JSON.stringify(this.headerData))
						break;
					case 4:
						this.$router.push({
							path:'/moreEnd',
					          query:{
					            order_id:this.order_id,
					            headerData:JSON.stringify(this.headerData)
					        }
							
						})
						break;
				}
			},
			history(){
	    		myAjax.post(getOspApiUrl('/vehicle-repair/operate-history'), {
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
	    	goBtn(index){
	    		if(index==0){
	    			myAjax.post(getOspApiUrl('/car/open-door'), {
		        		 mobile:userData.state.mobile,
					    order_id:this.order_id,
					    car_info:this.headerData.plate_no||this.headerData.vin.substring(this.headerData.vin.length-6)
					}).then(res => {
				      	this.$_LIKE_toast(res.msg)
					}).catch(err => {
					    console.log(err)
					})
	    		}else if(index==1){
	    			myAjax.post(getOspApiUrl('/car/close-door'), {
		        		 mobile:userData.state.mobile,
					    order_id:this.order_id,
					    car_info:this.headerData.plate_no||this.headerData.vin.substring(this.headerData.vin.length-6)
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
	    	
   
		}
	}
</script>

<style scoped>
	*{
   	 box-sizing: border-box;
   	}
   	.orderDetail /deep/ .SlideUpContainer .container .box-body{
   		padding: 0;
   	}
   .box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
    }
    .btn {
        width: 47%;
    }
    .fc33{
    	color: #333333;
    }
   .fc99{
   		color: #999999;
   }
   .status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
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
	.orderDetail{
		background: #F6F6F6;
	}
  	.des{
    	font-size: 13px;
  	}
  	.gray,.des{
	    color:#999;
  	}
	.order_head{
		padding: .2rem .1rem .1rem .1rem;
		background: #FFFFFF;
	}
	/*head*/
	.car_plat span:first-child{
		font-weight: 700;
	}
	.car_dec span{
		height: .36rem;
	    line-height: .36rem;
	    padding: 0 .1rem;
	    display: inline-block;
	    border: 1px solid #dcdcdc;
	    border-radius: 2px;
	    margin-right: .05rem;
	}
	.move_item{
		width: 100%;
		background: #FFFFFF;
		padding: .15rem .11rem .13rem .11rem;
		margin-bottom: .1rem;
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
	.not_time{
		padding-top: .11rem;
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
	    border-radius: 3px;
	    margin-right: .35rem;
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
	.fourdet_three{
		padding-top: .1rem;
	}
	.day_type,.day_type2{
		display: inline-block;
		padding: .03rem .06rem;
		border: 1px solid #ed3800;
		color: #ef5633;
		border-radius: 6px;
	}
	.day_type2{
		border: 1px solid #ff9500;
		color: #ff9500;
	}
	/*流程内容*/
	.progress{
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
	    justify-content: space-between;
	    display: -webkit-flex;
	    width: 100%;
	    display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: space-between;
	    padding: .1rem;
	    padding-bottom: .07rem;
	}
	.line {
	    width: .2rem;
	    height: 1px;
	    background: #e5e5e5;
	}
	.item_txt {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
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
	.more_cont p {
	    height: .53rem;
	    line-height: .53rem;
	    border-top: 1px solid #f0f0f0;
	    padding: 0 .15rem;
	}
</style>