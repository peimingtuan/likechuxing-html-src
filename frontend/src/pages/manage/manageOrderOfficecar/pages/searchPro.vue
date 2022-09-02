<!--xurr on 180827
	搜索页面：包含历史搜索
	enter为1时是我的工单搜索进来的
	
-->
<template>
	<div class="searchPro">
		<div class="input_cont">
			<div class="search_text">
				<input id="inputCont" 
					class="searchInput"
					autofocus="true"
					type="search" 
					v-model="searchWord"  
					:placeholder="enter==1?'请输入车牌号和vin号':'请输入网点名称或车牌号'" 
					@input="keyupall($event)">
				<span class="input_clearn" 
					@mousedown="clearInput($event)" 
					v-show="isnone">
					<img src="../images/close-btn.png" alt="" />
				</span>
			</div>
			<span @click="goBack()">取消</span>
		</div>
		<div class="history_search" 
			v-show="history&&arr.length>0">
			<p class="search_header">
				<span class="search_title">历史搜索</span>
				<span class="icon_clearn" @click="clearnLoc()">
					<img src="../images/icon_clearn.png" alt="" />
				</span>
			</p>
			<div class="hs_contents">
				<span  v-for="(item,index) in arr"
					:key = 'index'
					@click="hsItem(item)">
					<span class="hs_items">
						{{item}}
					</span>
					&nbsp;&nbsp;
				</span>
			</div>
		</div>
		<div class="history_items" v-show="issucc">
			<div v-if="enter!=1">
				<p class="history_item" 
					v-for="(item,index) in fourData" 
					:key = 'index'
					data-type = 'index' 
					@click="goDec(index,item.id,item.name,item.plate_no)">
					{{item.name||item.plate_no}}
				</p>
			</div>
			<div v-else>
				<p class="history_item" 
					v-for="(item,index) in result" 
					:key = 'index'
					data-type = 'index' 
					@click="goMy(index,item.id,item.name,item.plate_no)">
					{{item.plate_no}}（{{item.vin}}）
				</p>
			</div>
			<div class="noSearch" v-show='limit'>
				<img class="icon_nosearch" src="../images/icon_nosearch.png"/>
				<p>无搜索结果</p>
			</div>	
			
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from "jquery"
	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	
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
				arr:[],//历史搜索
				isHis:false,//是否是历史数据
				enter:this.$route.query.enter||'',//判断入口页面1是我的工单入口
				fourData:'',
				placeh:'',
				fourType:sessionStorage.getItem('type'),
				fourEnter:'',
				limit:false,
			}
		},
		beforeCreate () {
			document.title = '搜索';
		},
		mounted () {
			if(localStorage.getItem('searchWord')||localStorage.getItem('mySearch')){
				this.enter!=1?this.arr = JSON.parse(localStorage.getItem('searchWord')):JSON.parse(localStorage.getItem('mySearch'))
			}
			var url = window.location.href;
			var that = this;
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
				if(this.enter==1){
					this.$router.push({
			          path:'/myList'
			        })
				}else{
					this.$router.push({
			          path:'/list'
			        })
				}
			},
			keyupall(e){//搜索结果事件
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
						var param;
						this.enter==1?param = {
			            	"mobile":userData.state.mobile||sessionStorage.getItem('mobile'),
							'lng':sessionStorage.getItem('lng')||userData.state.locationsLng,		//经度
							'lat':sessionStorage.getItem('lat')||userData.state.locationsLat,		//维度
							'is_main':1,
							'plate_no':this.searchWord,
						}
						:param = {
							mobile:userData.state.mobile,
							kw:this.searchWord,
					}
					if(userData.state.city_ids){
						param.city_id=userData.state.city_ids
					}
						var _this = this;
						var apiUrl = '';
						apiUrl = this.enter==1?'/vehicle-office/order-list':'/vehicle-problem/search';
						 myAjax.post(getOspApiUrl(apiUrl), param).then(data=> {
						 	var result;
						 	if(data.status==0){ 
						 		_this.result = data.data;
						 		_this.fourData = [];
						 		if(_this.result.length<=0){
						 			_this.limit = true;
						 		}else{
						 			_this.limit = false;
						 		}
						 		if(data.data.branch){
						 			_this.fourData = data.data.branch;
						 		}
						 		if(data.data.car){
							 		for(var i=0;i<data.data.car.length;i++){
							 			_this.fourData.push(data.data.car[i]);
							 		}
						 		}
						 	}else{
						 		this.$_LIKE_toast(data.msg)
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
			goDec(index,id,branch_name,plate_no){//搜索后判断类型进行页面跳转
				//清除列表页筛选等条件
				
				this.arr.push(this.searchWord);
				this.unique(this.arr);
				if(plate_no){
					myAjax.post(getOspApiUrl('/branch-car-stock/search-car-info'), {
						car_id:id,
						type:'7'
						
					}).then(data=> {
					 	if(data.status==0){ 
					 		if(data.data.work_order_id>0){
					 			this.$router.push({
						          path:'/list',
						          query:{
						          	car_id:data.data.car_id
						          }
						        })
					 		}else{
					 			window.location.href = '../manageOrderCardetail/index.html?plate_no='+plate_no;
					 		}
					 	}else{
					 		this.$_LIKE_toast(data.msg)
					 	}
					})
				}else if(branch_name){
					myAjax.post(getOspApiUrl('/branch-car-stock/search-branch-info'), {
						branch_id:id,
						type:'7'
					}).then(data=> {
					 	if(data.status==0){
					 		if(data.data.car_id){
					 			this.$router.push({
						          path:'/list',
						          query:{
						          	car_id:data.data.car_id
						          }
						        })
					 		}else{
					 			this.$router.push({
						          path:'/list',
						          query:{
						          	list:'0'
						          }
						        })
					 		}
					 		
					 	}else{
					 		this.$_LIKE_toast(data.msg)
					 	}
					})
				}
				
				
				
//				this.$route.query.show_type=='0'?this.$router.push('/list'):this.$router.push('/disMap')
				
			},
			goMy(index,id,branch_name,plate_no){
				//清除列表页筛选等条件
				this.arr.push(this.searchWord);
				this.unique(this.arr);
				this.$router.push({
		          path:'/myList',
		          query:{
		          	plate_no:plate_no
		          }
		        })
			},
			hsItem(hsWord){//处理直接点击历史记录
				this.searchWord = hsWord;
				this.isHis = true;
				this.isnone = true;
				this.history = false;
				this.keyupall();
				
			},
			clearnLoc(){//清除历史记录
				this.enter!=1?localStorage.removeItem('searchWord')
				:localStorage.removeItem('mySearch');
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
				this.enter!=1?localStorage.setItem('searchWord',JSON.stringify(this.arr))
				:localStorage.setItem('mySearch',JSON.stringify(this.arr));
			}
		}
	}
	
</script>

<style scoped>
	/*搜索样式*/
	*{
		box-sizing: border-box;
	}
	input, select, textarea {
	    font-family:none;
	    font-size: .42rem;
	    -webkit-tap-highlight-color: rgba(0,0,0,0);
			-webkit-tap-highlight-color: transparent;
	}
	input[type=search] {
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    border: 0;
	    /*border-radius: 6px;*/
	}
	input::-webkit-input-placeholder{color:#999999;font-size: .12rem;line-height:normal;}
	.searchInput{
		font-size: 0.14rem;
		height: 0.32rem;
		background: #F0F0F0;
		width: 100%;
	    padding-left: .1rem;
	    padding-right: .1rem;
	}
	.input_cont{
		padding: .04rem .14rem .04rem .1rem;
	    display: flex;
	    display: -webkit-flex;
	    justify-content: space-between;
	    -webkit-justify-content: space-between;
	    align-items: center;
		-webkit-align-items: center;
	    border-bottom: 1px solid #f6f6f6;
	}
	.history_search{
		padding: .15rem .15rem 0 .15rem;
	}
	.search_title{
		margin-bottom: .15rem;
	    display: inline-block;
	}
	.hs_items{
		display: inline-block;
	    padding: .1rem;
	    border: 1px solid #e2e2e2;
	    border-radius: 2px;
	    margin-bottom: .1rem;
	    height: .4rem;
	    line-height: .2rem;
	}
	.search_text{
		position: relative;
		width: 90%;
		height: 0.32rem;
	}
	.input_clearn{
		  display: flex;
		  display: -webkit-flex;
	    width: .15rem;
	    height: .15rem;
	    /*background: #999;*/
	    border-radius: 50%;
	    text-align: center;
	    position: absolute;
	    right: .1rem;
	    top: .1rem;
	    /*overflow: hidden;*/
	    color: #fff;
	    justify-content: center;
	    -webkit-justify-content: center;
	    align-items: center;
		-webkit-align-items: center;
	}
	.input_clearn img{
		width: 100%;
		height: 100%;
	}
	.history_item{
		padding: 0.17rem 0.15rem;
		border-bottom: 1px solid #f0f0f0 ;
	}
	.icon_clearn{
		display: inline-block;
		width: 0.18rem;
		height: 0.18rem;
	}
	.icon_clearn img{
		width: 100%;
		height: 100%;
	}
	.search_header{
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
	    justify-content: space-between;
	  -webkit-justify-content: space-between;
	}
	.noSearch{
		text-align: center;
		margin-top: 1rem;
	}
	.noSearch img{
		width: 0.5rem;
		height: 0.54rem;
	}
	
</style>