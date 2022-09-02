<!--xurr on 180827
	搜索页面：包含历史搜索
	
	
-->
<template>
	<div class="searchPro">
		<div class="add_staff" v-if='names.length>0'>
    		<p class="add_title">已添加的随行人员</p>
    		<div class="staff_items">
    			<p class="staff_item" v-for="(item,index) in names" :key = 'index'>
    				<span>{{item.name.split(/\(.*?\)/)[0]}}</span>
    				<span @click="deleteStaff(index)">×</span>
    			</p>
    		</div>
    	</div>
		<div class="input_cont">
			<div class="search_text">
				<span>添加随行人员：</span>
				<input id="inputCont" 
					class="searchInput"
					autofocus="true"
					v-model="searchWord"  
					placeholder="请输入随行人员姓名" 
					@input="keyupall($event)">
				<span class="input_clearn" 
					@mousedown="clearInput($event)" 
					v-show="isnone">
					<img src="../images/close-btn.png" alt="" />
				</span>
			</div>
		</div>
		<div class="history_items" v-show="issucc">
			<div>
				<p class="history_item" 
					v-for="(item,index) in fourData"
					:key = 'index'
					data-type = 'index' 
					@click="goDec(item)">
					{{item.name}}
				</p>
			</div>
			<div class="noSearch" v-show='limit'>
				<img class="icon_nosearch" src="../images/icon_nosearch.png"/>
				<p>无搜索结果</p>
			</div>	
			
		</div>
		<div class="creat_btn">
			<p class="crea_submit" :class="names.length>0?'subf33':'subfc8'" @click="createSub()">确认添加</p>
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
				arr:JSON.parse(localStorage.getItem('searchWord'))||[],//历史搜索
				isHis:false,//是否是历史数据
				enter:'',//判断入口页面
				fourData:'',
				placeh:'',
				fourType:sessionStorage.getItem('type'),
				fourEnter:'',
				limit:false,
				names:JSON.parse(this.$route.query.names)||[],
				nameArr:'',
			}
		},
		beforeCreate () {
			document.title = '搜索';
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			$('body').css('background','#F6F6F6');
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
						var param = {
							mobile:userData.state.mobile,
							realname:this.searchWord,
					}
					if(userData.state.city_ids){
						param.city_id=userData.state.city_ids
					}
						var _this = this;
						var apiUrl = '';
						apiUrl = '/vehicle-abnormal/person';
						 myAjax.post(getOspApiUrl(apiUrl), param).then(data=> {
						 	var result;
						 	if(data.status==0){ 
						 		_this.result = data.data;
						 		if(_this.result.length<=0){
						 			_this.limit = true;
						 		}else{
						 			_this.limit = false;
						 		}
						 		_this.fourData = data.data;
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
			goDec(personal){//搜索后判断类型进行页面跳转
				console.log(this.names.length)
				if(this.names.length<=8){
					this.names.push(personal);
					this.unique(this.names);
					this.searchWord = '';
					this.history = true;
					this.isnone = false;
					this.issucc=false;
				}else{
					this.$_LIKE_toast('最多只能添加9个人')
				}
			},
			hsItem(hsWord){//处理直接点击历史记录
				this.searchWord = hsWord;
				this.isHis = true;
				this.isnone = true;
				this.history = false;
				this.keyupall();
				
			},
			clearnLoc(){//清除历史记录
				this.arr = [];
			},
			unique(allarr){//历史记录去重
				var res = [];
				var obj = {};
				for(var i=0; i<allarr.length; i++){
				  	if( !obj[allarr[i].name] ){
				   		obj[allarr[i].name] = 1;
				   		res.push(allarr[i]);
				  	}
				} 
				this.names = res;
			},
			deleteStaff(index){
				 this.names.splice(index,1);
			},
			createSub(){
				if(this.names.length>0){
					this.$router.push({
						path:'/newOrder',
						query:{
							'names':JSON.stringify(this.names),
							'car_id':this.$route.query.car_id,
						}
					})
				}
			},
			splitName(personal){
				var arr = personal.split(/\(.*?\)/);
				return arr[0]
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
	}
	input::-webkit-input-placeholder{color:#999999;font-size: .12rem;line-height:normal;}
	.searchInput{
		font-size: 14px;
		height: 0.54rem;
		background: #FFFFFF;
	    padding-left: .1rem;
	    padding-right: .1rem;
	    border: none;
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
	    background: #FFFFFF;
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
		width: 100%;
		height: 0.54rem;
		display: flex;
		align-items: center;
		display: -webkit-flex;
		-webkit-align-items: center;
	}
	.input_clearn{
		  display: flex;
		  display: -webkit-flex;
	    width: .15rem;
	    height: .15rem;
	    border-radius: 50%;
	    text-align: center;
	    position: absolute;
	    right: .1rem;
	    /*top: .19rem;*/
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
	.creat_txt{
	font-size: .15rem;
	color: #333333;
	padding-bottom: 0.16rem;
	padding-top: .1rem;
	padding-left: .1rem;
}
.creat_btn{
	width: 100%;
	height: 0.63rem;
	position: fixed;
	bottom: 0;
	background: #FFFFFF;
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	justify-content: center;
	-webkit-justify-content: center;
	align-items: center;
	-webkit-align-items: center;
	-moz-box-shadow: 0px -3px 5px #e7e7e7;
    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
    box-shadow: 0px -3px 5px #e7e7e7;
}
.crea_submit{
	width: 95%;
	color: #FFFFFF;
	padding: 0.15rem;
	text-align: center;
	border-radius: 2px;
}
.subf33{
	background: #333333;
}
.subfc8{
	background: #c8c8c8;
}
.history_item{
	background: #FFFFFF;
		padding: 0.17rem 0.15rem;
		border-bottom: 1px solid #f0f0f0 ;
	}
	.history_item:last-child{
		margin-bottom: .63rem;
	}
.add_staff{
		margin-bottom: .1rem;
		padding: .13rem .15rem .13rem .15rem;
		background: #FFFFFF;
	}
	.add_title{
		font-size: 13px;
		color: #666;
		margin-bottom: .13rem;
	}
	.staff_items {
	    display: flex;
	    flex-wrap: wrap;
	    display: -webkit-flex;
	    -webkit-flex-wrap: wrap;
	}
	.staff_item{
		width: 1.05rem;
	    height: .34rem;
	    display: flex;
	    justify-content: space-between;
	    display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    border: 1px solid #007bff;
	    align-items: center;
	    -webkit-align-items: center;
	    color: #007bff;
	    padding: 0 .1rem;
	    border-radius: 2px;
	    margin-bottom: .1rem;
	    margin-right: .15rem;
	}
	.staff_item:nth-child(3n){
		margin-right: 0;
	}
	
</style>