<!--
	作者：xurui_518@163.com
	时间：2018-09-04
	描述：统计报表
	1、列表入口     1）车辆数统计
			 
-->
<template>
	<div class="formList">
		<ul class="stateList">
		    <li class="warn_item" @click="goDetail()" v-show='limitList.list_car_num_statistics==1'>
		    	<span>车辆数统计 <span v-if="numTotal.car_num_statistics&&numTotal.car_num_statistics!='-1'">({{numTotal.car_num_statistics}})</span></span>
		    	<span class="right_icon"><img src="../image/icon_right.png" alt="" /></span>
		    </li>
		    <li class="warn_item" @click="goWorkListStatisticPage()" v-show='limitList.list_car_num_statistics==1'>
		    	<span>调度/加油统计 <span v-if="numTotal.car_num_statistics&&numTotal.car_num_statistics!='-1'">({{numTotal.car_num_statistics}})</span></span>
		    	<span class="right_icon"><img src="../image/icon_right.png" alt="" /></span>
		    </li>
		</ul>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../js/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	import authSingObj from '../js/signature'

	export default{
		data () {
			return{
				listData:[],
		        numTotal:'',//数量
		        limitList:''//权限

			}
		},
		beforeCreate () {
			document.title = '统计报表';
		},
		created(){
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			this.ddInit();
			this.init();
//			this.loaded= new Loading()//加载loading
	   },
		methods:{
			init(){
				var _this = this;
				//权限       list_two_four	24小时未动列表、list_city_distance	选距离车辆列表、list_car_catch	待追车列表
				var params = {
					'mobile':sessionStorage.getItem('mobile'),
					'items':'list_car_num_statistics'
				}
				myAjax.post(getApiUrl('/permission/list'),params,function (data) {
					if(data.status==0){
						_this.limitList = data.data;
						//数量，需要分配权限，所以请求权限后请求数量
						var param = {
							'mobile':sessionStorage.getItem('mobile'),
//							'city_id':sessionStorage.getItem('city_id')
						}
						myAjax.post(getApiUrl('/statistics/menu'),param,function (data) {
							if(data.status==0){
								_this.numTotal = data.data;
							}else{
						 		_this.isShow = true;
						 		_this.msg = data.msg;
						 		setTimeout(()=>{_this.isShow=false;},2000)
					 		}
						})
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
				
			},
			ddInit() {//钉钉授权
				var urls = window.location.href
				var newUrl = urls.substr(0,urls.indexOf(location.hash));
				var that = this;
				var sign_name = authSingObj.getSign(decodeURIComponent(newUrl));
				var data = sign_name.data;
			    var url = sign_name.url;
			    var nonceStr = sign_name.nonceStr;
			    var agentId = sign_name.agentId;
			    var timeStamp = sign_name.timeStamp;
			    var corpId = sign_name.corpId;
			    var access_token = sign_name.access_token;
			    var signature = sign_name.signature;
			    //钉钉授权接口
			    dd.config({
			        agentId: agentId, // 必填，微应用ID
			        corpId: corpId,//必填，企业ID
			        timeStamp: timeStamp, // 必填，生成签名的时间戳
			        nonceStr: nonceStr, // 必填，生成签名的随机串
			        signature: signature, // 必填，签名
			        type: '0',   //选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
			        jsApiList: ['runtime.info', 'biz.contact.choose',
			            'device.notification.confirm', 'device.notification.alert',
			            'device.notification.prompt', 'biz.ding.post','biz.util.uploadImageFromCamera','biz.util.uploadImage','biz.util.previewImage',
			            'biz.util.openLink', 'biz.user.get', 'device.geolocation.get', 'biz.navigation.setLeft','biz.util.datepicker','biz.util.scan'] // 必填，需要使用的jsapi列表，注意：不要带dd。
			    });
			    dd.error(function (error) {
					console.log('dd error: ' + JSON.stringify(error));
			 		alert("钉钉授权验证失败，请关闭页面重新打开")
				});
				dd.ready(function () {
					//禁用iOS webview弹性效果
					dd.ui.webViewBounce.disable();
					dd.biz.navigation.setTitle({
					    title : '统计报表',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
				    //钉钉获取定位 钉钉浏览器内使用
				    dd.device.geolocation.get({
				        targetAccuracy: 200,
				        coordinate: 1,
				        withReGeocode: true,
				        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
				        onSuccess: function (result) {
//						        	that.loaded.destroy()//清除loading
				            sessionStorage.setItem('lng',result.longitude);
				            sessionStorage.setItem('lat',result.latitude);						
						},
						onFail: function (err) {
					            console.log(err);
					        }
				    });
				});
			},
     		goDetail(){//页面跳转
     			//清除列表页筛选等条件
     			sessionStorage.removeItem('fourStatus');
				window.location.href = './index.html#/carStatistics';
     			
			 },
			 goWorkListStatisticPage(){
				 sessionStorage.removeItem('fourStatus');
				 window.location.href = './../workListStatistics/index.html';
			 }
		}
	}
	
	
</script>
<style>
</style>