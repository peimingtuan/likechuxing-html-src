<!--@xurr on 18/06/08 车辆问题记录勾选单页面
	1、未勾选状态，提交按钮置灰；
	2、车辆外观问题分为三部分：左中右；
	3、勾选车辆转为故障状态后，提交弹窗再次确认，弹窗内备注为必填内容
-->
<template>
	<div class="proCheck">
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
							<p v-for="(left,index) in type_left" class="check_items">
								<label class="label_check"><input @click="isCheck('left'+index)" class="left_item ischeck" type="checkbox" :id="'left'+index" :value="left.id"/>
								{{ left.name }}</label>
							</p>
						</div>
						<div class="check_center">
							<p  v-for="(center,index) in type_center" class="check_items">
								<label class="label_check"><input @click="isCheck('center'+index)" class="center_item ischeck" type="checkbox" :id="'center'+index" :value="center.id"/>
								{{ center.name }}</label>
							</p>
						</div>
						<div class="check_right">
							<p  v-for="(right,index) in type_right" class="check_items">
								<label class="label_check"><input @click="isCheck('right'+index)" class="right_item ischeck" type="checkbox" :id="'right'+index" :value="right.id"/>
								{{ right.name }}</label>
							</p>
						</div>
					</div>
					
				</div>
				<div class="check_inner"><!--内饰问题-->
					<div class="check_title">
						<span class="line"></span>
						<span>内饰问题</span>
						<span class="line"></span>
						<div class="inner_content">
							<div class="inner_items" v-for="(inner,index) in innerData">
								<label class="label_check"><input @click="isCheck('inner'+index)" class="inner_item ischeck" type="checkbox" :id="'inner'+index" :value="inner.id"/>
								{{ inner.name }}</label>
							</div>
							
						</div>
						
					</div>
				</div>
				<div class="check_other"><!--其他问题-->
					<div class="check_title">
						<span class="line"></span>
						<span>其他问题类型</span>
						<span class="line"></span>
						<div class="other_content">
							<div class="other_items" v-for="(other,index) in otherData">
								<label class="label_check"><input @click="isCheck('other'+index)" class="other_item ischeck" type="checkbox" :id="'other'+index" :value="other.id"/>
								{{ other.name }}</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="is_false">
				<input @click="isRadio()" class="check_input" name="check_false" type="radio" value="cheliang"/><label>将车辆变更为故障状态</label> 
			</div><!--故障状态按钮-->
		</div>
		<div class="pro_btn"><!--提交按钮-->
			<!--<p class="all_btn" @click="isModal=true" >提交</p>-->
			<p class="all_btn" @click="submitAll()">提交</p>
		</div>
		<div class="check_modal" v-show="isModal">
			<div class="modal_content">
				<p class="modal_title">确认将车辆变更为故障状态？</p>
				<div class="text_dec">
					<input v-model="textarea1" id="textarea" placeholder="*请添加描述，200字内（必填）" name="" maxlength ="200">
				</div>
				<div class="alert_btn">
					<p class="cancel_btn" @click="cancelBtn()">
						<a>取消</a>
					</p>
					<p class="confirm_btn" @click="proConfirm()">
						<a>确认</a>
					</p>
					
				</div>
			</div>
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>
<script>
	import $ from 'jquery';
import myAjax from '../common/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	export default{
		data(){
			return{
				//假数据
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
				listItem:JSON.parse(sessionStorage.getItem('listItem')),//获取缓存数据
				car_id:sessionStorage.getItem('car_id')||'',//获取到明团存的数据
				outData:[],
				proArr:[],
			}
		},
		beforeCreate () {
			document.title = '车辆问题记录单';
		},
	
		mounted () {
			this.init();
			this.loaded= new Loading()//加载loading
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		methods: {
			init(){
				dd.ready(function () {
					dd.ui.webViewBounce.disable();
					dd.biz.navigation.setTitle({
					    title : '车辆问题记录单',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});

				})
				setTimeout(()=>{
					var btnHeight = $('.all_btn').height()
					$(".is_false").css("margin-bottom",btnHeight+17);
				},80)
				var param = {
					'car_id' : this.car_id||this.listItem.car_id
				}
				var _this = this;
				myAjax.post(getApiUrl('/vehicle-problem/problem-item'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy()//清除loading
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
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
				 		
				 	}
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
		           			"car_id":this.car_id||this.listItem.car_id,
		           			"car_parts":parts,
		           			'is_fault':0,
		           			'remark':'',//textarea1
		           			'mobile':sessionStorage.getItem('mobile')||'13521758602'//上测试后删除
		           		}
		           		this.goAjax(param)
		           }
		            //提交前需要判断备注是否填写，未填写需弹窗提示
				}
			},
			goAjax(param){
				var _this = this;
				myAjax.post(getApiUrl('/vehicle-problem/create-report'), param, function (data) {
					if(data.status==0){
						window.location.href='../oilerSingle/rentcarlist.html'
					}else{
						_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
					}
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
				console.log(this.proArr)
				if(checkes.is(":checked")){
					$(".all_btn").addClass('check_btn');
					this.gosub = true;
				}else{
					$(".all_btn").removeClass('check_btn');
					this.gosub = false;
				}
			},
			cancelBtn(){//取消按钮操作
				this.isModal=false;
				$('#textarea').val('');
				this.isShow=true;
            	this.msg='请填写备注'
            	setTimeout(()=>{this.isShow=false;},2000)
				$('.proCheck').css({'overflow-y':'scroll','overflow-x':'hidden'});
				setTimeout(()=>{
					var btnHeight = $('.all_btn').height()
					$(".is_false").css("margin-bottom",btnHeight+17);
				},80)
			},
			proConfirm(){//确认按钮的操作
		        var parts = this.proArr.join(',')
				var param = {
		           			"car_id":this.car_id||this.listItem.car_id,
		           			"car_parts":parts,
		           			'is_fault':1,
		           			'remark':this.textarea1,
		           			'mobile':sessionStorage.getItem('mobile')||'13521758602'//上测试后删除
		           		}
		           		this.goAjax(param);
			},
			isRadio(){//操作是否标记为车辆故障
				var checkInp = $('.check_input');
				this.num++;
				var even = this.num%2;
				if(even==0){
					checkInp.prop('checked',false);
					this.isAlert=false;
				}else{
					checkInp.prop('checked',true);
					this.isAlert=true;
				}
			}
				
		}
	}
</script>

<style>
</style>