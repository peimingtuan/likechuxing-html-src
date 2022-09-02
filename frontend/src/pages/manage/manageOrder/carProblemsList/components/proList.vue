<!--@xurr on 081611 车辆问题列表页面
	1、列表页。分页。
-->
<template>
	<div class="proList">
		<ul class="stateList">
		    <li class="proli" 
		    	v-for="(list_item,index) in listData"
		    	:key = 'index'
		    	@click="goDetail(index+1)"
		    >
		    	<span>{{list_item}}</span>
		    	<span class="right_icon"><img src="../../image/icon_right.png" alt="" /></span>
		    </li>
		    
		</ul>
	</div>
</template>

<script>
	import $ from 'jquery';
	import myAjax from '../../common/myAjax/withJq.js'
	import Loading from '../../../../../component/loading'
	import getApiUrl from '../../js/getApiUrl';
	import authSingObj from '../../js/signature'
	export default{
		data(){
			return{
				//假数据
				listData:['后视镜有伤需立即处理','轮胎有伤需立即处理','其他有伤需立即处理','全部有伤列表']
				
			}
		},
		beforeCreate () {
			document.title = '车辆问题列表';
		},
		
		mounted () {
//			this.loaded= new Loading()//加载loading
			this.ddInit();
		},
		methods: {
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
					    title : '车辆问题列表',//控制标题文本，空字符串表示显示默认文本
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
			goDetail(type){
				window.location.href="proOrder.html#/proDetails?type="+type;
			}
		}
	}
		
</script>

<style>
</style>