<template>
	<div id="netcarmap">
		<!-- 头部文字说明 -->
		<div class="dispatch-top">
			<div class="title-left">{{textArea}}</div>
			<div class="title-right">
				<mt-switch v-model="openbtn" @change="change" class="btn"></mt-switch>
				只看空闲
			</div>
		</div>
		<!-- 搜索模板-->
		<div class="dispatch-search">
			<div class="repair_shop">
				<span class="repair_sear">
				<input type="text" @focus="hisData()" v-model='searchWord' placeholder="请输入网点名称"
					   @input.trim="keyupall($event)"/>
					<img class="input_clearn" @mousedown="clearInput($event)" v-show="searchWord!==''"
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
				   @click="goDec(index,item.name,item.id,item.lng,item.lat)">
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
		<!--筛选-->
		<div class="checkout netstockContentFilter">
			<img src="../images/icon_check.png"/>
		</div>
		<!--导航-->
		<div class="guide_map">
			<img class="navition-icon" src="../images/icon_guide.png"/>
			<input type="hidden" value="" class="lng"/>
			<input type="hidden" value="" class="lat"/>
		</div>
		<!--导航弹框-->
		<div class="navition-bottom" v-show="navition">
			<div class="left">
				<span class="net"></span><br/>
				<span class="address"></span>
			</div>
			<div class="right none">
				当前费用<br/>
				总计<font class="coast">333</font>
				元
				<!--<img class="navition-icon" src="../images/navition-icon.png"/><br/>-->
				<!--<span class="">导航</span>-->
				<!--<input type="hidden" value="" class="lng"/>-->
				<!--<input type="hidden" value="" class="lat"/>-->
			</div>
		</div>
		<!--confirm筛选提示框-->
		<div class="carstock_window common_cover">
			<div class="carstock_content">
				<div class="carstock-title">
					筛选
					<span class="close-carstock">&#xe601;</span>
				</div>
				<div class="confirm-carstock">
					<p>超车数量</p>

					<p class="confirm-carstate">
						<span class="allcarstate color">全部<input type="hidden" value="0"/></span>
						<span class="state"> ≧1 <input type="hidden" value="1"/></span>
					</p>

					<p>网点类型</p>

					<p class="confirm-carnetstate">
						<span class="allnettype color">全部网点<input type="hidden" value="-1"/></span>
						<span class="nettype">B类网点<input type="hidden" value="0"/></span>
						<span class="nettype">B+类网点<input type="hidden" value="1"/></span>
					</p>

					<p>网点属性</p>

					<p class="confirm-carnetstate2">
						<span class="allnettype2">全部网点<input type="hidden" value="-1"/></span>
						<span class="nettype2 color">上线网点<input type="hidden" value="2"/></span>
						<span class="nettype2">虚拟网点<input type="hidden" value="1"/></span>
					</p>
				</div>
				<div class="carstate-bottom">
					<button class="carstate-reset">重置</button><button class="carstate-sure">确定</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	require("../css/netcarmap.css")
	import $ from 'jquery'
	import getApiUrl from '../js/getApiUrl'
	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
	import userData from '../../../../../other_modules/like-manageOrder/UserData'
	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	export default {
		name: "netcarmap",
		data () {
		return {
			textArea:'*网点上的数字为此网点的车辆数',
			openbtn:true,//开关是否打开
			map:'',//地图
			smallicon:[],//存放小图标
			bigicon:[],//存放大图标
			Array:[],//拖动地图后，便于清除地图上的图标
			driving:'',//定义驾车导航
			locationsLng:'',
			locationsLat:'',//当前位置经纬度
			branch_id:'',//网点id
			lat:'',
			lng:'',//网点经纬度
			navition:false,//底部网点内容显示与隐藏
			param:{},
			car_num: '0',//超车数量
			property: '-1',//网点属性
			biz_type: '-1',//网点类型
			next_id:'',//底部栏展示的网点id
			next_name:'',//底部栏展示的网点名称
			//搜索
			searchWord: '',//input输入内容
			ishis: false,//弹层是否展示
			searching: true,//模糊查询时间间隔
			limit: false,//有无搜索结果
			result: [],//所有数据
			search_id:'',//搜索的网点id
			arr: JSON.parse(localStorage.getItem('peisearch2')) || []//存储的历史记录信息
		}
	},
	mounted () {
		let _this=this;
		_this.creatMap();//初始化地图
		//记录打开弹框前已筛选的值
		var colorArray = [];
		//打开筛选弹框
		$(".netstockContentFilter").on("click", function () {
			colorArray = [];
			$(".confirm-carstock span").each(function () {
				if ($(this).hasClass("color")) {
					colorArray.push($(this));
				}
			});
			$(".carstock_window").fadeIn(300);
			$(".carstock_content").animate({bottom:0},800);
		});
		//关闭筛选弹框
		$(".close-carstock").on("click", function () {
			$(".confirm-carstock span").removeClass("color");
			for (var i = 0; i < colorArray.length; i++) {
				colorArray[i].addClass("color");
			}
			$(".carstock_window").fadeOut(800);
			$(".carstock_content").animate({bottom:'-100%'},800);
		})

		//点击确定按钮关闭弹框
		$(".carstate-sure").on("click", function () {
			var biz_types=[],propertys=[];

			$(".confirm-carnetstate .color").each(function () {//网点类型
				biz_types.push($(this).find("input").val());
			});
			$(".confirm-carnetstate2 .color").each(function () {//网点属性
				propertys.push($(this).find("input").val());
			});
			$(".confirm-carstate .color").each(function () {//超车数量
				_this.car_num = $(this).find("input").val();
			});
			_this.biz_type = biz_types.join(',');
			_this.property = propertys.join(',');

			_this.creatMap();
			$(".carstock_window").fadeOut(800);
			$(".carstock_content").animate({bottom:'-100%'},800);
		})
		//点击选项变换颜色
		$(".state").on("click", function () {
			if ($(".confirm-carstate .color").length > 1) {
				if ($(this).hasClass("color")) {
					$(this).removeClass("color");
				} else {
					$(this).addClass("color");
				}
			} else {
				$(this).addClass("color");
			}
			$(".allcarstate").removeClass("color");
		});
		$(".nettype").on("click", function () {
			if ($(".confirm-carnetstate .color").length > 1) {
				if ($(this).hasClass("color")) {
					$(this).removeClass("color");
				} else {
					$(this).addClass("color");
				}
			} else {
				$(this).addClass("color");
			}
			$(".allnettype").removeClass("color");
		});
		$(".nettype2").on("click", function () {
			if ($(".confirm-carnetstate2 .color").length > 1) {
				if ($(this).hasClass("color")) {
					$(this).removeClass("color");
				} else {
					$(this).addClass("color");
				}
			} else {
				$(this).addClass("color");
			}
			$(".allnettype2").removeClass("color");
		});

		//点击重置按钮
		$(".carstate-reset").on("click", function () {
			$(".nettype").removeClass("color");
			$(".allnettype").addClass("color");
			$(".nettype2").removeClass("color");
			$(".allnettype2").addClass("color");
			$(".state").removeClass("color");
			$(".allcarstate").addClass("color");
		});
		//点击全部
		$(".allcarstate").on("click", function () {
			$(".state").removeClass("color");
			$(this).addClass("color");
		});
		$(".allnettype").on("click", function () {
			$(".nettype").removeClass("color");
			$(this).addClass("color");
		});
		$(".allnettype2").on("click", function () {
			$(".nettype2").removeClass("color");
			$(this).addClass("color");
		});
	},
	methods: {
		change(){
			if(this.openbtn){
				this.textArea='*网点上的数字为此网点的车辆数';
				this.openbtn=true;
				$(".dispatch-search").css("top",".55rem");
			}else{
				this.textArea='*注：网点上的数字依次为网点停放车辆数、空闲车辆数,超车数/可停车数（正数为可停放数,负数为超车数）';
				this.openbtn=false;
				$(".dispatch-search").css("top",".75rem");
			}
			this.creatMap();
		},
		creatMap(){
			let _this=this;
			dd.getLocation({targetAccuracy: 200,
				coordinate: 1,
				withReGeocode: false,
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
						locationsLat: _this.lat
					})
				}
				_this.map = new AMap.Map('dispatch-map', {
					resizeEnable: true,
					zoom: 13,
					center: [userData.state.locationsLng, userData.state.locationsLat]
				});
				//初始化加载数据
				_this.param = {
					mobile:sessionStorage.getItem("mobile"),
					lng: userData.state.locationsLng,
					lat: userData.state.locationsLat,
					car_num:_this.car_num,
					biz_type:_this.biz_type,
					property:_this.property
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
			myAjax.post(getApiUrl("/branch-car-stock/map-branch"), param).then(res => {
				_this.navition = false;
				_this.searchWord='';
				if (res.status == '0') {
					let result = res.data;
					// 使用clearMap方法删除所有覆盖物
					_this.map.clearMap();
					if (result.length != '0') {
						for (var i = 0; i < result.length; i++) {
							let netpoint = [result[i].lng, result[i].lat];//网点位置信息
							_this.Array.push(netpoint);
							// "current_counts"//当前车辆数    "free_counts"//空闲车辆数" over_counts"//超车数"  total_parking_fee"//总计停车费用
							addMarker(netpoint, result[i].name, result[i].address,result[i].id,result[i].biz_type, result[i].current_counts,result[i].free_counts,result[i].over_counts,result[i].total_parking_fee);//小图标
							addMarkerbig(netpoint, result[i].name, result[i].address,result[i].id,result[i].biz_type, result[i].current_counts,result[i].free_counts,result[i].over_counts);//大图标
						}
						//map.setFitView();
					} else {
						_this.$_LIKE_toast("附近五公里内没有停车网点");
					}
				} else {
					_this.$_LIKE_toast(res.msg)
				}
				// 编写自定义函数,创建小图标标注
				function addMarker(netpoint, branch_name, address,branch_id,biz_type,current_counts,free_counts,over_counts,total_parking_fee) {
					let classtype = '',OVERCOUNT=over_counts;
					if(over_counts>0){
						OVERCOUNT ="+"+over_counts;
					}
					if (biz_type == '0') {
						classtype = 'marker-route2';
					} else {
						classtype = 'marker-route';
					}
					let content='<div class="' + classtype + ' marker-marker-bus-from"><div class="div1 all-num"><div class="div-l">' + current_counts + '</div><div class="div-c">' + free_counts + '</div><div class="div-r">' + OVERCOUNT + '</div></div></div>';  //自定义点标记覆盖物内容
					if(_this.openbtn){//只展示空闲车辆数
						content='<div class="' + classtype + ' marker-marker-bus-from"><div class="div1 free-num"><div class="div-l">' + free_counts + '</div></div></div>';   //自定义点标记覆盖物内容
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
						if(biz_type==1){
							$('.navition-bottom .right').removeClass('none');
							$('.navition-bottom .right font').text(total_parking_fee)
						}else{
							$('.navition-bottom .right').addClass('none');
							$('.navition-bottom .left').css('border-right','none');
						}
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
						$(".guide_map .lng").val(netpoint[0]);
						$(".guide_map .lat").val(netpoint[1]);
						if(biz_type==1){
							$('.navition-bottom .right').removeClass('none');
							$('.navition-bottom .right font').text(total_parking_fee)
						}else{
							$('.navition-bottom .right').addClass('none');
							$('.navition-bottom .left').css('border-right','none');
						}
						_this.navition = true;
					});
				}

				// 编写自定义函数,创建大图标标注
				function addMarkerbig(netpoint, branch_name, address,branch_id,biz_type,current_counts,free_counts,over_counts) {
					let classtype = '',OVERCOUNT=over_counts;
					if(over_counts>0){
						OVERCOUNT ="+"+over_counts;
					}
					if (biz_type == '0') {
						classtype = 'bigmarker-route2';
					} else {
						classtype = 'bigmarker-route';
					}
					let content='<div class="' + classtype + ' marker-marker-bus-from"><div class="div1 all-num"><div class="div-l">' + current_counts + '</div><div class="div-c">' + free_counts + '</div><div class="div-r">' + OVERCOUNT + '</div></div></div>';  //自定义点标记覆盖物内容
					if(_this.openbtn){//只展示空闲车辆数
						content='<div class="' + classtype + ' marker-marker-bus-from"><div class="div1 free-num"><div class="div-l">' + free_counts + '</div></div></div>';   //自定义点标记覆盖物内容
					}
					let marker2 = new AMap.Marker({
						position: netpoint,
						offset: new AMap.Pixel(-20.5, -48),
						zIndex:103,
						content: content,   //自定义点标记覆盖物内容
						map: _this.map//创建时直接赋予map属性
					});
					_this.bigicon.push(marker2);//存放大图标
					marker2.hide();
					if(_this.branch_id==branch_id){
						marker2.show();
						$(".navition-bottom .net").text(branch_name);
						$(".navition-bottom .address").text(address);
						$(".guide_map .lng").val(netpoint[0]);
						$(".guide_map .lat").val(netpoint[1]);
						_this.navition=true;
					}
					marker2.on('click', function () {

					});
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
				$(".guide_map").on("click", function () {
					if(_this.navition){
						_this.driving.search(
								[_this.locationsLng, _this.locationsLat], [$(this).find(".lng").val(), $(this).find(".lat").val()],
								function (status, result) {
									_this.driving.searchOnAMAP({
										origin: result.origin,
										destination: result.destination
									});
								});
					}else{
						_this.$_LIKE_toast("请先选择网点")
					}

				});
				//定位
				$(".current_location2").on("click", function () {
					_this.map.panTo([_this.locationsLng, _this.locationsLat]);
				});
			}).catch(err => {
				console.log(err)
			})
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
			this.ishis = false;
			this.result = [];
		}
	,
		goDec(index, name, id,lng,lat)
		{
			this.searchWord = name;
			this.ishis = false;
			this.arr.unshift(this.searchWord);
			this.unique(this.arr);
			this.search_id=id;//搜索的网点id
			this.branch_id=id;//搜索的网点id
			this.lng=lng;
			this.lat=lat;
			this.creatMap();
		}
	,
		hsItem(hsWord)
		{//处理直接点击历史记录
			this.searchWord = hsWord;
			$(".repair_sear input").val(hsWord)
			$(".repair_sear input").focus();
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
					res.unshift(allarr[i]);
				}
			}
			this.arr = res;
			localStorage.setItem('peisearch2',JSON.stringify(this.arr));
		},
		//删除缓存
		deletesearch()
		{
			this.ishis = false;
			localStorage.removeItem('peisearch2');
			this.arr=[];//历史记录置空
			this.$emit('result', true);
		}


	},
	}
</script>