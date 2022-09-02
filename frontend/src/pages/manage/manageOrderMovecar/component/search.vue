<!--
	1、入口判断，是否已经拍照过，如果已经拍照img则展示接口请求的地址即可
	2、
-->
<template>
	<div class="search">
		<div class="repair_shop">
			<span>{{search_name}}</span>
			<span class="repair_sear">
				<input type="text" name="searchWord" @focus="hisData()" v-model='searchWord' :placeholder="plac_txt" @input.trim="keyupall($event)"/>
				<span class="input_clearn" 
					@mousedown="clearInput($event)" 
					v-show="isnone">
					<img src="../images/icon_close.png" alt="" />
				</span>
			</span>
		</div>
		<div class="history_items" v-show="issucc||ishis">
			<div>
				<p v-if='result&&result.length==0&&ishis' class="his_title">历史记录：</p>
				<p v-if='result&&result.length==0&&ishis' class="his_list" 
					v-for="(item,index) in arr"
					:key = 'index'
					@click="hsItem(item)">
					{{item}}
					<span class="his_clearn" @click.stop="deleteArr(index)">
						<img src="../images/icon_delete.png" alt="" />
					</span>
				</p>
				<p  v-if = 'search_type==3'
					class="history_item" 
					v-for="(item,index) in result" 
					:key = 'index'
					data-type = 'index' 
					@click="goDec(index,item.branch_addr,item.id,item)">
					{{item.branch_addr}}
				</p>
				<p v-if="search_type==2"
					class="history_item" 
					v-for="(item,index) in result"
					:key = 'index'
					data-type = 'index' 
					@click="goDec(index,item.name,item.id,item)">
					{{item.name||item.plate_no}}
				</p>
				<p class="his_close" @click="ishis=false" v-if='result&&result.length==0&&ishis'>关闭</p>
			</div>
			<div class="noSearch" v-show='limit'>
				<img class="icon_nosearch" src="../images/icon_nosearch.png"/>
				<p>无搜索结果</p>
			</div>	
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	export default {
		name:'search',
		props: {
	    	search_name:'',
	    	plac_txt:'',
	    	apiUrl:'',
	    	search_type:'',//1 维修厂    2地图搜索  3网点搜索
	    },
		data(){
			return {
				searchWord:'',
				isnone:false,//全部清除按钮
				issucc:false,//是否请求回来数据
				result: [],//所有数据
				limit:false,
				remain:'',
				checkTime:'',
				search_id:'',
				arr:JSON.parse(localStorage.getItem('searchWord'))||[],
				ishis:false,
				reIndex:'',
				list_item:''
			}
		},
		mounted () {
			
		},
	    methods: {
	    	hisData(){
	    		this.arr&&this.arr.length!=0?this.ishis=true:this.ishis=false;
	    		if(this.searchWord&&this.searchWord.length<0){
	    			this.isnone = false;
				 	this.issucc = false;
				 	this.result = [];
	    		}
	    	},
	    	keyupall(e){//搜索结果事件
				if(this.searchWord.length>0&&this.searchWord){
				 	this.isnone = true;
				 	this.issucc = true;
				 	this.ishis=false;
				 }else{
				 	this.isnone = false;
				 	this.issucc=false;
				 	this.result = [];
				 	this.arr.length!=0?this.ishis=true:this.ishis=false;
				 }
				if(this.searchWord.length>0){
					var param = {
			        	mobile:userData.state.mobile||'13521758602',
			        	kw:this.searchWord,
					}
					if(userData.state.city_ids){
						param.city_id=userData.state.city_ids
					}
					var _this = this;
					 myAjax.post(getOspApiUrl(_this.apiUrl), param).then(data=> {
					 	var result;
					 	if(data.status==0){ 
					 		_this.result = data.data;
					 		if(_this.search_type==2)_this.result=_this.result.branch;
					 		if(_this.result&&_this.result.length<=0){
					 			_this.limit = true;
					 		}else{
					 			_this.limit = false;
					 		}
					 		
					 	}else{
					 		this.$_LIKE_toast(data.msg)
					 	}
					})
				}
				
			},
			clearInput(e){//清除按钮
				e.preventDefault();
				this.searchWord = '';
				this.search_id = '';
				this.isnone = false;
				this.issucc=false;
				this.result = [];
				this.list_item = [];
				this.$emit('result',true);
			},
			goDec(index,name,id,list_item){
				this.searchWord = name;
				this.isnone = false;
				this.issucc=false;
				this.ishis=false;
				this.search_id = id;
				this.arr.push(this.searchWord);
				this.unique(this.arr);
				this.list_item = list_item
				this.$emit('result',true);
			},
			hsItem(hsWord){//处理直接点击历史记录
				this.searchWord = hsWord;
				this.isHis = true;
				this.isnone = true;
				this.history = false;
				this.keyupall();
				
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
			},
			deleteArr(index){
				this.arr.splice(index,1);
				localStorage.setItem('searchWord',JSON.stringify(this.arr));
				this.arr.length!=0?this.ishis=true:this.ishis=false;
			}
        }
	}
</script>

<style scoped>
	*{
   	 box-sizing: border-box;
   	}
    .fc33{
    	color: #333333;
    }
   .fc99{
   		color: #999999;
   }
   .fc66{
   		color: #666666;
   }
   .f15b{
		color: #F15B5B;
	}
	.fc4a90{
		color: #4a90e2;
	}
	.search{
		background: #FFFFFF;
	}
	input::-webkit-input-placeholder{font-size: 14px;color: #999999;}
	input, select, textarea {
	    font-family:none;
	    -webkit-tap-highlight-color: rgba(0,0,0,0);
			-webkit-tap-highlight-color: transparent;
	}
	.repair_sear{
		display: inline-block;
	}
	.input_clearn{
		display: inline-block;
		width: .14rem;
		height: .14rem;
		position: absolute;
		right: .15rem;
		top: 0;
	}
	.input_clearn img{
		width: 100%;
		height: 100%;
	}
	.his_clearn{
		display: inline-block;
		width: .14rem;
		height: .14rem;
	}
	.his_clearn img{
		width: 100%;
		height: 100%;
	}
	.history_item{
		padding: 0.1rem 0.15rem;
	}
	.noSearch{
		text-align: center;
		margin-top: .5rem;
	}
	.noSearch img{
		width: 0.5rem;
		height: 0.54rem;
	}
	.history_items{
		z-index: 120;
		background: #FFFFFF;
		position: absolute;
		width: 95%;
		left: 2.5%;
		min-height: 1rem;
		border: 1px solid #F0F0F0;
		max-height: 6rem;
		overflow: hidden;
		
	}
	.repair_shop{
		height: .53rem;
	    background: #ffffff;
	    line-height: .53rem;
	    padding: 0 .15rem;
	    border-bottom: 1px solid #F6F6F6;
	    position: relative;
	}
	.repair_shop input{border: none; padding: 0;font-size: 14px;-webkit-appearance: none;width: 80%;}
	.his_list,.his_title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		-webkit-align-items: center;
		padding: 0.1rem 0.15rem;
	}
	.his_list{
		border-bottom: 1px solid #ededed;
		padding: 0.1rem 0;
		margin: 0 0.15rem;
	}
	.his_close{
		padding: 0.1rem 0.15rem;
		padding: .1rem .15rem;
	    text-align: right;
	    color: #ccc;
		
	}
</style>