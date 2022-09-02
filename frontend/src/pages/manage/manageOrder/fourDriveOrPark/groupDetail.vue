<!--
	作者：xurui_518@163.com
	时间：2018-08-01
	描述：小组任务详情页
	1、分页加载，10条一页
-->
<template>	
	<div class="groupDetail">
		<div class="group_title">
			<p class="grode_dec">任务列表({{groupData.length}})</p>
			<p class="grode_num">
				<span class="fc99">
					任务类型：<b class="fc66">{{type==1?'紧急调离限行区':type==2?'调离限行区':type==3?'调入限行区（粤A）':'调入限行区（非粤A）'}}</b>
				</span>
				<span class="fc99">
					总车辆数：<b class="fc66">{{carNum}}</b>
				</span>
			</p>
		</div>
		<div class="group_list">
			<div class="group_item" v-for="item in groupData">
				<p class="list_dec">
					<span>{{item.name}}</span>
					<span class="fc99">车辆数
						<b class="fc66">{{item.all}}</b>
					</span>
				</p>
				<div class="groli_num">
				 	<span class="fc99">空闲(非低油)：<b class="fc66">{{item.normal}}</b></span>
				 	<span class="fc99">低油：<b class="fc66">{{item.low}}</b></span>
				 	<span class="fc99">缺油/电下线：<b class="fc66">{{item.offline}}</b></span>
				</div>
			</div>
		</div>
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
				isShow:false,//弹层提示
				msg:'',
				type:'',//调度类型入参
				groupId:'',//小组id入参
				listNum:'',//任务列表总数
				carNum:'',//车辆总数
				groupData:'',//存储列表数据

			}
		},
		beforeCreate () {
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			this.loaded= new Loading()//加载loading
			var url = window.location.href
			this.type = this.getUrl(url).type;
			this.groupId = this.getUrl(url).id;
			this.carNum = this.getUrl(url).carNum;
			
			this.init();
			
		},
		methods:{
			dingding(){
				var titles = sessionStorage.getItem('typeTitle')
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : titles+'任务详情',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
				    
				});
			},
			init(){//初始化进入页面
				setTimeout(()=>{
					console.log($('.group_title').height())
					$('.group_list').height(document.documentElement.clientHeight-$('.group_title').height()-22);
				},80)
				var param = {
					"type":this.type,
					"group":this.groupId,
					mobile:sessionStorage.getItem('mobile'),
				}
				var _this = this;
				myAjax.post(getApiUrl('/limit-line/task-detail'),param, function (data) {
					if(data.status==0){
						_this.groupData = data.data;
						_this.loaded.destroy();//清除loading
						
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
				
			},
			getUrl (linkUrl) {//截取链接
			  var str, arr, newArr, num, num2, i, j, newJson
			  if (linkUrl) {
			    str = decodeURIComponent (linkUrl.split('?')[1])
			    arr = str.split('&')
			    num = arr.length
			    newJson = {}
			    for (i = 0; i < num; i++) {
			      newArr = arr[i].split('=')
			      num2 = newArr.length
			      newJson[newArr[0]] = newArr[1]
			    }
			    return newJson
			  } else {
			    return {}
			  }
			},
		}
	}
</script>

<style>
</style>