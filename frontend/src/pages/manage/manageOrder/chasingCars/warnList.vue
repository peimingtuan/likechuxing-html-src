<!--
	作者：xurui_518@163.com
	时间：2018-08-23
	描述：24小时未动
	1、列表入口     1）24小时待追车
			 2）24小时未动
			 3）远距离车辆
-->
<template>
	<div class="warnList">
		<ul class="stateList">
		    <li class="warn_item" v-for="(list_item,index) in listData" @click="goDetail(index+1)" v-if='list_item.islimit==1'>
		    	<span>{{list_item.name}} <b>({{list_item.num}})</b></span>
		    	<span class="right_icon"><img src="../image/icon_right.png" alt="" /></span>
		    </li>
		    
		</ul>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../common/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	import {Confirm,Toast} from '../common/LikeAlert/index'
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
			document.title = '预警列表';
		},
		mounted () {
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
					'items':'list_two_four,list_city_distance,list_car_catch'
				}
				myAjax.post(getApiUrl('/permission/list'),params,function (data) {
					if(data.status==0){
						_this.limitList = data.data;
						//数量，需要分配权限，所以请求权限后请求数量
						var param = {
							'mobile':sessionStorage.getItem('mobile'),
							'city_id':sessionStorage.getItem('city_id')
						}
						myAjax.post(getApiUrl('/car-catch/count'),param,function (data) {
							if(data.status==0){
								_this.numTotal = data.data;
								_this.listData=[{'name':'24小时待追车','num':_this.numTotal.catch,'islimit':_this.limitList.list_car_catch},{'name':'24小时未动','num':_this.numTotal.two_four,'islimit':_this.limitList.list_two_four},{'name':'远距离车辆','num':_this.numTotal.distance,'islimit':_this.limitList.list_city_distance}];
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
					    title : '预警列表',//控制标题文本，空字符串表示显示默认文本
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
     		goDetail(enter){//页面跳转
     			//清除列表页筛选等条件
				sessionStorage.removeItem('fourStatus');
				sessionStorage.removeItem('check_biz_type');
     			switch(enter){//为了后续追加页面，此处不使用default
     				case 1:
	     				window.location.href = './earlywarning.html';
	     				break;
     				case 2:
//	     				window.location.href = './warnIndex.html#/notMove';
	     				window.location.href = '../../manageOrderWarning/index.html#/notMove';

	     				break;
	     			case 3:
	     				window.location.href = './warnIndex.html#/longDistance';
	     				break;
     			}
     			
     		}
		}
	}
	
	
</script>
<style>
</style>