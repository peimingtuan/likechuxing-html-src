<!--
	作者：xurui_518@163.com
	时间：2018-08-10
	描述：成都限行列表页面
-->
<template>
	<div class="limitIndex">
		<div class="four_header fc33">
		    <div class="det_header">
				<p class="header_item" @click="goSearch()">
					<span class="detail_icon"><img src="../image/icon_search.png"/></span><span>搜索</span>
				</p>
				<p class="header_item item_center" @click="openFil()">
					<span class="detail_icon"><img src="../image/icon_filter.png"/></span><span>筛选</span>
				</p>
				<p class="header_item item_center2" @click="sortShow=true">
					<span class="detail_icon"><img src="../image/icon_sort.png"/></span><span>排序</span>
				</p>
				<p class="header_item" @click="onreLoad()">
					<span class="detail_icon"><img src="../image/icon_refresh.png"/></span><span>刷新</span>
				</p>
			</div>
			<div class="four_tab limit_tab">
				<!--tab栏-->
				<div class="limits" id="tab0" @click="changeTab($event,0)">今日限行</div>
				<div class="limits" id="tab1" @click="changeTab($event,1)">明日限行</div>
			</div>
			
		    <p class="p2">
		        <span class="check_net" @click="goAllmap()">查看地图网点</span>
		        <span class="show_dock" @click="goNote()">调度说明</span>
		    </p>
		</div>
		<div class="four_content fc33" v-show="limitData.length>0"> 
			<!--上拉加载，下拉刷新-->
			<!--<vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">-->
	            <!--tab栏切换内容-->
	            <mt-loadmore :top-method="loadTop" :autoFill=false :distance-index='1' @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
	            	<div v-for="(fourItem,index) in limitData" class="four_item" @click="goDetail(fourItem.branch_id,fourItem.name,fourItem.biz_type,fourItem.lat,fourItem.lng,fourItem.limit_num,fourItem.area)">
				  		<div class="fourList_left">
				  			<p class="fourlist_addrp">
				  				<span class="fourList_type" :class="fourItem.area==0?'four_not':'onNo'">{{fourItem.area==0?'非':'限'}}</span>
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
				  			<p class="fc99 num_dis">车辆数
				  				<span class="fourlist_num fc33">{{fourItem.limit_num}}</span>
				  			</p>
				  		</div>
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
								<span class="fildec_items filmore" :id = 'items.id' :class="[items.id==1||items.id==103||items.id==102?'isOne':'notOne']" v-for="(items,index) in moreData" @click="checkList(items.id,$event)">{{items.name}}({{items.count}})</span>
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
					<p class="sort_item" :id="'sort'+sortItem.sortType" v-for="sortItem in sort" @click="sortCheck(sortItem.sortType,$event)">
						<span :class="sortItem.sortType==0?'is_sort':'no_sort'" @click="gosort(sortItem.sortType,$event)">{{sortItem.sortCont}}</span>
						<span class="sort_icon" v-show="sortItem.sortType==0">
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
				<span class="note_time" v-for="item in noteTime">{{item}}</span>
			</div>
			<div class="note_close" @click="filClose()">
				<img src="../image/dispatch/close-btn.png"/>
			</div>
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
	
	import { Navbar, TabItem,Loadmore } from 'mint-ui';
	import authSingObj from '../js/signature'

	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				//假数据
				limitData:[],//列表数据
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
					{"sortCont":"限行车辆数从大到小",'sortType':'0'},
					{"sortCont":"距离网点从近到远",'sortType':'1'}
				],
				tabId:sessionStorage.getItem('type')||0,//当前tab栏
				isShow:false,//toast提示
				msg:'',//toast提示内容
				sort_type:'0',//排序
				loca_check:'10',//地点车牌
				biz_type:'10',//合作类型
				pageNum:'1',//分页
				icon_addr:'',
				city_id:'',
				resetAll:false,//是否重置
				noteData:["1.通过限行车辆列表可查询各网点限行车辆数据","2.请把限行车辆调到指定停放网点","3.调度时间不得超过限行执行时间"],//调度说明需求
				noteTime:["  普通限行：7:30-20:00；","  橙色污染限行：6:00-22:00；","  红色污染限行：3:00-24:00。"],
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
		        filterData1:[//筛选弹层内容，单选
						{"title":"网点合作类型","all":[{"name":"全部网点","type":"10"},{"name":"B类网点","type":"1"},{"name":"B+类网点","type":"2"}],"type":"s1"},
					],
		        notMore:false,//初次加载是否有分页数据
		        botText:''

			}
		},
		beforeCreate () {
			document.title = '限行列表';
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			//初始化tab栏
			$('#tab'+this.tabId).addClass('limits_now');
			$('#tab'+this.tabId).siblings().removeClass('limits_now');
			//初始化筛选框内容
			var param = {
				"mobile":sessionStorage.getItem('mobile'),
				"type":this.tabId
			}
			var _this = this;
			myAjax.post(getApiUrl('/cheng-du-limit/filter'), param, function (data) {
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
			},80)
			sessionStorage.removeItem('fourEnter');
			this.loaded= new Loading()//加载loading
			//本地环境时放开，上测试时注释
			/*$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
			$('#1,#102,#103').removeClass("bg_white").addClass('bg_black');
			var params = {
					"mobile":sessionStorage.getItem('mobile')||'13521758602',
					'lng':sessionStorage.getItem('lng')||'116.298611',		//经度
					'lat':sessionStorage.getItem('lat')||'40.044257',		//维度
					'type':this.tabId,			//0 今日限行  1 明日限行
					'sort_type':'0',//1车辆数   2距离
					'page':'1'		//int	页码
				}
			//如果有筛选条件，加上筛选的条件
			var biz_type = sessionStorage.getItem('check_biz_type')
			if(biz_type==1||biz_type==2){params.biz_type = biz_type;}
			//多选
			var statusArr = sessionStorage.getItem('fourStatus');
			if(statusArr){
				params.car_status = statusArr;
			}
			this.init(params);*/
		},
		methods:{
			changeTab(e,tabId){//切换tab方法
				this.tabId = tabId;
				this.sort_type = 0;
				$('#sort0').children().removeClass("no_sort").addClass('is_sort');
				$('#sort0').siblings().children().removeClass("is_sort").addClass('no_sort');
				$('#sort0').children('.sort_icon').css('display','inline-block');
				$('#sort0').siblings().children('.sort_icon').css('display','none');
				sessionStorage.setItem('type',this.tabId);
				$(e.target).addClass('limits_now');
				$(e.target).siblings().removeClass('limits_now');
				this.pageNum = 1;//初始化分页
            	this.scrollData.noFlag = false;//如果其他tab请求了分页，初始化状态
            	this.biz_type = 10;//如果其他tab，初始化状态
            	$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#1,#102,#103').removeClass("bg_white").addClass('bg_black');
				sessionStorage.setItem('fourStatus','1,102,103')
            	sessionStorage.removeItem('check_biz_type')
            	$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.mint-loadmore-content').scrollTop(0);//使页面回到顶部
				$('.four_content').scrollTop(0);//使页面回到顶部
            	this.allLoaded = false;
            	this.notMore = false;
            	this.pullla = false;
            	var param = {
            		"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort_type':0,//1距离 2车辆数
					'page':'1'		//int	页码
				}
					delete param.biz_type;
					delete param.car_status;
				this.init(param);
			},
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
			dingding(){//钉钉授权等
				var url = window.location.href
				var newUrl = url.substr(0,url.indexOf(location.hash));
				var that = this;
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
					    title : '限行列表',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
					dd.ui.webViewBounce.disable(); 
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
								'type':that.tabId,			//0今日 1明日
								'sort_type':that.sort_type,//1距离  0车辆数
								'page':'1'		//int	页码
							}
							//如果有筛选条件，加上筛选的条件
							var biz_type = sessionStorage.getItem('check_biz_type')
							if(biz_type==1||biz_type==2){param.biz_type = biz_type;}
							//多选
							var statusArr = sessionStorage.getItem('fourStatus');
							if(statusArr){
								param.car_status = statusArr;
							}else{
								$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
								$('#1,#103,#102').removeClass("bg_white").addClass('bg_black');
							}
							 
				            that.init(param);
						},
						onFail: function (err) {
					            console.log(err);
					            that.isShow = true;
					 		that.msg = '钉钉定位失败，请查看定位';
					 		setTimeout(()=>{that.isShow=false;},2000)
					        }
						});
					});
			/**********************处理返回按钮*******************/
					/*document.addEventListener('backbutton', function (e) {
			        // 在这里处理你的业务逻辑
				        e.preventDefault(); //backbutton事件的默认行为是回退历史记录，如果你想阻止默认的回退行为，那么可以通过preventDefault()实现
				        window.location.href="../index.html";
				    });
				    dd.biz.navigation.setLeft({
				        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
				        text: '',//控制显示文本，空字符串表示显示默认文本
				        onSuccess: function (result) {
				            window.location.href="../index.html";
				        },
				        onFail: function (err) {
				        }
				    });*/
				
			},
			init(param){
				var _this = this;
				$('.four_content').css('padding-bottom','0')
				myAjax.post(getApiUrl('/cheng-du-limit/list'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.limitData = data.data;
						for(var i=0;i<_this.limitData.length;i++){
							_this.city_id = _this.limitData[i].city_id;
						}
//						_this.limitData = _this.limitData.slice(2,-1)//本地测试数据使用
						_this.allLoaded = false;
            			_this.notMore = false;
						if(_this.limitData.length!=10){_this.allLoaded = true;_this.botText=''}else{
							_this.allLoaded = false;
						}
						if(_this.limitData.length<=8){
							$('.mint-loadmore').height(document.documentElement.clientHeight-$('.four_header').height());
							$('.mint-loadmore').css('overflow','scroll');
							_this.botText=''
						}else{
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
			goSearch(){//去搜索页面
				sessionStorage.setItem('type',this.tabId);
				window.location.href = '../carProblemsList/proOrder.html#/searchPro?enter=chengdu';
			},
			filClose(){//关闭筛选层
				this.filterShow = false;
				this.sortShow = false;
				this.noteShow = false;
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('.limitIndex').css('overflow':'auto');
			},
			openFil(){//点击筛选按钮事件
				this.filterShow=true;
				var param = {
					"mobile":sessionStorage.getItem('mobile'),
					"type":this.tabId}
				var _this = this;
				myAjax.post(getApiUrl('/cheng-du-limit/filter'), param, function (data) {
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
					if(statusArr=='1,102,103'||!statusArr){//默认空闲//如果有历史筛选，展示出
						$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
						$('#1,#103,#102').removeClass("bg_white").addClass('bg_black');
					}else if(statusArr&&statusArr!='-1'){
						var status = statusArr.split(',');
						 for(var i=0;i<status.length;i++){//车伤部位
						 	if(status[i]!=1){
						 		$('#'+status[i]).removeClass("bg_white").addClass('bg_black');
						 	}else if(status[i]==1){
						 		$('#1').removeClass("bg_white").addClass('bg_black');
						 	}else if(status[i]==102){
						 		$('#102').removeClass("bg_white").addClass('bg_black');
						 	}else if(status[i]==103){
						 		$('#103').removeClass("bg_white").addClass('bg_black');
						 	}
						 	
						 }
					}else if(statusArr=='-1'){
						$('.filmore').removeClass("bg_black").addClass('bg_white');
						$('.filmore1').removeClass("bg_white").addClass('bg_black');
					}
				this.biz_type = sessionStorage.getItem('check_biz_type')
				if(this.biz_type==1||this.biz_type==2){
					$('#s1'+this.biz_type).removeClass("bg_white").addClass('bg_black');
					$('#s1'+this.biz_type).siblings().removeClass("bg_black").addClass('bg_white');
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
				this.pageNum = 1;
				var param = {
					"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort_type':this.sort_type,//1距离 0车辆数
					'page':'1'		//int	页码
				}
				if(this.biz_type==1||this.biz_type==2){
					param.biz_type = this.biz_type;
					sessionStorage.setItem('check_biz_type',this.biz_type)
				}else{
					sessionStorage.removeItem('check_biz_type');
				}
				if(statusArrs){
					param.car_status = statusArrs;
					sessionStorage.setItem('fourStatus',statusArrs)
				}
				if(this.resetAll){
					delete param.biz_type;
					delete param.drive_day;
					delete param.car_status;
				}
				this.allLoaded = false;
            	this.notMore = false;
				this.init(param);
				this.filterShow = false;
			},
			resetbtn(){//重置
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#1,#102,#103').removeClass("bg_white").addClass('bg_black');
				this.biz_type = '10';
				this.loca_check='10';
				this.resetAll = true;
				//把push列表置空
			},
			gosort(sort,e){//触发到子节点的时候触发 排序时带着当前的筛选类型
				e.stopPropagation();
				$(e.target).parent().children().removeClass("no_sort").addClass('is_sort');
				$(e.target).parent().siblings().children().removeClass("is_sort").addClass('no_sort');
				$(e.target).parent().children('.sort_icon').css('display','inline-block');
				$(e.target).parent().siblings().children('.sort_icon').css('display','none');
				this.sort_type = sort;
				this.pageNum = 1;
				var param = {
					"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort_type':this.sort_type,
					'page':'1'		//int	页码
				}
				//多选
				var statusArr = sessionStorage.getItem('fourStatus');
				if(statusArr){
					param.car_status = statusArr;
				}
				if(this.biz_type==1||this.biz_type==2){param.biz_type = this.biz_type;}
				if(this.resetAll){
					delete param.biz_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.car_status;
				}
				this.init(param);
				setTimeout(()=>{
					this.sortShow = false;
				},600)
			},
			sortCheck(sort,e){//排序内容  排序时带着当前的筛选类型
				$(e.target).children().removeClass("no_sort").addClass('is_sort');
				$(e.target).siblings().children().removeClass("is_sort").addClass('no_sort');
				$(e.target).children('.sort_icon').css('display','inline-block');
				$(e.target).siblings().children('.sort_icon').css('display','none');
				this.sort_type = sort;
				this.pageNum = 1;
				var param = {
					"mobile":sessionStorage.getItem('mobile'),
					'lng':sessionStorage.getItem('lng'),		//经度
					'lat':sessionStorage.getItem('lat'),		//维度
					'type':this.tabId,			//1紧急调离2普通调离3调入
					'sort_type':this.sort_type,
					'page':'1'		//int	页码
				}
				//以下为排序后查看是否有筛选条件
				//多选
				var statusArr = sessionStorage.getItem('fourStatus');
				if(statusArr){
					param.car_status = statusArr;
				}
				if(this.biz_type==1||this.biz_type==2){param.biz_type = this.biz_type;}
				if(this.resetAll){
					delete param.biz_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.car_status;
				}
				this.init(param);
				setTimeout(()=>{
					this.sortShow = false;
				},600)
			},
			goDetail(id,addr,biz_type,lat,lng,limit_num,area){//去车辆详情页
				sessionStorage.setItem('branch_id',id);
				sessionStorage.setItem('type',this.tabId);
				sessionStorage.setItem('addr',addr);
				sessionStorage.setItem('biz_type',biz_type);
				sessionStorage.setItem('latdetail',lat);
                sessionStorage.setItem('lngdetail',lng);      
                sessionStorage.setItem('limitNum',limit_num);      
                sessionStorage.setItem('area',area);      
//              sessionStorage.setItem('city_id',this.city_id);
				window.location.href='CDList.html#/limitDetail?enter=four'
			},
			goNote(){//调度说明
				this.noteShow = true;
				$('.limitIndex').css('overflow':'hidden');
			},
			goAllmap(){//去查询车辆网点页
				sessionStorage.setItem('type',this.tabId);
				window.location.href='dispatchmap.html?type='+this.tabId+'&enter=four';
			},
			onreLoad(){//右上角的刷新按钮
				$('.mint-loadmore-content').scrollTop(0)
				this.pageNum = 1;
			    setTimeout(() => {
					 var param = {
					 	"mobile":sessionStorage.getItem('mobile'),
						'lng':sessionStorage.getItem('lng'),		//经度
						'lat':sessionStorage.getItem('lat'),		//维度
						'type':this.tabId,			//1紧急调离2普通调离3调入
						'sort_type':this.sort_type,//1距离  0车辆数
						'page':'1'		//int	页码
					}
					var biz_type = sessionStorage.getItem('check_biz_type')
					if(biz_type==1||biz_type==2){param.biz_type = biz_type;}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						param.car_status = statusArr;
					}
					if(this.resetAll){
						delete param.biz_type;
						delete param.is_local;
						delete param.drive_day;
						delete param.car_status
					}
			        var _this = this;
					myAjax.post(getApiUrl('/cheng-du-limit/list'), param, function (data) {
						if(data.status==0){
							_this.limitData = data.data;
							if(_this.limitData.length!=10){_this.allLoaded = true;}else{
								_this.allLoaded = false;
							}
							for(var i=0;i<_this.limitData.length;i++){
								_this.city_id = _this.limitData[i].city_id;
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
				        "mobile":sessionStorage.getItem('mobile')||'13521758602',
						'lng':sessionStorage.getItem('lng'),		//经度
						'lat':sessionStorage.getItem('lat'),		//维度		
						'type':this.tabId,			//1紧急调离2普通调离3调入
						'sort_type':this.sort_type,//1距离  0车辆数
						'page':this.pageNum		//int	页码
					}
			       
			        var biz_type = sessionStorage.getItem('check_biz_type')
					if(biz_type==1||biz_type==2){param.biz_type = biz_type;}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						param.car_status = statusArr;
					}
					if(this.resetAll){
						delete param.biz_type;
						delete param.is_local;
						delete param.drive_day;
						delete param.car_status;
					}
			        var _this = this;
			        
					myAjax.post(getApiUrl('/cheng-du-limit/list'), param, function (data) {
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
					 		var arr = _this.limitData
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 		}
					 		_this.limitData = [];
					 		_this.limitData = arr;
					 		for(var i=0;i<_this.limitData.length;i++){
								_this.city_id = _this.limitData[i].city_id;
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
							'sort_type':this.sort_type,//1距离  0车辆数
							'page':'1'		//int	页码
						}
						var biz_type = sessionStorage.getItem('check_biz_type')
						if(biz_type==1||biz_type==2){param.biz_type = biz_type;}
						//多选
						var statusArr = sessionStorage.getItem('fourStatus');
						if(statusArr){
							param.car_status = statusArr;
						}						
						if(this.resetAll){
							delete param.biz_type;
							delete param.is_local;
							delete param.drive_day;
							delete param.car_status;
						}
						
						this.init(param);
					},100)
			      	$('.mint-loadmore-content').scrollTop(0);
		          this.allLoaded = false;
		          this.notMore = false;
		          this.$refs.loadmore.onTopLoaded();
		        }, 1500);
		    },
		}
	}
	
	
</script>
<style>
</style>