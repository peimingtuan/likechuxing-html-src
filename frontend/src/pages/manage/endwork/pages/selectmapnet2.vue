<template>
	<div id="selectmapnet2">
		<!-- 头部文字说明 -->
		<div class="dispatch-top">
			<div class="title-left">{{textArea}}</div>
			<div class="title-right">
				<mt-switch v-model="openbtn" @change="change" class="btn"></mt-switch>
				只看B类
			</div>
		</div>
		<div class="dispatch-search">
			<div class="repair_shop">
				<span class="repair_sear">
				<input type="text" @focus="hisData()" v-model='searchWord' placeholder="请输入网点名称"
					   @input.trim="keyupall($event)"/>
					<img class="input_clearn" @mousedown="clearInput($event)" v-show="isnone"
						 src="../images/close.png"/>
				</span>
				<span class="icon">&#xe605;</span>
			</div>
			<div class="history_items" v-show="ishis">
				<!-- 历史记录列表-->
				<p v-if='result.length==0&&arr.length!=0&&searchWord==""' class="his_title">历史记录
					<span class="delete-icon right" @click="deletesearch">&#xe6db;</span>
				</p>

				<p v-if='result.length==0&&arr.length!=0&&searchWord==""' class="his_list"
				   v-for="(item,index) in arr"
				   @click="hsItem(item)">
					{{item}}
				</p>
				<!-- 搜索结果列表-->
				<p v-if='result.length!=0 && searchWord.length>0' class="history_item"
				   v-for="(item,index) in result"
				   data-type='index'
				   @click="goDec(index,item.name,item.id,item.lng,item.lat,item.biz_type)">
					{{item.name}}
				</p>

				<p class="his_close" @click="ishis=false" v-if='result.length==0&&arr.length!=0&&searchWord==""'>关闭</p>
			</div>
			<div class="noSearch" v-if='limit && searchWord.length>0'>
				<img class="icon_nosearch" src="../images/icon_nosearch.png"/>

				<p>无搜索结果</p>
			</div>
		</div>
		<!-- 地图展示-->
		<div id="dispatch-map"></div>
		<!--刷新页面-->
		<div class="refure-dispatchpage" @click="creatMap">
		    <img src="../images/refre-icon.png"/>
		</div>
		<!--定位icon-->
		<div class="current_location2">
			<img src="../images/mapfg.png"/>
		</div>
		<!--导航弹框-->
		<div class="navition-bottom" v-show="navition">
		    <div class="left">
		        <span class="net"></span><br/>
		        <span class="address"></span>
		    </div>
		    <div class="right">
		        <img class="navition-icon" src="../images/navition-icon.png"/><br/>
		        <span class="">导航</span>
		        <input type="hidden" value="" class="lng"/>
		        <input type="hidden" value="" class="lat"/>
		    </div>
		</div>
		<!-- 底部按钮-->
		<div class="sure-btn normal-color" @click="goendwork()">
			返回
		</div>
	</div>
</template>

