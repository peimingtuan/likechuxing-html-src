<!--
	作者：xurui_518@163.com
	时间：2018-12-27
	描述：1、新建挪车工单
		
-->
<template>
	<div class="newMove">
		<div class="list_cont move_item">
        		<div class="car_card">
					<p class="car_plat">
						<span class="fc33">{{listItem.plate_no}}</span>
						(<span class="fc33" v-show="listItem.vin">{{listItem.vin.length>6?listItem.vin.substring(listItem.vin.length-6):listItem.vin}}</span>)
						<span class="car_status">{{listItem.status_name}}</span>
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
						{{listItem.brand_name}}
					</span>
					<span class="car_color">{{listItem.color}}</span>
					<span>
						约续航{{listItem.remain_km}}公里
					</span>
				</p>
				<p class="detail_addr fc66">
					<span class="icon_addr">
						<img src="../images/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
						<img src="../images/map-B.png" v-else alt=""/>
					</span>
					<span>
						{{listItem.branch_addr}}
						{{listItem.parking_floor}}
						{{listItem.parking_no}}
					</span>
				</p>
				<p class="not_time fc66" v-show="listItem.park_fee">
					<span class="icon_addr no_addr"></span>当前预计停车费
					{{listItem.park_fee}}
					元
				</p>
    	</div>
    	<div class="truck_type">
    		<p><span class="fcfe">*</span>请选择挪车类型：</p>
    		<div>
    			<p class="sort_item" 
					:id="'sort'+sortItem.sortType" 
					v-for="(sortItem,index) in sorts"
					:key = 'index'
					@click="sortCheck(sortItem.sortType,$event)">
					<span class="sort_icon" v-if="sort_type==sortItem.sortType">
						<img src="../images/icon_duigou.png" alt="" />
					</span>
					<i class="icon_no" v-else></i>
					<span  class="sort_own" :class="sort_type==sortItem.sortType?'is_sort':'no_sort'">{{sortItem.sortCont}}</span>
					
				</p>
    			
    		</div>
    	</div>
		<div class="creat_cont">
			<span class="fcfe">*</span>请输入挪车备注：
			<div class="text_area">
				<textarea class="creat_input" 
					v-model="creatNote" 
					id="textarea" 
					@input="noteTxt()" 
					name="" 
					maxlength ="100"
					placeholder="请输入备注信息，100字以内"
				>
				</textarea>
				<span class="right_num">
					{{textLen}}/100
				</span>
			</div>
			
		</div>
		<div class="creat_btn">
			<p class="crea_submit" :class="textLen>0&&sort_type?'subf33':'subfc8'" @click="createSub()">提交</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../js/withJq.js'
//	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	
	export default{
		data(){
			return{
				creatNote:'',//备注信息
				textLen:0,
				isShow:false,
				car_id:this.$route.query.car_id,
				listItem:JSON.parse(sessionStorage.getItem('resultData')),
				listData:JSON.parse(sessionStorage.getItem('resultData')),
				num:'0',
				personId:[],
				feeType:'',
				sort_show:false,
		        sorts:[
					{"sortCont":"现场挪车",'sortType':'1'},
					{"sortCont":"远程开门挪车",'sortType':'2'},
					{"sortCont":"现场临时开门",'sortType':'3'},
				],
				sort_type:'',
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
			this.textLen = $('#textarea').val().length;
		},
		methods: {
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length<100?$('#textarea').val().length:100;
			},
			typeRadio(type){
				this.feeType = type;
			},
			sortCheck(sortType,e){
				this.sort_type=this.sort_type==sortType?'':sortType;
	      	},
			createSub(){//提交
				if(this.textLen>0&&this.sort_type){
					var param={
					    car_id: this.car_id,
					    params:{
					    	move_type:this.sort_type,
					    	branch_id:this.listData.branch_id,
					    	remark:this.creatNote||'',
					    },
					    mobile:userData.state.mobile,}
					this.goAjax(param)
				}
			},
			handleError(err){
		        if(err && err.msg){
		          this.$_LIKE_toast(err.msg)
		        }else{
		          console.log(err)
		        }
	      	},
	      	goAjax(param){
				var _this = this;
				myAjax.post(getOspApiUrl('/vehicle-move/create-order'), param, function (data) {
					if(data.status==0){
						_this.$router.push({
			          		path:'/orderDetail',
							query:{
								order_id:data.data.id
							}
							
			        	})
					}else{
						_this.$_LIKE_toast(data.msg)
					}
				})
			},
		},
		created(){
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
	.fcfe{
		color: #fe7c8a;
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
.newWarning{
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
.creat_cont{
	padding: 0.13rem 0.1rem;
	background: #FFFFFF;
}
textarea{
	/*border: 1px solid #C1C1C1!important;*/  
	border: none!important;  
	font-size: .14rem;
	 resize:none
}
.creat_input#textarea{
	height: 0.83rem;
	background: #F7F7F7;
	width: 100%;
	padding: .1rem;
    box-sizing: border-box;
    -webkit-appearance: none;
    /*border-radius: 2px;*/
}
.creat_input#textarea::-webkit-input-placeholder{
	font-size: .14rem;
}
.creat_txt{
	font-size: .15rem;
	color: #333333;
	padding-bottom: 0.16rem;
	padding-top: .1rem;
	padding-left: .1rem;
	margin-bottom: .63rem;
}
.creat_btn{
	width: 100%;
	height: 0.63rem;
	position: absolute;
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
	color: #FFFFFF;
	padding: 0.15rem;
	text-align: center;
	border-radius: 2px;
	background: #c8c8c8;
}
.subf33{
	background: #333333;
}
.subfc8{
	background: #c8c8c8;
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
.list_cont{
		background-color: #FFFFFF;
		padding: 0.14rem 0.1rem 0.1rem 0.1rem;
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
	    border-left: 5px solid #FD5264;
	    border-radius: 2px;
	    padding-left: .07rem;
	}
	.move_status_one{
		color: #ffa500;
	    border-left: 5px solid ffa500;
	    border-radius: 2px;
	    padding-left: .07rem;
	}
	.move_status_two{
		color: #666666;
	    border-left: 5px solid #666666;
	    border-radius: 2px;
	    padding-left: .07rem;
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
	.truck_type{
  		padding: .19rem .1rem;
  		margin: .1rem 0;
  		background: #FFFFFF;
  	}
  	.fee_radio{
  		display: inline-flex;
	    justify-content: center;
	    align-items: center;
  		display: -webkit-inline-flex;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	    margin-right: .1rem;
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
	.text_area{
		background: #F7F7F7;
    	border: 1px solid #C1C1C1;
		margin-top: .15rem;
	}
	.right_num{
		display: inline-block;
		width: 100%;
		padding-right: .1rem;
		text-align: right;
		color: #999;
	}
	.is_sort{
		color: #44a8ec;
	}
	.no_sort{
		color: #333333;
	}
	.sort_icon{
		display: inline-flex;
		width: .15rem;
		height: .15rem;
		margin-right: .07rem;
	}
	.sort_icon img{
		width: 100%;
		height: 100%;
	}
	.icon_no{
		display: inline-block;
		width: .15rem;
		height: .15rem;
		background: #FFFFFF;
		border: 1px solid #D8D8D8;
		border-radius: 50%;
		margin-right: .07rem;
	}
	.sort_item{
		display: flex;
		align-items: center;
		display: -webkit-flex;
		-webkit-align-items: center;
		margin-top: .18rem;
	}
</style>