<!--
	作者：xurui_518@163.com
	时间：2018-11-6
	描述：1、处理车辆问题
		
-->
<template>
	<div class="carProblem">
		<div class="check_all">
			<div class="checkthe"><!--选框部分-->
				<div class="check_outer"><!--外观问题-->
					<p class="check_title">
						<span class="line"></span>
						<span>外观问题部位</span>
						<span class="line"></span>
					</p>
					<div class="outer_center">
						<div class="check_left">
							<p v-for="(left,index) in type_left" 
								:key = 'index'
								class="check_items"
							>
								<label class="label_check"><input @click="isCheck('left'+index)" class="left_item ischeck" type="checkbox" disabled="disabled" :id="'left'+index" :class="'part'+left.id" :value="left.id"/>
								{{ left.name }}</label>
							</p>
						</div>
						<div class="check_center">
							<p  v-for="(center,index) in type_center"
								:key = 'index'
								class="check_items"
							>
								<label class="label_check"><input @click="isCheck('center'+index)" class="center_item ischeck" type="checkbox" disabled="disabled" :id="'center'+index" :class="'part'+center.id" :value="center.id"/>
								{{ center.name }}</label>
							</p>
						</div>
						<div class="check_right">
							<p  v-for="(right,index) in type_right" 
								:key = 'index'
								class="check_items"
							>
								<label class="label_check"><input @click="isCheck('right'+index)" class="right_item ischeck" type="checkbox" disabled="disabled" :id="'right'+index" :class="'part'+right.id" :value="right.id"/>
								{{ right.name }}</label>
							</p>
						</div>
					</div>
					
				</div>
				<div class="check_inner"><!--内饰问题-->
					<p class="check_title">
						<span class="line"></span>
						<span>内饰问题</span>
						<span class="line"></span>
						<div class="inner_content">
							<p class="inner_items" 
								v-for="(inner,index) in innerData"
								:key = 'index'
							>
								<label class="label_check"><input @click="isCheck('inner'+index)" class="inner_item ischeck" type="checkbox" disabled="disabled" :id="'inner'+index" :class="'part'+inner.id" :value="inner.id"/>
								{{ inner.name }}</label>
							</p>
							
						</div>
						
					</p>
				</div>
				<div class="check_other"><!--其他问题-->
					<p class="check_title">
						<span class="line"></span>
						<span>其他问题类型</span>
						<span class="line"></span>
						<div class="other_content">
							<p class="other_items"
								v-for="(other,index) in otherData"
								:key = 'index'
							>
								<label class="label_check"><input @click="isCheck('other'+index)" class="other_item ischeck" type="checkbox" disabled="disabled" :id="'other'+index" :class="'part'+other.id" :value="other.id"/>
								{{ other.name }}</label>
							</p>
						</div>
					</p>
				</div>
			</div>
		</div>
		<div class="pro_btn"><!--提交按钮-->
			<p class="all_btn" @click="submitAll()">清楚问题部位</p>
		</div>
		
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
	export default{
		name:'carProblem',
		components: {
	    },
		data(){
			return{
				type_left:[],
				type_center:[],
				type_right:[],
				innerData:[],
				otherData:[],
				textarea1:'',//备注
				isModal:false,//弹层
				gosub:false,//是否提交
				num:'',
				isAlert:false,//提交时是否弹层
				msg:'',
				isShow:false,
				car_id:this.$route.query.car_id||'',
				outData:[],
				proArr:[],
				parts:''
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
			this.init();
			
		},
		methods: {
			init(){
				var _this = this;
				setTimeout(()=>{
					var btnHeight = $('.all_btn').height()
					$(".is_false").css("margin-bottom",btnHeight+17);
				},80)
				var param = {
					'car_id' : this.car_id,
					'mobile':sessionStorage.getItem('mobile')||userData.state.mobile
				}
				var _this = this;
				myAjax.post(getOspApiUrl('/vehicle-problem/problem-item'),param).then(data => {
				  	if (data.status === 0) {
				  		_this.typeData = data.data
						for(var i=0;i<_this.typeData.length;i++){//循环后分别分开类型
							var type = _this.typeData[i].type
							if(type==1){
								_this.outData.push(_this.typeData[i])
							}else if(type == 2) {
								_this.innerData.push(_this.typeData[i])
							}else if(type == 3){
								_this.otherData.push(_this.typeData[i])
							}
						}
		            	for(var j=0;j<_this.outData.length;j++){//循环外部问题后分为左中右
		            		var positions = _this.outData[j].position;
		            		if(positions==1){
								_this.type_left.push(_this.outData[j])
							}else if(positions == 2) {
								_this.type_center.push(_this.outData[j])
							}else if(positions == 3){
								_this.type_right.push(_this.outData[j])
							}
		            	}
						_this.updaDate = data.data.update_time;
						this.details();
			      	}else{
			      		this.$_LIKE_toast(data.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
			},
			details(){
				var param = {
					'mobile':sessionStorage.getItem('mobile')||userData.state.mobile,
					'car_id' : this.car_id
				}
				myAjax.post(getOspApiUrl('/vehicle-problem/problem-detail'),param).then(res => {
				  	if (res.status === 0) {
				  		this.parts = res.data.parts;
				  		for(var i=0;i<this.typeData.length;i++){
				  			for(var j=0;j<this.parts.length;j++){
				  				if(this.typeData[i].id == this.parts[j].part_id){
				  					$('.part'+this.parts[j].part_id).removeAttr("disabled");
				  					$('.part'+this.parts[j].part_id).parent().css("color","#333");
				  				}
				  			}
				  		}
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
			},
			submitAll(){//判断是否选中选框
				if(this.gosub){//是否有复选框选中
		           if(this.isAlert){//判断是否勾选了车辆故障
		           		this.isModal=true;
		           		$(".proCheck").css("overflow","hidden");
		           }else{
		           		this.isModal=false;
		           		var parts = this.proArr.join(',')
		           		var param = {
		           			'car_id':this.car_id,
							'car_parts':parts,
		           			'mobile':sessionStorage.getItem('mobile')||userData.state.mobile//上测试后删除
		           		}
		           		this.goAjax(param)
		           }
		            //提交前需要判断备注是否填写，未填写需弹窗提示
				}
			},
			goAjax(param){
				var _this = this;
				myAjax.post(getOspApiUrl('/vehicle-problem/deal-problem'),param).then(res => {
				  	if (res.status === 0) {
				  		this.$router.push({
				          path:'/orderDetail',
				          query:{
				            order_id:this.$route.query.order_id
				          }
				        })
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
			},
			isCheck(checkId){//判断是否选中复选框
				var checkes = $(".ischeck");
				var istrue = $('#'+checkId).is(":checked");
				if(!istrue){
					var arrIndex = this.proArr.indexOf($('#'+checkId).val());
					this.proArr.splice(arrIndex,1);
					this.gosub = true;
				}else{
					this.proArr.push($('#'+checkId).val());
					this.gosub = false;
				}
				if(checkes.is(":checked")){
					$(".all_btn").addClass('check_btn');
					this.gosub = true;
				}else{
					$(".all_btn").removeClass('check_btn');
					this.gosub = false;
				}
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
	.ischeck,.check_input{border: 1px solid #cccccc;}
	.checkthe{
		padding: .12rem;
		background: #fff;
		padding-bottom: .45rem;
	}
	/*grid,flex 布局*/
	.check_title,.check_items,.inner_items,.other_items{
		display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
	    display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
	    display: -ms-flexbox;      /* TWEENER - IE 10 */
	    display: flex;
		display: -webkit-flex;
	    justify-content: space-between;
	  -webkit-justify-content: space-between;
	    align-items: center;
		-webkit-align-items: center;
	}
	.check_items,.inner_items,.other_items{
		justify-content: flex-start;
		-webkit-justify-content: flex-start;
	}
	.check_title{
		font-size: .14rem;
	    width: 100%;
	}
	.line{/*title两边线，渐变*/
		border-top: 1px solid #DFDFDF;
		width: 35%;
		/*border-image: -webkit-linear-gradient( #f7f7f7, #DFDFDF) 30 30;
		border-image: -moz-linear-gradient( #f7f7f7, #DFDFDF) 30 30;
		border-image: linear-gradient( #f7f7f7, #DFDFDF) 30 30;*/
	}
	.outer_center,.inner_content,.other_content{
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		flex-flow: row wrap;
		-webkit-flex-flow: row wrap;
	  align-content: flex-start;
	  -webkit-align-content: flex-start;
		padding-top: .15rem;
		padding-left: .04rem;
		padding-right: .04rem;
	}
	.check_left,.check_right,.check_center{
		flex: 0 0 33%;
		-webkit-flex: 0 0 33%;
		}
	.outer_center p.check_items,.inner_items,.other_items{
		padding-bottom: .15rem;
		justify-content: flex-start;
		-webkit-justify-content: flex-start;
	}
	/*.check_items label,.inner_items label,.other_items label{margin-left: .06rem;}*/
	.is_false{
		background-color: #f6f6f6;
		padding: .16rem .11rem;
	}
	.pro_btn{
		width: 100%;
		padding: .1rem;
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		-webkit-transform: translateZ(0);
			transform: translateZ(0);
	}
	.all_btn{
		background-color: #c8c8c8;
		color: #FFFFFF;
		line-height: .43rem;
		text-align: center;
		border-radius: 2px;
	}
	.all_btn.check_btn{
		background-color: #333333;
		color: #FFFFFF;
	}
	.check_modal{
		width: 100%;
		height:100%;
		background-color: rgba(51,51,51,.7);
		color: #333333;
		z-index: 102;
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		-webkit-align-items: center;
			justify-content: center;
		-webkit-justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		overflow: hidden;
	}
	.modal_content{
		z-index: 103;
		background-color: #FFFFFF;
		width: 80%;
		height: 1.86rem;
		position: relative;
		border-radius: 3px;
	}
	.text_dec{
		display: flex;
		display: -webkit-flex;
		flex-flow: row wrap;
		align-content: flex-start;
	  -webkit-align-content: flex-start;
		padding: .16rem;
		text-align: center;
	}
	#textarea{
		width: 100%;
		height: .42rem;
		font-size: .12rem;
		color: #333333;
		border: 1px solid #f5f5f5;
		box-shadow: none;
		 -webkit-appearance: none; 
	}
	input::-webkit-input-placeholder{color:#999999;font-size: .12rem;line-height:normal;}
	.inner_items,.other_items{
		flex: 0 0 33%;
		-webkit-flex: 0 0 33%;
		padding-bottom: .15rem;
		justify-content: flex-start;
		-webkit-justify-content: flex-start;
	}
	.label_check{
		display: flex;
		display: -webkit-flex;
	    align-items: center;
		-webkit-align-items: center;
		color: #999999;
		background: #FFFFFF;
	}
	
	input[type=checkbox]:disabled  {
		display: inline-block;
		vertical-align: middle;
		width: .13rem;
		height: .13rem;
		-webkit-appearance: none;
		background-color: #666666;
		border: 1px solid #999999;
		outline: 0 !important;
		border-radius: 2px;
		color: #d8d8d8;
		opacity: .8;
		-webkit-opacity: .8;
	}
	input:disabled,input.disabled,.input[disabled]{
		height: .13rem;
		width: .13rem;
		background-color: #FFFFFF;
		color: #999999;
	}
	

</style>