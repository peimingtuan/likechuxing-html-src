<!--
	作者：xurui_518@163.com
	时间：2018-09-05
	描述：车辆明细
	1、如果没有权限没有车辆数，权重进入页面后头部右侧数量不显示 
-->
<template>
	<div class="carDetails">
		<div class="four_header">
			<div class="details_header">
				<p class="fc99">{{city_name?city_name.substring(0,city_name.length-1):''}}-{{details.name}}</p>
				<p  class="fc99" v-show="details.count!='-1'||details.percent!='-1'">
					共<span class="fc33"> {{details.count}} </span> 辆 占 <span class="fc33"> {{details.percent}}% </span>
				</p>
			</div>
		</div>
		<div class="four_content fc33" v-show="moveData.length>0"> 
			<!--上拉加载，下拉刷新-->
	            <mt-loadmore :top-method="loadTop" :autoFill=false :distance-index='1' @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
	            	<div class="car_detail_item" v-for="listItem in moveData">
			    		<div class="car_card">
							<p class="car_plat">
								<span class="fc33">{{listItem.plate_no}}</span>
								(<span class="fc99" v-show="listItem.vin">{{listItem.vin?listItem.vin.substring(0, 11):''}}</span>
								<span class="fc33" v-show="listItem.vin">{{listItem.vin?listItem.vin.substring(11, 17):''}}</span>)
							</p>
						</div>
						<p class="car_dec"> 
							<span>
								{{listItem.brand_name}}{{listItem.model_name}}
							</span>
							<span>{{listItem.color}}</span>
						</p>
						<p class="detail_addr fc66">
							<!--条件：根据是否是成都限行或广佛限行判断是否显示，判断限行区域内非与限'rule_not':'onNo'限-->
							<span class="icon_addr">
								<img src="../image/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
								<img src="../image/map-B.png" alt=""  v-else/>
							</span>
							<span class="addr_dec">
								{{listItem.address}} 
								<!--<span class="fc33">{{ listItem.parking_floor}}</span>  层
								<span v-if="listItem.parking_no" ><span class="fc33">{{ listItem.parking_no }}</span> 车位</span> -->
							</span>
						</p>
						<p class="not_time">
							状态时长：
							<span class='fc33' v-for="(times,num) in listItem.csr_time">
								{{times}} <span class="fc33">{{num==0?'天':num==1?'小时':'分'}}</span>
							</span>
						</p>
						<p class="dot_line" v-if="listItem.last_desc"></p>
 						<p class="move_note" v-if="listItem.last_desc">
 							<span class="note_titles fc33">备注：</span>
 							<span class="fc66 note_con">
 								{{listItem.last_desc}}
 							</span>
 						</p>
					</div>
					<div slot="top" class="mint-loadmore-top">
			          <span v-show="topStatus !== 'loading'&&topStatus !== 'drop'" :class="{ 'is-rotate': topStatus === 'drop' }">继续下拉</span>
			          <span v-show = "topStatus === 'drop'">松开刷新</span>
			          <span v-show="topStatus === 'loading'">
			            	刷新中
			          </span>
			        </div>    
			        <div slot="bottom" class="mint-loadmore-bottom">
			          <span v-show="bottomStatus !== 'loading'&&bottomStatus !== 'drop'" :class="{ 'is-rotate': bottomStatus === 'drop' }">{{botText}}</span>
			          <span v-show="bottomStatus === 'drop'&&!allLoaded" :class="{ 'is-rotate': bottomStatus === 'drop' }">松开加载</span>
			          <span v-show="bottomStatus === 'loading'">
			            	加载中
			          </span>
			        </div>
			        <div v-show="notMore" class="nullData">没有更多数据了</div>
			    </mt-loadmore>
		</div>
		<!--筛选-->
		
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../common/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	import {Confirm,Toast} from '../common/LikeAlert/index'
	import { Navbar, TabItem,Loadmore } from 'mint-ui';
	import authSingObj from '../js/signature'

	export default{
		data () {
			return{
				moveData:[],//列表数据
				loading:false,
				//上拉加载，下拉刷新功能
                listdata: [], // 下拉更新数据存放数组
	            filterShow:false,//筛选弹层
				isShow:false,//toast提示
				msg:'',//toast提示内容
				sort_type:'0',//排序
				biz_type:'10',//合作类型
				pageNum:'1',//分页
				icon_addr:'',
				city_id:'',
				list: [],
		        allLoaded: false,
		        bottomStatus: '',
		        wrapperHeight: 0,
		        topStatus: '',
		        //wrapperHeight: 0,
		        translate: 0,
		        moveTranslate: 0,
		        pullla:false,
		        islimit:'',
		        notMore:false,//初次加载是否有分页数据
		        botText:'',
		        details:'',//上页带回数据
		        city_name:'',
		        city_id:''

			}
		},
		beforeCreate () {
			document.title = '车辆明细';
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			var url = window.location.href;
			this.details = JSON.parse(this.getUrl(url).details)
			this.city_name = this.getUrl(url).cityName;
			this.city_id = this.getUrl(url).cityId;
			setTimeout(()=>{
				$('.four_content').height(document.documentElement.clientHeight-$('.four_header').height());
			},80)
			sessionStorage.removeItem('fourEnter');
			this.loaded= new Loading()//加载loading
			//初始化数据
			var params = {
            	"mobile":sessionStorage.getItem('mobile'),
				'city_id':this.city_id,
				'car_status':this.details.id,
				'page':'1'
			}
            this.init(params);
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
			dingding(){//钉钉授权等
				var url = window.location.href
				var newUrl = url.substr(0,url.indexOf(location.hash));
				var that = this;
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : '车辆明细',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
					dd.ui.webViewBounce.disable(); 
				})
				    
			},
			init(param){
				var _this = this;
				$('.four_content').css('padding-bottom','0')
				myAjax.post(getApiUrl('/statistics/list'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.moveData = data.data;
//						_this.moveData = _this.moveData.unshift({'unmove_time':'1天4小时5分钟'})
						//以下处理上拉下拉数据文案展示
						_this.allLoaded = false;
            			_this.notMore = false;
						if(_this.moveData.length!=10){_this.allLoaded = true;_this.botText=''}else{
							_this.allLoaded = false;
						}
						if(_this.moveData.length<=2){
							$('.mint-loadmore').height(document.documentElement.clientHeight-$('.four_header').height());
							$('.mint-loadmore').css('overflow','scroll');
							_this.botText=''
						}else{
							$('.mint-loadmore').css('overflow','hidden');
							_this.botText='上拉加载更多'
						}
						$('.four_content').height(document.documentElement.clientHeight-$('.four_header').height());
						_this.anios();
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
			},
			anios() { //判断移动设备，更改样式
		        var u = navigator.userAgent;
		        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		        if(isAndroid){
					$('.four_content').css('padding-bottom','.2rem')
		        }
	      	},
     		handleBottomChange(status) {//监听装填
     			this.pullla = true;
		        this.bottomStatus = status;
		    },
		    loadBottom() {//上拉加载
		        setTimeout(() => {
		          this.counter++;
	                this.loading = true;
			        this.pageNum ++;
			        var param = {
				        "mobile":sessionStorage.getItem('mobile'),
						'city_id':this.city_id,
						'car_status':this.details.id,
						'page':this.pageNum		//int	页码
					}
			        var _this = this;
					myAjax.post(getApiUrl('/statistics/list'), param, function (data) {
						if(data.status==0){ 
							_this.loading = false;
					 		var reList = data.data;
					 		
					 		if(reList.length<10){
					 			_this.allLoaded = true;
					 			_this.notMore = true;
					 			_this.botText=''
					 		}else{
					 			_this.allLoaded = false;
					 		}
					 		if(reList.length==0){
	//						 			_this.noData=true;
		                        _this.allLoaded = true;
		                        _this.notMore = true;
					 		}
					 		var arr = _this.moveData
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 		}
					 		_this.moveData = [];
					 		_this.moveData = arr;
							//上拉、下拉加载
						
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg
					 		setTimeout(()=>{_this.isShow=false;},2000)
					 	}
					})
		          this.$refs.loadmore.onBottomLoaded();
		        }, 1500);
		    },
		    handleTopChange(status) {
		        this.moveTranslate = 1;
		        this.topStatus = status;
		    },
		    translateChange(translate) {
		        const translateNum = +translate;
		        this.translate = translateNum.toFixed(2);
		        this.moveTranslate = (1 + translateNum / 70).toFixed(2);
		    },
		    loadTop() {//下拉刷新
		        setTimeout(() => {
		        	this.pageNum = 1;
					setTimeout(()=>{
						var param = {
							 "mobile":sessionStorage.getItem('mobile'),
								'city_id':this.city_id,
								'car_status':this.details.id,
								'page':'1'		//int	页码
						}
						this.init(param);
					},80)
			      	$('.mint-loadmore-content').scrollTop(0);
		          this.allLoaded = false;
		          this.notMore = false;
		          this.$refs.loadmore.onTopLoaded();
		        }, 1500);
		    },
		    /*goDetail(plate_no,vin){
		    	var enter;
            	var vins = vin.substring(11, 17)
            	plate_no?enter=plate_no:enter=vins;//有车牌号传车牌，无车牌号传Vin号
            	window.location.href = '../../manageOrderCardetail/index.html?plate_no='+enter;
		    },*/
		}
	}
	
	
</script>
<style>
</style>