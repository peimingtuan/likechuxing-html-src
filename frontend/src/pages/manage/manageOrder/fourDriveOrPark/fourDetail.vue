<template>
	<div class="fourDetail">
		<div class="detail_header fc33">
			<div class="four_item">
		  		<div class="fourList_left">
		  			<p class="fourList_id fc66">{{branch_id}}</p>
		  			<p class="fourlist_addrp">
		  				<span class="fourList_type" :class="type==1||type==2?'fourList_type':'four_not'">{{type==1||type==2?'限':'非'}}</span>
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
		  			全部车辆
		  		</span>
		  		<span>
		  			共 {{detailData.length}} 辆
		  		</span>
		  	</p>
		</div>
		<div class="detail_cont fc33">
			<mt-loadmore :top-method="loadTop" :distance-index='1' @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
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
						<p class="fourdet_three">
							<span class="three_title">
								<span>今</span>
								<span>明</span>
							</span>
							<span class="three_type">
								<span :class="item.limit==0?'is_drive':item.limit==1?'is_park':'is_stay'"  v-for="item in fourItem.limit_record">
									{{item.limit==0?'开':item.limit==1?'停':'待'}}
								</span>
							</span>
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
		 
		 
		        wrapperHeight: 0,
		 
		 
		 
		        topStatus: '',
		        //wrapperHeight: 0,
		        translate: 0,
		        moveTranslate: 0,
		        pullla:false,
				
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
//				$('.detail_scroll').css('top','-.35rem');
				$('.detail_cont').height($(window).height()-$('.detail_header').height());
				$('.mint-loadmore').height($(window).height()-$('.detail_header').height());
			},80)
			this.loaded= new Loading()//加载loading
			var url = window.location.href
			this.enter = this.getUrl(url).enter||sessionStorage.getItem('fourEnter');
			this.init();
		},
		methods:{
			init(){
				this.type==1?this.fourTitle='紧急调离限行区':this.type==2?this.fourTitle='调离限行区':this.fourTitle='调入限行区'
				var that = this;
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : that.fourTitle,//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
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
	            //初始化请求接口
				var params = {
					mobile:sessionStorage.getItem('mobile'),
					'branch_id':sessionStorage.getItem("branch_id"),
					'type':sessionStorage.getItem('type')
				};
				if(this.enter=='four'){
					if(sessionStorage.getItem('fourStatus')){params.status = sessionStorage.getItem('fourStatus') }
		            if(sessionStorage.getItem('check_biz_type')){params.biz_type = sessionStorage.getItem('check_biz_type') }
		            if(sessionStorage.getItem('loca_check')){
		            	if(sessionStorage.getItem('loca_check')==3||sessionStorage.getItem('loca_check')==4){
		            		params.drive_day = sessionStorage.getItem('loca_check')
		            	}else{
		            		params.is_local = sessionStorage.getItem('loca_check')
		            	}
		            	
		            }
	            }else{
	            	params.status='1,21';
	            }
				var _this = this;
//				myAjax.post('http://192.168.0.32:8080/limit-line/transfer-list', param, function (data) {
				myAjax.post(getApiUrl('/limit-line/transfer-branch-cars'), params, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.detailData = data.data;
						
						
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
            	console.log('具体数字')
            	console.log(sessionStorage.getItem('lngdetail'))
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
			goMap(){//去网点地图
				window.location.href='dispatchmap.html?type='+this.type;
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
		    loadTop() {
		    	setTimeout(() => {
		      	$('.fourDetail').scrollTop(0);
		      	var params = {
		      		mobile:sessionStorage.getItem('mobile'),
					'branch_id':sessionStorage.getItem("branch_id"),
					'type':sessionStorage.getItem('type')
				};
				if(sessionStorage.getItem('fourStatus')){params.status = sessionStorage.getItem('fourStatus') }
	            if(sessionStorage.getItem('check_biz_type')){params.biz_type = sessionStorage.getItem('check_biz_type') }
	            if(sessionStorage.getItem('loca_check')){
	            	if(sessionStorage.getItem('loca_check')==3||sessionStorage.getItem('loca_check')==4){
	            		params.drive_day = sessionStorage.getItem('loca_check')
	            	}else{
	            		params.is_local = sessionStorage.getItem('loca_check')
	            	}
	            	
	            }
				var _this = this;
				myAjax.post(getApiUrl('/limit-line/transfer-branch-cars'), params, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.detailData = data.data;
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
		          this.allLoaded = false;
		          this.$refs.loadmore.onTopLoaded();
		         },1500)
		    },
		    
		}
	}
	
</script>

<style>
</style>