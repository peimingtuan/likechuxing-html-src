<!--
	作者：xurui_518@163.com
	时间：2018-08-10
	描述：成都限行详情
-->
<template>
	<div class="limitDetail">
		<div class="detail_header fc33">
			<div class="four_item">
		  		<div class="fourList_left">
		  			<p class="fourlist_addrp">
		  				<span class="fourList_type" :class="area!=0?'fourList_type':'four_not'">{{area!=0?'限':'非'}}</span>
		  				&nbsp;&nbsp;
		  				<span class="icon_addr">
							<img src="../image/mapb.png" alt="" v-if="biz_type==0"/>
							<img src="../image/map-B.png" alt=""  v-else/>
						</span>
						&nbsp;
		  				<span class="fourList_addr fc33">{{addr}}</span>
		  			</p>
		  		</div>
		  		<div class="fourList_right">
		  			<p class="fc99 num_dis" @click="goGuide()">
		  				<span class="icon_guide">
		  					<img src="../image/carNetstock/daohang.png" alt="" />
		  				</span>
		  				<span>
		  					导航
		  				</span>
		  			</p>
		  		</div>
		  	</div>
		  	<p class="detail_title">
		  		<span>
		  			全部限行车辆
		  		</span>
		  		<span>
		  			共 {{limitNum}} 辆
		  		</span>
		  	</p>
		</div>
		<div class="detail_cont fc33">
	        <mt-loadmore :top-method="loadTop" :autoFill=false :distance-index='1' @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
				<ul class="detail_scroll">
					<li class="fourdet_item" v-for="(fourItem,index) in detailData" @click="goCreate(fourItem.plate_no,fourItem.vin)">
						<p class="fourdet_one">
							<span class="fc33">
								<span class="car_num fc33">{{fourItem.plate_no}}</span>
								(<span class="fc99">{{fourItem.vin.substring(0, 11)}}</span>
									<span class="fc33">{{fourItem.vin.substring(11, 17)}}</span>
								)
							</span>
							<span class="det_addr fc66">
								{{fourItem.current_parking_floor}}-{{fourItem.current_parking_no}}
							</span>
						</p>
						<p class="fourdet_two">
							<span class="two_type">{{fourItem.status_name}}</span>
							<span class="two_type">{{fourItem.model_name}}</span>
							<span class="two_type">{{fourItem.color}}</span>
							<span class="two_type">约续航{{fourItem.remain_km}}公里</span>
						</p>
					</li>
				</ul>
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
		        <div v-show="notMore" class="nullData">没有更多数据了</div>
			</mt-loadmore>
		</div>
		<div id="dispatch-map"></div>
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
	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				detailData:[],
				//上拉加载，下拉刷新功能
      			counter: 1, //当前页
                pages: 10, // 一页显示多少条
                pageStart: 0, // 开始页数
                pageEnd: 0, // 结束页数
                listdata: [], // 下拉更新数据存放数组
                scrollData: {
                    noFlag: false //暂无更多数据显示
                },
                isShow:false,
                msg:'',
                branch_id:sessionStorage.getItem("branch_id"),
				type:sessionStorage.getItem('type'),
				biz_type:sessionStorage.getItem('biz_type'),
				addr:sessionStorage.getItem('addr'),
				fourTitle:'',
				enter:'',
				list: [],
		        allLoaded: false,
		        bottomStatus: '',
		        wrapperHeight: 0,
		        topStatus: '',
		        //wrapperHeight: 0,
		        translate: 0,
		        moveTranslate: 0,
		        pullla:false,
		        kw:'',//是否是搜索进来的页面
		        notMore:false,
		        pageNum:1,//分页数据
		        limitNum:sessionStorage.getItem('limitNum'),//全部车辆
		        isTrue:true,
		        area:sessionStorage.getItem('area'),//判断限非
				
			}
		},
		beforeCreate () {
			document.title = '网点车辆详情';
		},
		created(){
			
			
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			setTimeout(()=>{
				$('.detail_cont').height(document.documentElement.clientHeight-$('.detail_header').height());
			},80)
			this.loaded= new Loading()//加载loading
			var url = window.location.href
			this.enter = this.getUrl(url).enter||sessionStorage.getItem('fourEnter');
			this.kw = this.getUrl(url).kw
//			if(this.limitNum<=5&&!this.kw){
			if(this.limitNum<=5){
				$('.mint-loadmore').height(document.documentElement.clientHeight-$('.detail_header').height());
				$('.mint-loadmore').css('overflow','scroll');
			}
			this.init();
		},
		methods:{
			dingding(){
				this.type==0?this.fourTitle='今日限行':this.fourTitle='明日限行'
				this.type==0?document.title ='今日限行':document.title ='明日限行'
				var that = this;
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : that.fourTitle,//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
					dd.ui.webViewBounce.disable();
			/**********************处理返回按钮*******************/
					/*document.addEventListener('backbutton', function (e) {
			        // 在这里处理你的业务逻辑
			        	e.preventDefault(); //backbutton事件的默认行为是回退历史记录，如果你想阻止默认的回退行为，那么可以通过preventDefault()实现
			        	if(that.kw){
							window.location.href = '../carProblemsList/proOrder.html#/searchPro?enter=chengdu';
					    }else if(that.enter=='map'){
					    	window.location.href='dispatchmap.html?type='+that.type+'&enter=four';
					    }else{
					    	window.location.href='CDList.html#/limitIndex'
					    }
				    });
				    dd.biz.navigation.setLeft({
				        control: that.isTrue,//是否控制点击事件，true 控制，false 不控制， 默认false
				        text: '',//控制显示文本，空字符串表示显示默认文本
				        onSuccess: function (result) {
				            if(that.kw){
								sessionStorage.setItem('type',that.type);
								window.location.href = '../carProblemsList/proOrder.html#/searchPro?enter=chengdu';
						    }else if(that.enter=='map'){
						    	window.location.href='dispatchmap.html?type='+that.type+'&enter=four';
						    }else{
						    	window.location.href='CDList.html#/limitIndex'
						    }
				        },
				        onFail: function (err) {
				        }
				    });*/
				})
				//初始化加载地图不显示，导航时直接进入地图导航页面
				let map = new AMap.Map('dispatch-map', {
	                resizeEnable: true,
	                zoom: 13,
	                center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
	            });
				//初始化加载数据
	            let Array = [],
	                smallicon = [],//存放小图标
	                bigicon = [];//存放大图标
	            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
	                let positionPicker = new PositionPicker({
	                    position: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')],
	                    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
	                    iconStyle: {//自定义外观
	                        url: require("../image/location.png"),//图片地址
	                        size: [25, 50],  //要显示的点大小，将缩放图片
	                        ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
	                    },
	                    map: map
	                });
	                positionPicker.on('success', function (positionResult) {
	                    // 使用clearMap方法删除所有覆盖物
	                    map.clearMap();
	                    Array = [];
	                    smallicon = [];
	                    bigicon = [];
//	                    netshow(param)
	                });
	                positionPicker.start();
	            });
				 that.driving;
	            AMap.plugin(["AMap.Driving"], function () {
	                var drivingOption = {
	                    policy: AMap.DrivingPolicy.LEAST_TIME,
	                    map: ''
	                };
	                that.driving = new AMap.Driving(drivingOption); //构造驾车导航类
	            });
			},
			init(){
				this.dingding();
	            //初始化请求接口
				var params = {
					"mobile":sessionStorage.getItem("mobile"),
					'branch_id':sessionStorage.getItem("branch_id"),
					'type':sessionStorage.getItem('type'),
					'page':'1'
				};
				if(this.kw||this.enter=="kw1"){
					params.kw = this.kw;
				}else{
					var biz_type = sessionStorage.getItem('check_biz_type')
					if(biz_type==1||biz_type==2){params.biz_type = biz_type;}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						params.car_status = statusArr;
					}
				}
				
				var _this = this;
				myAjax.post(getApiUrl('/cheng-du-limit/list'), params, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.detailData = data.data;
						if(_this.detailData.length!=10){_this.allLoaded = true;}else{
							_this.allLoaded = false;
						}
						$('.detail_cont').height(document.documentElement.clientHeight-$('.detail_header').height());
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
			 //根据起终点坐标规划驾车路线
            goGuide() {
            	var that = this;
            	that.isTrue = false;
//          	this.dingding();
                that.driving.search(
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [sessionStorage.getItem('lngdetail'),sessionStorage.getItem('latdetail') ],
                    function (status, result) {
                        that.driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            },
            goCreate(plate_no,vin){//去创建调度工单
            	var enter;
            	var vins = vin.substring(11, 17)
            	plate_no?enter=plate_no:enter=vins;//有车牌号传车牌，无车牌号传Vin号
            	window.location.href = '../../manageOrderCardetail/index.html?plate_no='+enter;
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
		    handleBottomChange(status) {//监听装填
		        this.bottomStatus = status;
		    },
		    loadBottom() {//上拉加载
		        setTimeout(() => {
		          this.counter++;
	                this.loading = true;
			        this.pageNum ++;
			        var params = {
				        "mobile":sessionStorage.getItem('mobile')||'13521758602',
						'branch_id':sessionStorage.getItem("branch_id"),
						'type':sessionStorage.getItem('type'),
						'page':this.pageNum		//int	页码
					}
			       
//			        var biz_type = sessionStorage.getItem('check_biz_type')
//					if(biz_type==1||biz_type==2){param.biz_type = biz_type;}
//					//多选
//					var statusArr = sessionStorage.getItem('fourStatus');
//					if(statusArr){
//						param.status = statusArr;
//					}
					if(this.kw||this.enter=="kw1"){
						params.kw = this.kw;
					}else{
						var biz_type = sessionStorage.getItem('check_biz_type')
						if(biz_type==1||biz_type==2){params.biz_type = biz_type;}
						//多选
						var statusArr = sessionStorage.getItem('fourStatus');
						if(statusArr){
							params.car_status = statusArr;
						}
					}
			        var _this = this;
					myAjax.post(getApiUrl('/cheng-du-limit/list'), params, function (data) {
						if(data.status==0){ 
							_this.loading = false;
					 		var reList = data.data;
					 		if(reList.length<10){
					 			_this.allLoaded = true;
					 			_this.notMore = true;
					 		}else{
					 			_this.allLoaded = false;
					 		}
					 		if(reList.length==0){
	//						 			_this.noData=true;
		                        _this.allLoaded = true;
		                        _this.notMore = true;
					 		}
					 		var arr = _this.detailData
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 		}
					 		_this.detailData = [];
					 		_this.detailData = arr;
					 		for(var i=0;i<_this.detailData.length;i++){
								_this.city_id = _this.detailData[i].city_id;
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
		    loadTop() {
		    	setTimeout(() => {
//		      	$('.fourDetail').scrollTop(0);
		      	this.pageNum =1;
		      	var params = {
		      		"mobile":sessionStorage.getItem("mobile"),
					'branch_id':sessionStorage.getItem("branch_id"),
					'type':sessionStorage.getItem('type'),
					'page':1
				};
//				if(sessionStorage.getItem('fourStatus')){params.car_status = sessionStorage.getItem('fourStatus') }
//	            if(sessionStorage.getItem('check_biz_type')){params.biz_type = sessionStorage.getItem('check_biz_type') }
	            if(this.kw||this.enter=="kw1"){
					params.kw = this.kw;
				}else{
					var biz_type = sessionStorage.getItem('check_biz_type')
					if(biz_type==1||biz_type==2){params.biz_type = biz_type;}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						params.car_status = statusArr;
					}
				}
				var _this = this;
				myAjax.post(getApiUrl('/cheng-du-limit/list'), params, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.detailData = data.data;
						_this.detailData.length==10?_this.allLoaded = false:_this.allLoaded = true;
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
		          $('.mint-loadmore-content').scrollTop(0);
		          this.notMore = false;
		          this.$refs.loadmore.onTopLoaded();
		         },1500)
		    },
		    
		}
	}
	
</script>

<style>
</style>