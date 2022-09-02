<!--xurr on 180614
	搜索页面：包含历史搜索
	enter=4,开四停四列表页跳入
	enter=5，开四停四地图搜索页进入
	
-->
<template>
	<div class="searchPro">
		<div class="input_cont">
			<div class="search_text">
				<!--<input  class="searchInput" autofocus="true" @input="showall()" type="search" v-model="searchWord"  placeholder="请输入网点名称或车牌号" @input="keyupall($event)">-->
				<input  class="searchInput" autofocus="true" type="search" v-model="searchWord"  :placeholder="placeh" @input="keyupall($event)">
				<span class="input_clearn" @mousedown="clearInput($event)" v-show="isnone">
					<img src="../../image/dispatch/close-btn.png" alt="" />
				</span>
			</div>
			<span @click="goBack()">取消</span>
		</div>
		<div class="history_search" v-show="history&&arr.length>0">
			<p class="search_header">
				<span class="search_title">历史搜索</span>
				<span class="icon_clearn" @click="clearnLoc()">
					<img src="../../image/icon_clearn.png" alt="" />
				</span>
			</p>
			<div class="hs_contents">
				<span  v-for="item in arr" @click="hsItem(item)">
					<span class="hs_items">
						{{item}}
					</span>
					&nbsp;&nbsp;
				</span>
			</div>
		</div>
		<div class="history_items" v-show="issucc">
			<div v-if="enter==5||enter=='chengdu'">
				<p class="history_item" v-if="enter==4||enter==5" v-for="(item,index) in fourData" data-type = 'index' @click="goDec(index,item.id,item.plate_no,item.vin,item.update_time,item.name,item.biz_type,item.lat,item.lng,item.data_type,item.branch_id,item.limit_num,item.area)">
					{{item.name}}
				</p>
				<p class="history_item" v-if="enter=='chengdu'" v-for="(item,index) in fourData" data-type = 'index' @click="goDec(index,item.id,item.plate_no,item.vin,item.update_time,item.name,item.biz_type,item.lat,item.lng,item.data_type,item.branch_id,item.limit_num,item.area)">
					{{item.data_type==1?item.name:item.plate_no}}
				</p>
			</div>
			<div v-for="(items,index) in result" v-else>
				<p class="history_item" v-for="item in items" data-type = 'index' @click="goDec(index,item.id,item.plate_no,item.vin,item.update_time,item.name,item.biz_type,item.lat,item.lng)">
					{{item.name||item.plate_no}}
				</p>
			</div>
			<div class="noSearch" v-show='islimit'>
				<img class="icon_nosearch" src="../../image/icon_nosearch.png"/>
				<p>无搜索结果</p>
			</div>	
			
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../../common/myAjax/withJq.js'
	import getApiUrl from '../../js/getApiUrl';
	export default{
		data () {
			return{
				history:true,//历史搜索展示
				searchWord:'',//输入关键字
				isnone:false,//全部清除按钮
				branch:'',//搜索数据网点
				car:'',//搜索数据车牌
				isShow:false,//toast
				msg:'',
				issucc:false,//是否请求回来数据
				result:'',//所有数据
				arr:JSON.parse(localStorage.getItem('searchWord'))||[],//历史搜索
				isHis:false,//是否是历史数据
				enter:'',//判断入口页面
				fourData:'',
				placeh:'',
				fourType:sessionStorage.getItem('type'),
				fourEnter:'',
				type:'',
				islimit:false,
			}
		},
		beforeCreate () {
			document.title = '搜索网点';
		},
		mounted () {
			var url = window.location.href;
			this.enter = this.getUrl(url).enter;
			this.fourEnter = this.getUrl(url).fourEnter;
			this.type = this.getUrl(url).type;
			this.placeh = '请输入网点名称或车牌号';
			if(this.fourEnter){
				this.placeh = '请输入网点名称'
			}
			var that = this;
			dd.ready(function () {
				dd.biz.navigation.setTitle({
				    title : '搜索网点',//控制标题文本，空字符串表示显示默认文本
				    onSuccess : function(result) {
				        
				    },
				    onFail : function(err) {}
				});
			/**********************处理返回按钮*******************/
				/*document.addEventListener('backbutton', function (e) {
		        // 在这里处理你的业务逻辑
		        	if(that.enter=='chengdu'){
		        		e.preventDefault(); //backbutton事件的默认行为是回退历史记录，如果你想阻止默认的回退行为，那么可以通过preventDefault()实现
						if(that.fourEnter=='four'){
							var type = sessionStorage.getItem('type')
							window.location.href='../CDLimit/dispatchmap.html?type='+type+'&enter=four';
						}else{
							window.location.href='../CDLimit/CDList.html#/limitIndex'
						}
				    }
			    });
			    var isTrue;
			    that.enter=='chengdu'?isTrue=true:isTrue=false;
			    dd.biz.navigation.setLeft({
			        control:isTrue ,//是否控制点击事件，true 控制，false 不控制， 默认false
			        text: '',//控制显示文本，空字符串表示显示默认文本
			        onSuccess: function (result) {
			            if(that.enter=='chengdu'){
							if(that.fourEnter&&that.fourEnter=='four'){
								var type = sessionStorage.getItem('type')
								window.location.href='../CDLimit/dispatchmap.html?type='+type+'&enter=four';
							}
							window.location.href='../CDLimit/CDList.html#/limitIndex'
							
					    }
			        },
			        onFail: function (err) {
			        }
			    });*/
				
			})
			
		},
		methods:{
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
			goBack(){
				if(this.enter==4){//开四停四
					window.location.href = '../fourDriveOrPark/fourList.html#/fourIndex'	
				}else if(this.enter==5){
					if(this.fourEnter=='four'){//开四停四地图页
						window.location.href = '../fourDriveOrPark/dispatchmap.html?type='+this.fourType+'&enter=four';
					}else{
						window.location.href = '../fourDriveOrPark/dispatchmap.html?type='+this.fourType;
					}
					
				}else if(this.enter == 'chengdu'){//成都限行
					if(this.fourEnter=='four'){
						var type = sessionStorage.getItem('type')
						window.location.href='../CDLimit/dispatchmap.html?type='+type+'&enter=four';
					}else{
						window.location.href='../CDLimit/CDList.html#/limitIndex'
					}
				}else if(this.enter==1){
					window.location.href="proOrder.html#/proDetails?type="+this.type;
				}
			},
			keyupall(e){//搜索结果事件
				if(this.searchWord.length>0){
					this.issucc=true;
				 	this.isnone = true;
				 	this.history = false;
				 }else{
				 	this.isnone = false;
				 	this.history = true;
				 	this.issucc=false;
				 }
				if(this.searchWord.length>0){
					if(!this.history||this.isHis){
						var param = {
						 	kw:this.searchWord
						}
						var _this = this;
						var apiUrl = '';
						if(this.enter==4){
							param = {//开四停四
								kw:this.searchWord,
								mobile:sessionStorage.getItem('mobile')||'13521758602',
								city_id:sessionStorage.getItem('city_id')||'',
								PhoneInfo:sessionStorage.getItem('PhoneInfo')||'',
							}
							apiUrl = '/branch-car-stock/search';
						}else if(this.enter==5){//开四停四地图
							param = {
								kw:this.searchWord,
								mobile:sessionStorage.getItem('mobile')||'13521758602',
								type:this.fourType
							}
							apiUrl = '/limit-line/search'
						}else if(this.enter=='chengdu'){
							param = {
								type:sessionStorage.getItem('type'),
								kw:this.searchWord,
								mobile:sessionStorage.getItem('mobile')||'13521758602',
							}
							if(this.fourEnter=='four'){
								param.is_map = 1
								param.lat = sessionStorage.getItem('locationsLat')
								param.lng = sessionStorage.getItem('locationsLng')
							}
							apiUrl = '/cheng-du-limit/list'
						}else{
							apiUrl = '/vehicle-problem/search'
						}
						 myAjax.post(getApiUrl(apiUrl), param, function (data) {
						 	var result;
						 	if(data.status==0){ 
						 		
						 		_this.result = data.data;
						 		if(_this.result.length<=0){
						 			_this.islimit = true;
						 		}else{
						 			_this.islimit = false;
						 		}
						 		_this.fourData = data.data;
						 		
						 	}else{
						 		_this.isShow = true;
						 		_this.msg = data.msg;
					 			setTimeout(()=>{_this.isShow=false;},2000)
						 	}
						})
					}
				}
			},
			clearInput(e){//清除按钮
				e.preventDefault();
				this.searchWord = '';
				this.history = true;
				this.isnone = false;
				this.issucc=false;
			},
			showall(){//input事件
				 if(this.searchWord.length>0){
				 	this.isnone = true;
				 	this.history = false;
				 }else{
				 	this.isnone = false;
				 	this.history = true;
				 	this.issucc=false;
				 }
			},
			goDec(resType,resId,chepai,vin,update_time,name,biz_type,lat,lng,data_type,branch_id,carNum,area){//搜索后判断类型进行页面跳转
				if(this.enter==4){//开四停四搜索
					if(resType=='branch'){
						sessionStorage.setItem('branch_id',resId);
						sessionStorage.setItem('addr',name);
						sessionStorage.setItem('biz_type',biz_type);
						sessionStorage.setItem('latdetail',lat);
		                sessionStorage.setItem('lngdetail',lng);
						window.location.href = '../fourDriveOrPark/fourList.html#/fourDetail?enter=four&enterBack=1';
					}else{
						var plate;
		            	var vins = vin.substring(11, 17)
		            	chepai?plate=chepai:plate=vins;//有车牌号传车牌，无车牌号传Vin号
		            	window.location.href = '../../manageOrderCardetail/index.html?plate_no='+plate;
					}
				}else if(this.enter==5){
					sessionStorage.setItem('branch_id',resId);
					sessionStorage.setItem('addr',name);
					sessionStorage.setItem('biz_type',biz_type);
					sessionStorage.setItem('latdetail',lat);
	                sessionStorage.setItem('lngdetail',lng);
					sessionStorage.setItem('fourMapLat',lat);
	                sessionStorage.setItem('fourMapLng',lng);
	                sessionStorage.setItem('fourMapId',resId);
					if(this.fourEnter=='four'){
						window.location.href = '../fourDriveOrPark/dispatchmap.html?type='+this.fourType+'&enter=four';
					}else{
						window.location.href = '../fourDriveOrPark/dispatchmap.html?type='+this.fourType;
					}
				}else if(this.enter=='chengdu'&&!this.fourEnter){
					if(data_type==1||data_type==2){
						sessionStorage.setItem('branch_id',branch_id);
						sessionStorage.setItem('addr',name);
						sessionStorage.setItem('biz_type',biz_type);
						sessionStorage.setItem('latdetail',lat);
		                sessionStorage.setItem('lngdetail',lng);
		                sessionStorage.setItem('area',area);
		                if(data_type==1){
		                	sessionStorage.setItem('limitNum',carNum);
							window.location.href='../CDLimit/CDList.html#/limitDetail?enter=four&kw='+name;
		                }else{
		                	sessionStorage.setItem('limitNum',1);
		                	window.location.href='../CDLimit/CDList.html#/limitDetail?enter=four&kw='+chepai;
		                }
					}else{
						var enter;
		            	var vins = vin.substring(11, 17)
		            	chepai?enter=chepai:enter=vins;//有车牌号传车牌，无车牌号传Vin号
		            	window.location.href = '../../manageOrderCardetail/index.html?plate_no='+enter;
						
					}
				}else if(this.enter=='chengdu'&&this.fourEnter=='four'){//当前是成都且是地图搜索进来的
					sessionStorage.setItem('branch_id',branch_id);
					sessionStorage.setItem('addr',name);
					sessionStorage.setItem('biz_type',biz_type);
					sessionStorage.setItem('latdetail',lat);
	                sessionStorage.setItem('lngdetail',lng);
					sessionStorage.setItem('fourMapLat',lat);
	                sessionStorage.setItem('fourMapLng',lng);
	                sessionStorage.setItem('fourMapId',branch_id);
					window.location.href = '../CDLimit/dispatchmap.html?type='+this.fourType+'&enter=four&kw='+name;
				}else{
					if(resType=='branch'){
						sessionStorage.setItem('resId',JSON.stringify(resId));
						sessionStorage.setItem('name',JSON.stringify(name));
						window.location.href = 'proOrder.html#/proDetails?type=8';
					}else{
						var listItem = {'plate_no':chepai,'vin':vin,'update_time':update_time,'car_id':resId};
						sessionStorage.setItem('listItem',JSON.stringify(listItem));
						sessionStorage.setItem('resId',JSON.stringify(resId));
						window.location.href = 'proOrder.html#/carProDetail';
					}
				}
				this.arr.push(this.searchWord);
				this.unique(this.arr)
			},
			hsItem(hsWord){//处理直接点击历史记录
				this.searchWord = hsWord;
				this.isHis = true;
				this.isnone = true;
				this.history = false;
				this.keyupall();
				
			},
			clearnLoc(){//清除历史记录
				localStorage.removeItem('searchWord');
				this.arr = [];
			},
			unique(allarr){//历史记录去重
				var res = [];
				var obj = {};
				for(var i=0; i<allarr.length; i++){
				  	if( !obj[allarr[i]] ){
				   		obj[allarr[i]] = 1;
				   		res.push(allarr[i]);
				  	}
				} 
				this.arr = res;
				localStorage.setItem('searchWord',JSON.stringify(this.arr));
			}
		}
	}
	
</script>

<style>
</style>