<!--
	作者：xurui_518@163.com
	时间：2018-06-21
	描述：1、新建故障工单页面   ，备注未输入时，提交按钮置灰；
	2、提交后跳到车辆问题记录单列表页
		
-->
<template>
	<div class="createOrder">
		<div class="carpro_header">
			<p class="carpro_card">
				<span class="fc33">{{listItem.plate_no}} </span>(<span class="fc99">{{listItem.vin.substring(0, 11)}}</span>
				<span class="fc33">{{listItem.vin.substring(11, 17)}}</span>)
			</p>
			<p class="carsAdd"> 
				<span>{{ listItem.status_name }}</span>
				<span>约续航 {{ listItem.remain}} 公里</span>
				<span>
					{{listItem.brand_name}}{{ listItem.model_name }}
				</span>
			</p>
			<div class="carpro_date">
				<p class="detail_addr fc66" @click="goMap(listItem.plate_no)">
						<span class="icon_addr">
							<img src="../images/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
							<img src="../images/map-B.png" alt=""  v-else/>
						</span>
						<span>{{listItem.branch_name}}</span>
				</p>
			</div>
		</div>
		<div class="creat_cont">
			<p class="creat_txt">提交后，该车的车辆状态将变为“故障”状态</p>
			<textarea class="creat_input" v-model="creatNote" id="textarea" @input="noteTxt()" placeholder="*请填写备注信息，200字以内（必填）" name="" maxlength ="200"></textarea>
		</div>
		<div class="creat_btn" @click="createSub()">
			<p class="crea_submit" :class="textLen==0?'subfc8':'subf33'">提交</p>
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from 'jquery';
import myAjax from '../common/myAjax/withJq.js'
import getApiUrl from '../js/getApiUrl';
	export default{
		data(){
			return{
				//假数据
				listItem:JSON.parse(sessionStorage.getItem('listItem')),//获取缓存数据
				creatNote:'',//备注信息
				textLen:0,
				isShow:false,
				msg:'',
				carId:sessionStorage.getItem('car_id'),
				
			}
		},
		beforeCreate () {
			document.title = '新建故障工单';
		},
	
		mounted () {
			dd.ready(function () {
				dd.biz.navigation.setTitle({
				    title : '新建故障工单',//控制标题文本，空字符串表示显示默认文本
				    onSuccess : function(result) {
				        
				    },
				    onFail : function(err) {}
				});
			})
		},
		methods: {
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			createSub(){//提交
				if(this.textLen!=0){
					var _this = this;
					var param = {
						'car_id':this.listItem.car_id||this.carId,
						"remark":this.creatNote,
						'mobile':sessionStorage.getItem('mobile')||'13521758602'//上测试后删除
					}
					myAjax.post(getApiUrl('/vehicle-problem/create-fault-order'), param, function (data) {
						if(data.status==0){
//							sessionStorage.setItem('order_id',)
							window.location.href = 'proOrder.html#/proDetails'//跳转到车辆问题列表页
							
						}else{
							_this.isShow = true;
					 		_this.msg = data.msg;
					 		setTimeout(()=>{_this.isShow=false;},2000)
						}
					})
				}
			},
			goMap(plate_no){//去地图
				window.location.href = "../manageOrder/oilerSingle/carLocation.html?name="+plate_no;
			}
		}
	}
</script>

<style>
</style>