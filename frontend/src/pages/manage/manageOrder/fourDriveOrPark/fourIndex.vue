<!--
	作者：xurui_518@163.com
	时间：2018-07-17
	描述：开四停四调度列表页面
	
-->
<template>
	<div class="fourIndex">
		<div class="four_header fc33">
		    <div class="det_header">
				<p class="header_item" @click="goSearch()">
					<span class="detail_icon"><img src="../image/icon_search.png"/></span><span class="fc33">搜索</span>
				</p>
				<p class="header_item item_center" @click="openFil()">
					<span class="detail_icon"><img src="../image/icon_filter.png"/></span><span class="fc33">筛选</span>
				</p>
				<p class="header_item item_center2" @click="sortShow=true">
					<span class="detail_icon"><img src="../image/icon_sort.png"/></span><span class="fc33">排序</span>
				</p>
				<p class="header_item" @click="onreLoad()">
					<span class="detail_icon"><img src="../image/icon_refresh.png"/></span><span class="fc33">刷新</span>
				</p>
			</div>
			<div class="four_tab">
				<!--tab栏-->
				<mt-navbar v-model="selected">
					  <mt-tab-item id="1">紧急调离限行区</mt-tab-item>
					  <mt-tab-item id="2">调离限行区</mt-tab-item>
					  <mt-tab-item id="3">调入限行区</mt-tab-item>
				</mt-navbar>
			</div>
			
		    <p class="p2">
		        <span class="check_net" @click="goAllmap()">查看地图网点</span>
		        <span class="show_dock" @click="goNote()">调度说明</span>
		    </p>
		</div>
		<div class="four_content fc33" v-show="fourData.length>0"> 
			<!--上拉加载，下拉刷新-->
			<!--<vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">-->
	            <!--tab栏切换内容-->
	            <mt-loadmore :top-method="loadTop" :distance-index='1' @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
	            <mt-tab-container v-model="selected">
					  <mt-tab-container-item id="1">
						  	<div v-for="(fourItem,index) in fourData" class="four_item" @click="goDetail(fourItem.id,1,fourItem.name,fourItem.biz_type,fourItem.lat,fourItem.lng)">
						  		<div class="fourList_left">
						  			<p class="fourList_id fc66">{{fourItem.id}}</p>
						  			<p class="fourlist_addrp">
						  				<span class="fourList_type">限</span>
						  				&nbsp;&nbsp;
						  				<span class="icon_addr">
											<img src="../image/mapb.png" alt="" v-if="fourItem.biz_type==0"/>
											<img src="../image/map-B.png" alt=""  v-else/>
										</span>
										&nbsp;
						  				<span class="fourList_addr fc33">{{fourItem.name}}</span>
						  			</p>
						  		</div>
						  		<div class="fourList_right">
						  			<p class="fourlist_num fc33">{{fourItem.move_num}}</p>
						  			<p class="fc99 num_dis">需调度</p>
						  		</div>
						  	</div>
					  </mt-tab-container-item>
					  <mt-tab-container-item id="2">
						    <div v-for="(fourItem,index) in fourData" class="four_item" @click="goDetail(fourItem.id,2,fourItem.name,fourItem.biz_type,fourItem.lat,fourItem.lng)">
						  		<div class="fourList_left">
						  			<p class="fourList_id fc66">{{fourItem.id}}</p>
						  			<p class="fourlist_addrp">
						  				<span class="fourList_type">限</span>
						  				&nbsp;&nbsp;
						  				<span class="icon_addr">
											<img src="../image/mapb.png" alt="" v-if="fourItem.biz_type==0"/>
											<img src="../image/map-B.png" alt=""  v-else/>
										</span>
										&nbsp;
						  				<span class="fourList_addr fc33">{{fourItem.name}}</span>
						  			</p>
						  		</div>
						  		<div class="fourList_right">
						  			<p class="fourlist_num fc33">{{fourItem.move_num}}</p>
						  			<p class="fc99 num_dis">需调度</p>
						  		</div>
						  	</div>
					  </mt-tab-container-item>
					  <mt-tab-container-item id="3">
					    <div v-for="(fourItem,index) in fourData" class="four_item" @click="goDetail(fourItem.id,3,fourItem.name,fourItem.biz_type,fourItem.lat,fourItem.lng)">
					  		<div class="fourList_left">
					  			<p class="fourList_id fc66">{{fourItem.id}}</p>
					  			<p class="fourlist_addrp">
					  				<span class="fourList_type four_not">非</span>
					  				&nbsp;&nbsp;
					  				<span class="icon_addr">
										<img src="../image/mapb.png" alt="" v-if="fourItem.biz_type==0"/>
										<img src="../image/map-B.png" alt=""  v-else/>
									</span>
									&nbsp;
					  				<span class="fourList_addr fc33">{{fourItem.name}}</span>
					  			</p>
					  		</div>
					  		<div class="fourList_right">
					  			<p class="fourlist_num fc33">{{fourItem.move_num}}</p>
					  			<p class="fc99 num_dis">需调度</p>
					  		</div>
					  	</div>
					  </mt-tab-container-item>
				</mt-tab-container>
				<div slot="top" class="mint-loadmore-top">
			          <span v-show="topStatus !== 'loading'&&topStatus !== 'drop'" :class="{ 'is-rotate': topStatus === 'drop' }">继续下拉</span>
			          <span v-show = "topStatus === 'drop'">松开刷新</span>
			          <span v-show="topStatus === 'loading'">
			            	刷新中
			          </span>
			        </div>    
			        <div slot="bottom" class="mint-loadmore-bottom">
			          <span v-show="bottomStatus !== 'loading'&&bottomStatus !== 'drop'" :class="{ 'is-rotate': bottomStatus === 'drop' }"></span>
			          <span v-show="bottomStatus === 'drop'&&!allLoaded" :class="{ 'is-rotate': bottomStatus === 'drop' }">上拉加载更多</span>
			          <span v-show="bottomStatus === 'loading'">
			            	加载中
			          </span>
			        </div>
			        <div v-show="allLoaded" class="nullData">没有更多数据了</div>
			      </mt-loadmore>
	       	<!--</vscroll>-->
		</div>
		<!--筛选-->
		<div class="check_modal fc33" v-show="filterShow">
			<div class="modal" @click="filClose()"></div>
			<div class="filter_cont">
				<div class="filter_header">
					<span class="close_modal" @click="filClose()">
						X
					</span>
					<span class="filter_title">筛选</span>
				</div>
				<div class="filter_all">
					<div class="filter_more">
						<div class="filter_dec" v-for="(dec,indexs) in filterData1" :class="'filter'+indexs">
							<p class="fildec_title fc99">{{dec.title}}</p>
							<div class="fildec_cont">
								<span class="fildec_items" :data-i='items.type' :id="dec.type+items.type" :class="[index==0?'bg_black':'bg_white',index==0?'isOne':'notOne']" v-for="(items,index) in dec.all" @click="fourFilter(dec.type,items.type,$event)">{{items.name}}</span>
							</div>
						</div>
					</div>
					<div class="check_more">
						<div class="filter_dec">
							<p class="fildec_title fc99">车辆</p>
							<div class="fildec_cont">
								<span class="fildec_items filmore1 bg_white" @click="checkList('-1',$event)">全部车辆</span>
								<!--<span class="fildec_items filmore" :id = 'items.id' :class="[index==0?'bg_black':'bg_white',index==0?'isOne':'notOne']" v-for="(items,index) in moreData" @click="checkList(items.id,$event)">{{items.name}}({{items.count}})</span>-->
								<span class="fildec_items filmore" :id = 'items.id' :class="[index==0?'isOne':'notOne']" v-for="(items,index) in moreData" @click="checkList(items.id,$event)">{{items.name}}({{items.count}})</span>
							</div>
						</div>
					</div>
				</div>
				<div class="filter_footer">
					 <input class="filter_reset" type="reset" name="butReset" value="重置" @click="resetbtn()">
					 <input class="filter_submit" type="submit" name="butSubmit" value="确定" @click="submitbut()">
				</div>
			</div>
		</div>
		<!--排序-->
		<div class="check_modal fc33" v-show="sortShow">
			<div class="modal" @click="filClose()"></div>
			<div class="sort filter_cont">
				<div class="filter_header">
					<span class="close_modal" @click="filClose()">
						X
					</span>
					<span class="filter_title">排序</span>
				</div>
				<div class="filter_all">
					<p class="sort_item" v-for="sortItem in sort" @click="sortCheck(sortItem.sortType,$event)">
						<span :class="sortItem.sortType==1?'is_sort':'no_sort'" @click="gosort(sortItem.sortType,$event)">{{sortItem.sortCont}}</span>
						<span class="sort_icon" v-show="sortItem.sortType==1">
							<img src="../image/dispatch/duigou.png" alt="" />
						</span>
					</p>
				</div>
			</div>
		</div>
		<!--调度说明-->
		<div class="check_modal note_modal fc33" v-show="noteShow">
			<div class="note_content">
				<div class="note_title">
					调度说明
				</div>
				<p class="note_item" v-for='item in noteData'>
					{{item}}
				</p>
			</div>
			<div class="note_close" @click="filClose()">
				<img src="../image/dispatch/close-btn.png"/>
			</div>
		</div>
		<!--下方按钮  查看小组任务-->
		<div class="four_group" @click="goGroup()" v-show="islimit==1">
			<p class="group_btn">
				查看小组任务
			</p>
		</div>
		
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../common/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	import {Confirm,Toast} from '../common/LikeAlert/index'
	import vscroll from '../../../../component/VUEpullDownRefresh'
	
	import { Navbar, TabItem } from 'mint-ui';
	import authSingObj from '../js/signature'

	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				fourData:[],//列表数据
				loading:false,
				//上拉加载，下拉刷新功能
      			counter: 1, //当前页
                pages: 10, // 一页显示多少条
                pageStart: 0, // 开始页数
                pageEnd: 0, // 结束页数
                listdata: [], // 下拉更新数据存放数组
                scrollData: {
                    noFlag: false //暂无更多数据显示
                },
	            selected:sessionStorage.getItem('type')||'1',//默认tab栏
	            filterShow:false,//筛选弹层
	            sortShow:false,//排序弹层
	            noteShow:false,//调度说明弹层
	            filterData1:[],//筛选弹层内容，多选
				sort:[
					{"sortCont":"距离网点从近到远",'sortType':'1'},
					{"sortCont":"需调度车辆数从大到小",'sortType':'2'}
				],
				tabId:sessionStorage.getItem('type')||1,//当前tab栏
				isShow:false,//toast提示
				msg:'',//toast提示内容
				sort_type:'1',//排序
				loca_check:'10',//地点车牌
				biz_type:'10',//合作类型
				pageNum:'1',//分页
				icon_addr:'',
				city_id:'',
				resetAll:false,//是否重置
				noteData:["1、紧急调离限行区:限行车辆被还到限行区域内，需运维当天23:59前调离限行区域；","2、调离限行区:今日已行驶达到4天，需当天23:59前调离限行区；","3、调入限行区:该部分车辆00:00之后即可驶入限行区。"],//调度说明需求
				startScroll:'',
				startY:'',
				startX:'',
				submits:false,
				moreData:'',
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
		        

			}
		},
		beforeCreate () {
			document.title = '开四停四调度列表';
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			//初始化筛选框内容
		var param = {
			type: this.tabId,
			mobile:sessionStorage.getItem('mobile')
		}
			var _this = this;
			myAjax.post(getApiUrl('/limit-line/filter'), param, function (data) {
				if(data.status==0){
					_this.moreData = data.data;
				}else{
			 		_this.isShow = true;
			 		_this.msg = data.msg;
			 		setTimeout(()=>{_this.isShow=false;},2000)
		 		}
			})
			setTimeout(()=>{
				$('.four_content').height(document.documentElement.clientHeight-$('.four_header').height());
				$('.mint-loadmore').height(document.documentElement.clientHeight-$('.four_header').height());
			},80)
			sessionStorage.removeItem('fourEnter');
			this.loaded= new Loading()//加载loading
			//本地环境时放开，上测试时注释
			/*$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
			$('#1').removeClass("bg_white").addClass('bg_black');
			var params = {
					"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng')||'116.298611',		//经度
					'lat':sessionStorage.getItem('lat')||'40.044257',		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort':'1',//1距离  2车辆数
					'page':'1'		//int	页码
				}
			//如果有筛选条件，加上筛选的条件
			var biz_type = sessionStorage.getItem('check_biz_type')
			var loca_check = sessionStorage.getItem('loca_check')
			if(biz_type==0||biz_type==1){params.biz_type = biz_type;}
			if(loca_check==1){params.is_local = loca_check;}
			if(loca_check==3||loca_check==4){
				params.drive_day = loca_check;
			}
			//多选
			var statusArr = sessionStorage.getItem('fourStatus');
			if(statusArr){
				params.status = statusArr;
			}
			this.init(params);
			this.limitGroup();*/
		},
		watch:{
	        selected:{//深度监听，tab切换
	            handler(newVal, oldVal){
	            	this.tabId = newVal;
	            	this.pageNum = 1;//初始化分页
	            	this.scrollData.noFlag = false;//如果其他tab请求了分页，初始化状态
	            	this.biz_type = 10;//如果其他tab，初始化状态
	            	this.loca_check =10;//如果其他tab，初始化状态
	            	$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
					$('#1').removeClass("bg_white").addClass('bg_black');
					sessionStorage.setItem('fourStatus',1)
	            	sessionStorage.removeItem('check_biz_type')
	            	sessionStorage.removeItem('loca_check')
	            	$('.isOne').removeClass("bg_white").addClass('bg_black');
					$('.notOne').addClass("bg_white").removeClass('bg_black');
					$('.mint-loadmore-content').scrollTop(0);//使页面回到顶部
	            	this.allLoaded = false;
	            	this.pullla = false;
	            	var param = {
	            		"mobile":sessionStorage.getItem('mobile'),
						'lng':sessionStorage.getItem('lng')||'116.298611',		//经度
						'lat':sessionStorage.getItem('lat')||'40.044257',		//维度
						'type':this.tabId,			//1紧急调离2普通调离3调入
						'sort':this.sort_type,//1距离 2车辆数
						'page':'1'		//int	页码
					}
						delete param.biz_type;
	            		delete param.is_local;
	            		delete param.drive_day;
					this.init(param);
	            },
	            deep:true
	        }
	   },
		methods:{
			checkList(id,e){//多选内事件
				this.resetAll = false;
				if(id=='-1'){//处理全选与否
					$('.filmore').removeClass("bg_black").addClass('bg_white');
					$('.filmore1').removeClass("bg_white").addClass('bg_black');
				}else{
					var checkLen = $(".filmore.bg_black").length;
					if(checkLen>1){
						if($(e.target).hasClass("bg_black")){
							$(e.target).removeClass("bg_black").addClass('bg_white')
						}else{
							$(e.target).removeClass("bg_white").addClass('bg_black')
						}
					}else{
						$(e.target).removeClass("bg_white").addClass('bg_black')
					}
					$('.filmore1').removeClass('bg_black').addClass('bg_white');
				}
			},
			dingding(){
				var url = window.location.href
				var newUrl = url.substr(0,url.indexOf(location.hash));
				var that = this;
//				myAjax.post(getApiUrl('/ding-js/sign-package'),{url:newUrl}, function (data) {
				var sign_name = authSingObj.getSign(decodeURIComponent(newUrl));
			    //钉钉授权接口
			    dd.config({
			        agentId: sign_name.agentId, // 必填，微应用ID
			        corpId: sign_name.corpId,//必填，企业ID
			        timeStamp: sign_name.timeStamp, // 必填，生成签名的时间戳
			        nonceStr: sign_name.nonceStr, // 必填，生成签名的随机串
			        signature: sign_name.signature, // 必填，签名
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
					dd.biz.navigation.setTitle({
					    title : '开四停四调度列表',//控制标题文本，空字符串表示显示默认文本
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
				            sessionStorage.setItem('lng',result.longitude);
				            sessionStorage.setItem('lat',result.latitude);
				            sessionStorage.setItem('locationsLng',result.longitude);
				            sessionStorage.setItem('locationsLat',result.latitude);
				            var param = {
				            	"mobile":sessionStorage.getItem('mobile'),
								'lng':result.longitude,		//经度
								'lat':result.latitude,		//维度
								'type':that.tabId,			//1紧急调离2普通调离3调入
								'sort':that.sort_type,//1距离  2车辆数
								'page':'1'		//int	页码
							}
				            $('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
							$('#1').removeClass("bg_white").addClass('bg_black');
							//如果有筛选条件，加上筛选的条件
							var biz_type = sessionStorage.getItem('check_biz_type')
							var loca_check = sessionStorage.getItem('loca_check')
							if(biz_type==0||biz_type==1){param.biz_type = biz_type;}
							if(loca_check==1){param.is_local = loca_check;}
							if(loca_check==3||loca_check==4){
								param.drive_day = loca_check;
							}
							//多选
							var statusArr = sessionStorage.getItem('fourStatus');
							if(statusArr){
								param.status = statusArr;
							}
				            that.init(param);
				            that.limitGroup();
						},
						onFail: function (err) {
					            console.log(err);
					            that.isShow = true;
					 		that.msg = '钉钉定位失败，请查看定位';
					 		setTimeout(()=>{that.isShow=false;},2000)
					        }
						});
				});
				
			},
			limitGroup(){
				var param = {
					mobile: sessionStorage.getItem('mobile'),
					items: 'group_list'
				}
				var _this = this;
				myAjax.post(getApiUrl('/permission/list'), param, function (data) {
					if(data.status==0){
						_this.islimit = data.data.group_list;
						if(_this.islimit==1){
							$('.four_content').height($(window).height()-$('.four_header').height()-$('.four_group').height());
							$('.mint-loadmore').height($(window).height()-$('.four_header').height()-$('.four_group').height());
							$('.four_content').css('margin-bottom','.66rem')
						}else{
							$('.four_content').css('margin-bottom','0px')
						}
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
			},
			init(param){
				if(this.tabId==3){
					this.filterData1=[//筛选弹层内容，多选
						{"title":"网点合作类型","all":[{"name":"全部网点","type":"10"},{"name":"B类网点","type":"0"},{"name":"B+类网点","type":"1"}],"type":"s1"},
						//保持循环一致，以下结构与上结构保持一致
						{"title":"可行驶天数","all":[{"name":"全部网点","type":"10"},{"name":"粤A","type":"1"},{"name":"3天","type":"3"},{"name":"4天","type":"4"}],"type":"s2"}
					]
				}else{
					this.filterData1=[//筛选弹层内容，多选
						{"title":"网点合作类型","all":[{"name":"全部网点","type":"10"},{"name":"B类网点","type":"0"},{"name":"B+类网点","type":"1"}],"type":"s1"},
					]
				}
				var _this = this;
				myAjax.post(getApiUrl('/limit-line/transfer-list'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.fourData = data.data;
						for(var i=0;i<_this.fourData.length;i++){
							_this.city_id = _this.fourData[i].city_id;
						}
						
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
			},
			goSearch(){//去搜索页面
				sessionStorage.setItem('type',this.tabId);
				window.location.href = '../carProblemsList/proOrder.html#/searchPro?enter=4';
			},
			filClose(){//关闭筛选层
				this.filterShow = false;
				this.sortShow = false;
				this.noteShow = false;
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
			},
			openFil(){//点击筛选按钮事件
				this.filterShow=true;
				var param = {type:this.tabId}
				var _this = this;
				myAjax.post(getApiUrl('/limit-line/filter'), param, function (data) {
					if(data.status==0){
						_this.moreData = data.data;
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
				//取当前缓存的已操作过的筛选条件
				var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr==1||!statusArr){//默认空闲//如果有历史筛选，展示出
						$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
						$('#1').removeClass("bg_white").addClass('bg_black');
					}else if(statusArr&&statusArr!='-1'){
						var status = statusArr.split(',');
						 for(var i=0;i<status.length;i++){//车伤部位
						 	console.log(status[1])
						 	if(status[i]!=1){
						 		$('#'+status[i]).removeClass("bg_white").addClass('bg_black');
						 	}else{
						 		$('#1').removeClass("bg_white").addClass('bg_black');
						 	}
						 	
						 }
					}else if(statusArr=='-1'){
						$('.filmore').removeClass("bg_black").addClass('bg_white');
						$('.filmore1').removeClass("bg_white").addClass('bg_black');
					}
				this.biz_type = sessionStorage.getItem('check_biz_type')
				this.loca_check = sessionStorage.getItem('loca_check')
				if(this.biz_type==0||this.biz_type==1){
					$('#s1'+this.biz_type).removeClass("bg_white").addClass('bg_black');
					$('#s1'+this.biz_type).siblings().removeClass("bg_black").addClass('bg_white');
				}
				if(this.loca_check==1||this.loca_check==3||this.loca_check==4){
					$('#s2'+this.loca_check).removeClass("bg_white").addClass('bg_black');
					$('#s2'+this.loca_check).siblings().removeClass("bg_black").addClass('bg_white');
				}
				
			},
			fourFilter(type,num,e){//筛选框内内容
				this.resetAll = false;//重置状态置为初始状态
				$(e.target).removeClass("bg_white").addClass('bg_black');
				$(e.target).siblings().removeClass("bg_black").addClass('bg_white');
				//判断筛选类型并赋值
				if(type=='s1'){
					this.biz_type = num
				}else if(type=='s2'){
					this.loca_check = num;
				}
			},
			submitbut(){//确认
				this.submits = true;
				//多选
				var status = $('.fildec_cont').find($('.filmore.bg_black'));//车辆，取出当前选中的值
				var allstatus = $('.fildec_cont').find($('.filmore1.bg_black'));
				var statusArrs;
				if(allstatus.length>=1){
					statusArrs = '-1';
				}else{
					var statusArr = [];
					for(var i=0;i<status.length;i++){//将当前选中值循环匹配唯一id
						var datai = $(status[i]).attr('id')
						statusArr.push(datai);
					}
					statusArrs = statusArr.join(',');//转为字符串入参
				}
				var param = {
					"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort':this.sort_type,//1距离 2车辆数
					'page':'1'		//int	页码
				}
				if(this.biz_type==0||this.biz_type==1){
					param.biz_type = this.biz_type;
					sessionStorage.setItem('check_biz_type',this.biz_type)
				}else{
					sessionStorage.removeItem('check_biz_type');
				}
				if(this.loca_check==1||this.loca_check==3||this.loca_check==4){
					if(this.loca_check==1){
						param.is_local = this.loca_check;
						sessionStorage.setItem('loca_check',this.loca_check)
					}
					if(this.loca_check==3||this.loca_check==4){
						param.drive_day = this.loca_check;
						sessionStorage.setItem('loca_check',this.loca_check)
					}
				}else{
					sessionStorage.removeItem('loca_check');
				}
				
				if(statusArrs){
					param.status = statusArrs;
					sessionStorage.setItem('fourStatus',statusArrs)
				}
				if(this.resetAll){
					delete param.biz_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.status;
				}
				this.init(param);
				this.filterShow = false;
			},
			resetbtn(){//重置
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#1').removeClass("bg_white").addClass('bg_black');
				this.biz_type = '10';
				this.loca_check='10';
				this.resetAll = true;
				//把push列表置空
			},
			gosort(sort,e){//触发到子节点的时候触发
				e.stopPropagation();
				$(e.target).parent().children().removeClass("no_sort").addClass('is_sort');
				$(e.target).parent().siblings().children().removeClass("is_sort").addClass('no_sort');
				$(e.target).parent().children('.sort_icon').css('display','inline-block');
				$(e.target).parent().siblings().children('.sort_icon').css('display','none');
				this.sort_type = sort;
				var param = {
					"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort':this.sort_type,
					'page':'1'		//int	页码
				}
				//多选
				var statusArr = sessionStorage.getItem('fourStatus');
				if(statusArr){
					param.status = statusArr;
				}
				if(this.biz_type==0||this.biz_type==1){param.biz_type = this.biz_type;}
				if(this.loca_check==1){param.is_local = this.loca_check;}
				if(this.loca_check==3||this.loca_check==4){
					param.drive_day = this.loca_check;
				}
				
				if(this.resetAll){
					delete param.biz_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.status;
				}
				this.init(param);
				setTimeout(()=>{
					this.sortShow = false;
				},600)
			},
			sortCheck(sort,e){//排序内容
				$(e.target).children().removeClass("no_sort").addClass('is_sort');
				$(e.target).siblings().children().removeClass("is_sort").addClass('no_sort');
				$(e.target).children('.sort_icon').css('display','inline-block');
				$(e.target).siblings().children('.sort_icon').css('display','none');
				this.sort_type = sort;
				var param = {
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort':this.sort_type,
					'page':'1'		//int	页码
				}
				//以下为排序后查看是否有筛选条件
				//多选
				var statusArr = sessionStorage.getItem('fourStatus');
				if(statusArr){
					param.status = statusArr;
				}
				if(this.biz_type==0||this.biz_type==1){param.biz_type = this.biz_type;}
				if(this.loca_check==1){param.is_local = this.loca_check;}
				if(this.loca_check==3||this.loca_check==4){
					param.drive_day = this.loca_check;
				}
				
				if(this.resetAll){
					delete param.biz_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.status;
				}
				this.init(param);
				setTimeout(()=>{
					this.sortShow = false;
				},600)
			},
			goDetail(id,type,addr,biz_type,lat,lng){//去车辆详情页
				sessionStorage.setItem('branch_id',id);
				sessionStorage.setItem('type',type);
				sessionStorage.setItem('addr',addr);
				sessionStorage.setItem('biz_type',biz_type);
				sessionStorage.setItem('latdetail',lat);
                sessionStorage.setItem('lngdetail',lng);      
//              sessionStorage.setItem('city_id',this.city_id);
				window.location.href='fourList.html#/fourDetail?enter=four'
			},
			goNote(){//调度说明
				this.noteShow = true;
			},
			goAllmap(){//去查询车辆网点页
				sessionStorage.setItem('type',this.tabId);
				//防止搜索后数据存留，清除缓存
				sessionStorage.removeItem('fourMapLng')
            	sessionStorage.removeItem('fourMapLat')
           		sessionStorage.removeItem('fourMapId')
				window.location.href='dispatchmap.html?type='+this.tabId+'&enter=four';
			},
			onreLoad(){//右上角的刷新按钮
				$('.mint-loadmore-content').scrollTop(0)
			    setTimeout(() => {
					 var param = {
					 	"mobile":sessionStorage.getItem('mobile'),
						'lng':sessionStorage.getItem('lng'),		//经度
						'lat':sessionStorage.getItem('lat'),		//维度
						'type':this.tabId,			//1紧急调离2普通调离3调入
						'sort':this.sort_type,//1距离  2车辆数
						'page':'1'		//int	页码
					}
					var biz_type = sessionStorage.getItem('check_biz_type')
					var loca_check = sessionStorage.getItem('loca_check')
					if(biz_type==0||biz_type==1){param.biz_type = biz_type;}
					if(loca_check==1){param.is_local = loca_check;}
					if(loca_check==3||loca_check==4){
						param.drive_day = loca_check;
					}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						param.status = statusArr;
					}
					if(this.resetAll){
						delete param.biz_type;
						delete param.is_local;
						delete param.drive_day;
						delete param.status
					}
			        var _this = this;
					myAjax.post(getApiUrl('/limit-line/transfer-list'), param, function (data) {
						if(data.status==0){
							_this.fourData = data.data;
							for(var i=0;i<_this.fourData.length;i++){
								_this.city_id = _this.fourData[i].city_id;
							}
							_this.isShow = true;
					 		_this.msg = '刷新成功';
					 		setTimeout(()=>{_this.isShow=false;},2000)
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg;
					 		setTimeout(()=>{_this.isShow=false;},2000)
				 		}
					})
					
			    }, 1000)
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
						'lng':sessionStorage.getItem('lng'),		//经度
						'lat':sessionStorage.getItem('lat'),		//维度
						'type':this.tabId,			//1紧急调离2普通调离3调入
						'sort':this.sort_type,//1距离  2车辆数
						'page':this.pageNum		//int	页码
					}
			       
			        var biz_type = sessionStorage.getItem('check_biz_type')
					var loca_check = sessionStorage.getItem('loca_check')
					if(biz_type==0||biz_type==1){param.biz_type = biz_type;}
					if(loca_check==1){param.is_local = loca_check;}
					if(loca_check==3||loca_check==4){
						param.drive_day = loca_check;
					}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						param.status = statusArr;
					}
					if(this.resetAll){
						delete param.biz_type;
						delete param.is_local;
						delete param.drive_day;
						delete param.status;
					}
			        var _this = this;
			        
					myAjax.post(getApiUrl('/limit-line/transfer-list'), param, function (data) {
						if(data.status==0){ 
							_this.loading = false;
					 		var reList = data.data;
					 		if(reList.length==0){
	//						 			_this.noData=true;
		                        _this.allLoaded = true;
		                        
					 		}
					 		var arr = _this.fourData
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 		}
					 		_this.fourData = [];
					 		_this.fourData = arr;
					 		for(var i=0;i<_this.fourData.length;i++){
								_this.city_id = _this.fourData[i].city_id;
							}
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
							'lng':sessionStorage.getItem('lng'),		//经度
							'lat':sessionStorage.getItem('lat'),		//维度
							'type':this.tabId,			//1紧急调离2普通调离3调入
							'sort':this.sort_type,//1距离  2车辆数
							'page':'1'		//int	页码
						}
						var biz_type = sessionStorage.getItem('check_biz_type')
						var loca_check = sessionStorage.getItem('loca_check')
						if(biz_type==1||biz_type==0){param.biz_type = biz_type;}
						if(loca_check==1){param.is_local = loca_check;}
						if(loca_check==3||loca_check==4){
							param.drive_day = loca_check;
						}
						//多选
						var statusArr = sessionStorage.getItem('fourStatus');
						if(statusArr){
							param.status = statusArr;
						}						
						if(this.resetAll){
							delete param.biz_type;
							delete param.is_local;
							delete param.drive_day;
							delete param.status;
						}
						
						this.init(param);
					},100)
			      	$('.mint-loadmore-content').scrollTop(0);
		          this.allLoaded = false;
		          this.$refs.loadmore.onTopLoaded();
		        }, 1500);
		    },
			goGroup(){
				sessionStorage.removeItem('tabId');
				sessionStorage.removeItem('groupType');
				sessionStorage.removeItem('typeTitle');
				window.location.href='fourList.html#/groupTask'
			}
		}
	}
	
	
</script>
<style>
</style>