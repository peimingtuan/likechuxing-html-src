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
							<img src="../../image/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
							<img src="../../image/map-B.png" alt=""  v-else/>
						</span>
						<span>{{listItem.branch_name}}</span>
				</p>
			</div>
		</div>
		<!--新增上报故障类型-->
		<div class="faultwork-top">
			<p class="title">请选择上报故障类型</p>

			<p class="content">故障分类</p>
		</div>
		<!--选择上报故障类型弹层-->
		<div class="fault-type common_cover none">
			<div class="faultcontent">
				<p class="title">故障分类
					<span class="close-btn right">&#xe601;</span>
				</p>

				<div class="content">
					<p>
						<span class="choice-type none">停车费类</span>
						<span class="choice">请选择</span>
					</p>
					<!-- 一级分类-->
					<ul class="faulttype-list">

					</ul>
					<!--二级分类-->
					<ul class="faultchoice-list none">

					</ul>
				</div>
			</div>
		</div>
		<div class="creat_cont">
			<textarea class="creat_input" v-model="creatNote" id="textarea" @input="noteTxt()" placeholder="*请填写备注信息，200字以内（必填）" name="" maxlength ="200"></textarea>
			<p class="creat_txt">{{listItem.status_num==2?'当前车辆为"租赁中"状态，提交后不改变当前车辆状态':'提交后，该车的车辆状态将变为“故障”状态'}}</p>
		</div>
		<div class="creat_btn" @click="createSub()">
			<p class="crea_submit" :class="textLen==0?'subfc8':'subf33'">提交</p>
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	require('../../css/carProblemsList/createOrder.css')
	import $ from 'jquery';
import myAjax from '../../common/myAjax/withJq.js'
import getApiUrl from '../../js/getApiUrl';
	export default{
		data(){
			return{
				//假数据
				listItem:JSON.parse(sessionStorage.getItem('listItem')),//获取缓存数据
				creatNote:'',//备注信息
				textLen:0,
				isShow:false,
				msg:'',
				type_id:'',//一级分类
				cat_id:'',//二级分类
				carId:sessionStorage.getItem('car_id'),
				
			}
		},
		beforeCreate () {
			document.title = '新建故障工单';
		},
		destroyed(){
			$('html').height('100%');
			this.loaded.destroy()//清除loading
		},
		mounted () {
			$('html').height('100%');
			$('body').height('100%');
			dd.ready(function () {
				dd.biz.navigation.setTitle({
				    title : '新建故障工单',//控制标题文本，空字符串表示显示默认文本
				    onSuccess : function(result) {
				        
				    },
				    onFail : function(err) {}
				});
			});
		//上报故障类型
		//请求故障类型配置数据
		var arraymenu = [],//存储类型配置一级数据的id
				arraysecond = [],//存储类型配置的二级数据
				type_name = '';
		myAjax.post(getApiUrl('/vehicle-fault/fault-type'), {
			mobile: sessionStorage.getItem('mobile'),
			type: 2//运维上报故障类型
		}, function (data) {
			if (data.status == '0') {
				let str = '';
				for (var i = 0; i < data.data.length; i++) {
					arraymenu.push(data.data[i].id);
					arraysecond.push(data.data[i].child);
					str += '<li><span>' + data.data[i].name + '</span><img class="none" src="' + require("../../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + data.data[i].id + '"/></li>';
				}
				$(".faulttype-list").html(str);
			} else {
				this.isShow=true;
				this.msg=data.msg;
				setTimeout(()=>{this.isShow=false;},2000)
			}
		});
		//打开弹框
		$(".faultwork-top .content").on("click", function () {
			$(".fault-type").removeClass("none");
		});
		//一级菜单
		$(".faulttype-list").on("click", "li", function () {
			$(".faulttype-list li span").removeClass("font-color");
			$(".faulttype-list li img").addClass("none");
			$(this).find("span").addClass("font-color");
			$(this).find("img").removeClass("none");
			$(".choice-type").text($(this).find("span").text());
			$(".choice-type").removeClass("none");
			this.type_id = $(this).find("input").val();//一级分类id
			type_name = $(this).find("span").text();
			//获取对应的二级菜单数据
			let index = arraymenu.indexOf($(this).find("input").val());
			let str = '';
			if (arraysecond[index].length == 0) {
				$(".faultwork-top .content").text(type_name);
				$(".faultwork-top .content").addClass("bold");
				$(".faultwork-nextbtn button").addClass("submit-btn");//按钮点亮
				//关闭弹框,数据还原
				$(".fault-type").addClass("none");
				$(".choice-type").text("");
				$(".choice-type").addClass("none");
				$(".faulttype-list li span").removeClass("font-color");
				$(".faulttype-list li img").addClass("none");
				$(".faultchoice-list li span").removeClass("font-color");
				$(".faultchoice-list li img").addClass("none");
				$(".faulttype-list").removeClass("none");
				$(".faultchoice-list").addClass("none");
			} else {
				for (var i = 0; i < arraysecond[index].length; i++) {
					str += '<li><span>' + arraysecond[index][i].name + '</span><img class="none" src="' + require("../../image/faultWork/duigou.png") + '"/><input type="hidden" value="' + arraysecond[index][i].id + '"/></li>';
				}
				$(".faultchoice-list").html(str);
				//一级菜单隐藏，二级菜单显示
				$(".faulttype-list").addClass("none");
				$(".faultchoice-list").removeClass("none");
			}
		});
		//二级菜单
		$(".faultchoice-list").on("click", "li", function () {
			$(".faultwork-top .content").text(type_name + "-" + $(this).find("span").text());
			$(".faultwork-top .content").addClass("bold");
			$(".faultwork-nextbtn button").addClass("submit-btn");//按钮点亮
			this.cat_id = $(this).find("input").val();//二级分类id
			//关闭弹框,数据还原
			$(".fault-type").addClass("none");
			$(".choice-type").text("");
			$(".choice-type").addClass("none");
			$(".faulttype-list li span").removeClass("font-color");
			$(".faulttype-list li img").addClass("none");
			$(".faultchoice-list li span").removeClass("font-color");
			$(".faultchoice-list li img").addClass("none");
			$(".faulttype-list").removeClass("none");
			$(".faultchoice-list").addClass("none");
		});
		//关闭弹框,数据还原
		$(".close-btn").on("click", function () {
			$(".fault-type").addClass("none");
			$(".choice-type").text("");
			$(".choice-type").addClass("none");
			$(".faulttype-list li span").removeClass("font-color");
			$(".faulttype-list li img").addClass("none");
			$(".faultchoice-list li span").removeClass("font-color");
			$(".faultchoice-list li img").addClass("none");
			$(".faulttype-list").removeClass("none");
			$(".faultchoice-list").addClass("none");
		});
		},
		methods: {
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			createSub(){//提交
				if(this.textLen!=0){
					if (!$(".faultwork-top .content ").hasClass("bold")) {
						this.isShow=true;
						this.msg="请选择上报故障类型";
						setTimeout(()=>{this.isShow=false;},2000)
						return false;
					}
					var _this = this;
					var param = {
						'car_id':this.listItem.car_id||this.carId,
						"remark":this.creatNote,
						up_type_id: this.type_id,//上报故障类型
						up_cat_id: this.cat_id,//上报故障分类
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
				window.location.href = "../oilerSingle/carLocation.html?name="+plate_no;
			}
		}
	}
</script>

<style>
</style>