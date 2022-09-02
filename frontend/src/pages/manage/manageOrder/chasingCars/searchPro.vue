<!--xurr on 180827
	搜索页面：包含历史搜索
-->
<tvueemplate>
	<div class="searchPro">
		<div class="input_cont">
			<div class="search_text">
				<!--<input  class="searchInput" autofocus="true" @input="showall()" type="search" v-model="searchWord"  placeholder="请输入网点名称或车牌号" @input="keyupall($event)">-->
				<input id="inputCont" class="searchInput" autofocus="true" type="search" v-model="searchWord"  placeholder="请输入网点名称或车牌号" @input.trim="keyupall($event)">
				<span class="input_clearn" @mousedown="clearInput($event)" v-show="isnone">
					<img src="../image/dispatch/close-btn.png" alt="" />
				</span>
			</div>
			<span @click="goBack()">取消</span>
		</div>
		<div class="history_search" v-show="history&&arr.length>0">
			<p class="search_header">
				<span class="search_title">历史搜索</span>
				<span class="icon_clearn" @click="clearnLoc()">
					<img src="../image/icon_clearn.png" alt="" />
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
			<div>
				<p class="history_item" v-for="(item,index) in fourData" data-type = 'index' @click="goDec(index,item.id,item.plate_no,item.vin,item.update_time,item.name,item.biz_type,item.lat,item.lng,item.data_type,item.branch_id,item.limit_num,item.area)">
					{{item.data_type==1?item.branch_addr:item.plate_no}}
				</p>
			</div>
			<div class="noSearch" v-show='limit'>
				<img class="icon_nosearch" src="../image/icon_nosearch.png"/>
				<p>无搜索结果</p>
			</div>	
			
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</tvueemplate>

<script>
	import $ from "jquery"
	import myAjax from '../common/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
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
				limit:false,
			}
		},
		beforeCreate () {
			document.title = '24小时未动';
		},
		mounted () {
			var url = window.location.href;
			this.enter = this.getUrl(url).catType;
			this.fourEnter = this.getUrl(url).fourEnter;
			var docTitle;
			this.enter==0?docTitle='24小时未动':docTitle='远距离车辆';
			this.enter==0?document.title = '24小时未动':document.title = '远距离车辆';
			var that = this;
			dd.ready(function () {
				dd.biz.navigation.setTitle({
				    title : docTitle,//控制标题文本，空字符串表示显示默认文本
				    onSuccess : function(result) {
				        
				    },
				    onFail : function(err) {}
				});
			})
			var that=this;
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
				this.enter==0?window.location.href = './warnIndex.html#/notMove':window.location.href = './warnIndex.html#/longDistance';
			},
			keyupall(e){//搜索结果事件
//				this.searchWord.length==1?this.searchWord='':this.searchWord = this.searchWord;
				if(this.searchWord.length>0&&this.searchWord){
				 	this.isnone = true;
				 	this.history = false;
				 	this.issucc = true;
				 }else{
				 	this.isnone = false;
				 	this.history = true;
				 	this.issucc=false;
				 }
				if(this.searchWord.length>0){
					if(!this.history||this.isHis){
						var param = {
							"mobile":sessionStorage.getItem('mobile')||'13521758602',
							'city_id':sessionStorage.getItem('city_id'),
							'lng':sessionStorage.getItem('lng')||'116.298611',		//经度
							'lat':sessionStorage.getItem('lat')||'40.044257',		//维度
							'cat_type':this.enter,//0 24小时未动   1远距离
							'kw':this.searchWord
						}
						var _this = this;
						var apiUrl = '';
						apiUrl = '/car-catch/move-dis-list';
						 myAjax.post(getApiUrl(apiUrl), param, function (data) {
						 	var result;
						 	if(data.status==0){ 
//							 		_this.issucc=true;
						 		_this.result = data.data;
						 		if(_this.result.length<=0){
						 			_this.limit = true;
						 		}else{
						 			_this.limit = false;
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
				if(data_type==0){
					this.enter==0?window.location.href = './warnIndex.html#/notMove?car_id='+resId:window.location.href ='./warnIndex.html#/longDistance?car_id='+resId
				}else{
					this.enter==0?window.location.href = './warnIndex.html#/notMove?branch_id='+branch_id:window.location.href ='./warnIndex.html#/longDistance?branch_id='+branch_id
				}
				//清除列表页筛选等条件
				sessionStorage.removeItem('fourStatus');
				sessionStorage.removeItem('check_biz_type');
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