<script>
	require("../css/selectmapnet2.css")
	import $ from 'jquery'
	import getApiUrl from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	export default {
	    name: "selectmapnet2",
	    data () {
			return {
				firstenter:true,//首次进入页面
				textArea: '*当前只显示B类网点',
				openbtn: true,//开关是否打开
				map: '',//地图
				smallicon: [],//存放小图标
				bigicon: [],//存放大图标
				Array: [],//拖动地图后，便于清除地图上的图标
				driving: '',//定义驾车导航
				locationsLng: '',
				locationsLat: '',//当前位置经纬度
				branch_id: '',//网点id
				lat:'',
				lng:'',//网点经纬度
				navition: false,//底部网点内容显示与隐藏
				param: {},
				next_id: '',//底部栏展示的网点id
				next_name: '',//底部栏展示的网点名称
				//搜索
				searchWord: '',//input输入内容
				ishis: false,//弹层是否展示
				isnone: false,//全部清除按钮
				searching: true,//模糊查询时间间隔
				limit: false,//有无搜索结果
				result: [],//所有数据
				search_id: '',//搜索的网点id
				arr: JSON.parse(localStorage.getItem('peisearch3')) || []//存储的历史记录信息
			}
	    },
	    mounted () {
	    	this.creatMap();//初始化地图
	    },
	    methods: {
			change(){
				if(this.openbtn){
					this.textArea='*当前只显示B类网点';
					this.openbtn=true;
				}else{
					this.textArea='*当前显示B类及B+类网点';
					this.openbtn=false;
				}
				this.creatMap();
			},
	    	creatMap(){
				let _this=this;
				dd.getLocation({targetAccuracy: 200,
      						coordinate: 1,
      						withReGeocode: true,
      						useCache: true}).then(res => {
							_this.locationsLng=res.longitude;
							_this.locationsLat=res.latitude;
							  userData.save({
								locationsLng:res.longitude,
								locationsLat:res.latitude,
								provice:res.provice,
								city:res.citye,
							  })
					  if(_this.lng||_this.lat){
						userData.save({
							locationsLng: _this.lng,
							locationsLat: _this.lat,
						  })
					  }
				_this.map = new AMap.Map('dispatch-map', {
			            resizeEnable: true,
			            zoom: 13,
			            center: [userData.state.locationsLng, userData.state.locationsLat]
			        });
		        //初始化加载数据
				_this.param = {
		                province_name: userData.state.provice||'北京市',//省
		                city_name: userData.state.city||'北京市',//市
		                lng: userData.state.locationsLng,
				      	lat: userData.state.locationsLat,
				        mobile:userData.state.mobile
		            }
		            if(userData.state.city_ids){
						_this.param.city_id=userData.state.city_ids
					}
					_this.Array = [];
					_this.smallicon = [];//存放小图标
					_this.bigicon = [];//存放大图标
		            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {//拖动定位图标
		                var positionPicker = new PositionPicker({
		                    position: [userData.state.locationsLng, userData.state.locationsLat],
		                    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
		                    iconStyle: {//自定义外观
		                        url: require("../images/location.png"),//图片地址
		                        size: [25, 50],  //要显示的点大小，将缩放图片
		                        ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
		                    },
		                    map: _this.map
		                });
		                positionPicker.on('success', function (positionResult) {
		                    _this.computeDis(positionResult.position.lng,positionResult.position.lat);
		                });
		                positionPicker.start();
		            });  
		          
		        }).catch(err => {
					_this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
		    	})
	    	},
	    	computeDis(lng,lat){//计算拖动距离
	    		let _this = this;
				let m1 = new AMap.Marker({
			        map: _this.map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(userData.state.locationsLng, userData.state.locationsLat)
			    });
	        	let m2 = new AMap.Marker({
			        map: _this.map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(lng, lat)
			    });
		        let p1 = m1.getPosition();
		        let p2 = m2.getPosition();
		        let distances = Math.round(p1.distance(p2));
		        let path = [p1,p2];
               	if(distances==0||distances>=1000){
                    _this.param.lng = lng;
                    _this.param.lat = lat;
               		_this.netshow(_this.param)
               	}
          	},
	    	netshow(param){
	    		let _this = this;
	    		myAjax.post(getApiUrl('/work-order/select-branch'), param).then(res => {
						_this.navition = false;
						_this.searchWord='';
						_this.isnone=false;
	                    if (res.status == '0') {
							let result = res.data;
	                    	 // 使用clearMap方法删除所有覆盖物
		                    _this.map.clearMap();
	                        if (result.length != '0') {
	                            for (var i = 0; i < result.length; i++) {
	                                let netpoint = [result[i].lng, result[i].lat];//网点位置信息
	                                _this.Array.push(netpoint);
	                                addMarker(netpoint, result[i].name, result[i].address, result[i].car_num,result[i].branch_id,result[i].biz_type);//小图标
	                                addMarkerbig(netpoint, result[i].name, result[i].address, result[i].car_num,result[i].branch_id,result[i].biz_type);//大图标
	                            }
	                            //map.setFitView();
	                        } else {
								_this.$_LIKE_toast("附近五公里内没有停车网点");
	                        }
	                    } else {
							_this.$_LIKE_toast(res.msg)
	                    }
	                    // 编写自定义函数,创建小图标标注
	                    function addMarker(netpoint, branch_name, address, lin_recommend_car,branch_id,biz_type) {
							let classtype = '',content='';
							if(_this.openbtn){//只展示B类网点
								if (biz_type == '0') {
									content= '<div class="marker-route2 marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>';  //自定义点标记覆盖物内容
									if (_this.firstenter) {
										_this.firstenter = false;
										_this.branch_id = branch_id;
									}
									let marker = new AMap.Marker({
										position: netpoint,
										offset: new AMap.Pixel(-20.5, -48),
										content: content,
										map: _this.map//创建时直接赋予map属性
									});
									if(_this.branch_id==branch_id){
										marker.hide();
										_this.next_id = branch_id;
										_this.next_name = branch_name;
									}
									_this.smallicon.push(marker);//存放小图标
									marker.on('touchend', function () {
										_this.next_id = branch_id;
										_this.next_name = branch_name;
										for (let j = 0, len = _this.smallicon.length; j < len; j++) {
											_this.smallicon[j].show();
										}
										let that = this;
										that.hide();
										let index = _this.smallicon.indexOf(that);
										for (let i = 0, len = _this.smallicon.length; i < len; i++) {
											_this.bigicon[i].hide();
										}
										_this.bigicon[index].show();
										$(".navition-bottom .net").text(branch_name);
										$(".navition-bottom .address").text(address);
										$(".navition-bottom .lng").val(netpoint[0]);
										$(".navition-bottom .lat").val(netpoint[1]);
										_this.navition = true;
									});
								}
							}else{
								if (biz_type == '0') {
									classtype = 'marker-route2';
								} else {
									classtype = 'marker-route';
								}
								content= '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>';  //自定义点标记覆盖物内容
								let marker = new AMap.Marker({
									position: netpoint,
									offset: new AMap.Pixel(-20.5, -48),
									content: content,
									map: _this.map//创建时直接赋予map属性
								});
								if(_this.branch_id==branch_id){
									marker.hide();
									_this.next_id = branch_id;
									_this.next_name = branch_name;
								}
								_this.smallicon.push(marker);//存放小图标
								marker.on('touchend', function () {
									_this.next_id = branch_id;
									_this.next_name = branch_name;
									for (let j = 0, len = _this.smallicon.length; j < len; j++) {
										_this.smallicon[j].show();
									}
									let that = this;
									that.hide();
									let index = _this.smallicon.indexOf(that);
									for (let i = 0, len = _this.smallicon.length; i < len; i++) {
										_this.bigicon[i].hide();
									}
									_this.bigicon[index].show();
									$(".navition-bottom .net").text(branch_name);
									$(".navition-bottom .address").text(address);
									$(".navition-bottom .lng").val(netpoint[0]);
									$(".navition-bottom .lat").val(netpoint[1]);
									_this.navition = true;
								});
							}
	                    }
	
	                    // 编写自定义函数,创建大图标标注
	                    function addMarkerbig(netpoint, branch_name, address, lin_recommend_car,branch_id,biz_type) {
							let classtype = '',content='';
							if(_this.openbtn){//只展示B类网点
								if (biz_type == '0') {
									content= '<div class="bigmarker-route2 marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>';  //自定义点标记覆盖物内容
									let marker2 = new AMap.Marker({
										position: netpoint,
										offset: new AMap.Pixel(-20.5, -48),
										zIndex:103,
										content: content,
										map: _this.map//创建时直接赋予map属性
									});
									_this.bigicon.push(marker2);//存放大图标
									marker2.hide();
									if(_this.branch_id==branch_id){
										marker2.show();
										$(".navition-bottom .net").text(branch_name);
										$(".navition-bottom .address").text(address);
										$(".navition-bottom .lng").val(netpoint[0]);
										$(".navition-bottom .lat").val(netpoint[1]);
										_this.navition=true;
									}
									marker2.on('click', function () {

									});
								}
							}else{
								if (biz_type == '0') {
									classtype = 'bigmarker-route2';
								} else {
									classtype = 'bigmarker-route';
								}
								content= '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>';  //自定义点标记覆盖物内容
								let marker2 = new AMap.Marker({
									position: netpoint,
									offset: new AMap.Pixel(-20.5, -48),
									zIndex:103,
									content: content,
									map: _this.map//创建时直接赋予map属性
								});
								_this.bigicon.push(marker2);//存放大图标
								marker2.hide();
								if(_this.branch_id==branch_id){
									marker2.show();
									$(".navition-bottom .net").text(branch_name);
									$(".navition-bottom .address").text(address);
									$(".navition-bottom .lng").val(netpoint[0]);
									$(".navition-bottom .lat").val(netpoint[1]);
									_this.navition=true;
								}
								marker2.on('click', function () {

								});
							}
	                    }
	                     //导航
			            AMap.plugin(["AMap.Driving"], function () {
			                var drivingOption = {
			                    policy: AMap.DrivingPolicy.LEAST_TIME,
			                    map: ''
			                };
			                _this.driving = new AMap.Driving(drivingOption); //构造驾车导航类
			            });
			            //根据起终点坐标规划驾车路线
			            $(".navition-bottom .right").on("click", function () {
							_this.driving.search(
									[_this.locationsLng, _this.locationsLat], [$(this).find(".lng").val(), $(this).find(".lat").val()],
			                    function (status, result) {
									_this.driving.searchOnAMAP({
			                            origin: result.origin,
			                            destination: result.destination
			                        });
			                    });
			            });
			            //定位
			            $(".current_location2").on("click", function () {
			                _this.map.panTo([_this.locationsLng, _this.locationsLat]);
			            });
	                }).catch(err => {
				        console.log(err)
				    })
	    	},
			//返回
			goendwork(){
				window.history.back();
			},
	hisData()
	{//展示历史记录
		this.arr && this.arr.length != 0 ? this.ishis = true : this.ishis = false;

	}
	,
	keyupall(e)
	{//模糊查询
		let _this = this;
		if($(".repair_sear input").val().replace(/(^\s*)|(\s*$)/g, '')!=''){//去除空格
			_this.isnone = true;
			if ($(".repair_sear input").val().length > 0 && _this.searching) {
				_this.searching = false;
				myAjax.post(getApiUrl('/branch-car-stock/search'), {
					mobile: sessionStorage.getItem('mobile'),
					city_id: sessionStorage.getItem('city_id'),//权限城市id
					kw: $(".repair_sear input").val()
				}).then(data=>
				{
					if (data.status == 0) {
						if (data.data == ''|| JSON.stringify(data.data) == '{}') {
							_this.limit = true;
							_this.ishis = false;
							_this.result = [];
						}else{
							if (data.data.branch) {//搜索出来的是网点
								_this.result = data.data.branch;
								_this.limit = false;
								_this.ishis = true;
							}
						}
				} else {
					_this.$_LIKE_toast(data.msg)
				}
			}
		)
			setTimeout(function () {
				_this.searching = true;
			}, 500)
		}
	}else{
		_this.isnone = false;
		if(_this.searchWord.length==0){
			//展示历史记录
			_this.result = [];
			_this.hisData()
		}else{
			_this.$_LIKE_toast("输入的值不能为空")
			_this.ishis = false;
		}
	}
	}
	,
	clearInput(e)
	{//清除按钮
		e.preventDefault();
		this.searchWord = '';
		this.isnone = false;
		this.ishis = false;
		this.result = [];
		this.$emit('result', true);
	}
	,
	goDec(index, name, id,lng,lat,biz_type)
	{
		this.searchWord = name;
		this.isnone = true;
		this.ishis = false;
		this.arr.unshift(this.searchWord);
		this.unique(this.arr);
		this.$emit('result', true);
		this.branch_id=id;//搜索的网点id
		this.lng=lng;
		this.lat=lat;
		if(biz_type==1){//如果搜中B+网点，开关关闭
			this.openbtn=false;
		}
		this.creatMap();
	}
	,
	hsItem(hsWord)
	{//处理直接点击历史记录
		this.searchWord = hsWord;
		$(".repair_sear input").val(hsWord)
		$(".repair_sear input").focus();
		this.isnone = true;
		this.ishis = false;
		this.keyupall();
	}
	,
	unique(allarr)
	{//历史记录去重
		var res = [];
		var obj = {};
		for (var i = 0; i < allarr.length; i++) {
			if (!obj[allarr[i]]) {
				obj[allarr[i]] = 1;
				res.push(allarr[i]);
			}
		}
		this.arr = res;
		if(this.arr.length>10){
			this.arr = this.arr.slice(0, 10);
		}
		localStorage.setItem('peisearch3',JSON.stringify(this.arr));
	},
	//删除缓存
	deletesearch()
	{
		this.ishis = false;
		localStorage.removeItem('peisearch3');
		this.arr=[];//历史记录置空
		this.$emit('result', true);
	}


	},
  	}
</script>