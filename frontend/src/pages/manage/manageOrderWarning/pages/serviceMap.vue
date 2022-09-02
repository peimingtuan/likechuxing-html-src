<!--@xurr 0912 查看网点地图 修改开四停四内页面直接使用-->
<template>
	<div class="serviceMap">
		<div class="dispatch-search">
		    <search 
				@result = 'result' 
				ref='search'
				:search_name="''"
				:plac_txt="'请输入网点名称'"
				:apiUrl="'/vehicle-problem/search'"
				:search_type='2'
				>
				
			</search>
		    <span class="icon">&#xe605;</span>
		</div>
		<div id="dispatch-map"></div>
		<!--刷新页面-->
		<div class="refure-dispatchpage" @click="creatMap">
		    <img src="../images/icon_refresh.png"/>
		</div>
		<!--导航弹框-->
		<div class="navition-bottom" v-show="navition">
		    <div class="left">
		        <span class="net"></span><br/>
		        <span class="address"></span>
		    </div>
		    <div class="right">
		        <img @click="guide($event)" class="navition-icon" src="../images/navition-icon.png"/><br/>
		        <span class="">导航</span>
		        <input type="hidden" value="" class="lng"/>
		        <input type="hidden" value="" class="lat"/>
		    </div>
		</div>
		<div :class="isnext||type=='2'||type=='3'?'check_btn':'bgcff'" @click="goEnd()">
			{{isnext&&type!='2'&&type!='3'?'确认选择':!isnext&&type!='2'&&type!='3'?'请选择网点':'返回'}}
		</div>
		
	</div>
</template>

<script>
	import $ from 'jquery'
	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData' 
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import FilterSingle from '../../../../../other_modules/like-manageOrder/component/FilterSingle'
	import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
  	import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
    import search from '../component/search'

  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
  	require("../css/modal.css")
  	const OrderStatus = require('../js/orderStatus')
	export default {
	    name: "serviceMap",
	     components: {
	      SlideUpBox,
	      FilterSingle,
	      FilterMultiple,
	      LikeButton,
	      search
	    },
	    data () {
	      return {
	        dataReady: false,
	        item: {},
	        plate_no: '',
	        map:'',
	        smallicon:'',
	        bigicon:'',
	        Array:[],
	        branch_id:'',
	        modal:false,
	        filter_show: false,
	        options:OrderStatus.bizfun.map(item=>{
	          item.id = item.status
	          return item
	        }),
	        status:0,
	        task_id:'',//任务id
			//任务类型
			//任务类型
			oilOpt:OrderStatus.disfun.map(item=>{
	          item.id = item.status
	          return item
	        }),
	        oilStatus:[],
	        taskOpt:'',
	        taskStatus:[],
	        navition:false,
	        param:{},
	        next_id:'',
	        next_name:'',
	        isnext:false,//是否可以跳转
	        searchWord:'',
	        lat:'',
	        lng:'',
	        type:this.$route.query.type
	      }
	    },
	    mounted () {
	    	this.select().then(res=>{
		        this.taskOpt = res.map(item=>{
		          item.status = item.id
		          return item
		        })
		   }).catch(this.handleError);
	    	this.creatMap();
	    },
	    methods: {
	    	select(){
				 this.param={mobile: userData.state.mobile}
				return myAjax.post(getOspApiUrl('/algorithm/select'),this.param).then(res=>{
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
	    	},
	    	result(){
				this.searchWord = this.$refs.search.searchWord;
				this.search_id = this.$refs.search.id;
				this.searchWord = this.$refs.search.searchWord;
				this.branch_id = this.$refs.search.id||this.$refs.search.list_item.id;
				this.lat = this.$refs.search.list_item.lat
				this.lng = this.$refs.search.list_item.lng;
		        this.creatMap()
			},
	    	creatMap(){
	    		dd.getLocation({targetAccuracy: 200,
        						coordinate: 1,
        						withReGeocode: true,
        						useCache: true}).then(res => {
		          if(this.lng||this.lat){
		          	userData.save({
			            locationsLng: this.lng,
			            locationsLat: this.lat,
			            
			          })
		          }else{
//		          	userData.save({
//			            locationsLng: this.$route.query.lng||'116.298611',
//			            locationsLat: this.$route.query.lat||'40.044257',
//			            mobile:'13521758602',
//			            provice:'北京市',
//						city:'北京市'
//			          })
			         userData.save({
			            locationsLng: this.$route.query.lng||res.longitude,
			            locationsLat: this.$route.query.lat||res.latitude,
						provice:res.provice,
						city:res.citye,
			          })
		          }
		          
			       this.map = new AMap.Map('dispatch-map', {
			            resizeEnable: true,
			            zoom: 13,
			            center: [userData.state.locationsLng, userData.state.locationsLat]
			        });
		        //初始化加载数据
		            this.param = {
		                province_name: userData.state.provice||'',//省
		                city_name: userData.state.city||'',//市
		                lng: userData.state.locationsLng,
				      	lat: userData.state.locationsLat,
				        mobile:userData.state.mobile||'13521758602',
		            }
		            if(userData.state.city_ids){
						this.param.city_id=userData.state.city_ids
					}
		            this.Array = [];
		            this.smallicon = [];//存放小图标
		            this.bigicon = [];//存放大图标
		            var _this = this;
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
		          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
		    	})
	    	},
	    	computeDis(lng,lat){//计算拖动距离
	    		var _this = this;
				var m1 = new AMap.Marker({
			        map: _this.map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(userData.state.locationsLng, userData.state.locationsLat)
			    });
	        	var m2 = new AMap.Marker({
			        map: _this.map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(lng, lat)
			    });
		        var p1 = m1.getPosition();
		        var p2 = m2.getPosition();
		        var distances = Math.round(p1.distance(p2));
		        var path = [p1,p2];
               	if(distances==0||distances>=1000){
                    _this.param.lng = lng;
                    _this.param.lat = lat;
               		_this.netshow(_this.param)
               	}
          	},
	    	goList(){
	    		window.location.href = 'index.html#/list?search_type=1'+'&search_id='+userData.state.mapbranch_id+'&type=map';
	    	},
	    	netshow(param){
	    		var _this = this;
	    		myAjax.post(getOspApiUrl('/work-order/select-branch'), param).then(res => {
	                    let result = res.data;
	                    if (res.status == '0') {
	                    	 // 使用clearMap方法删除所有覆盖物
		                    _this.map.clearMap();
							$('.refure-dispatchpage').css('display','block');
							$('.current_location2').css('display','block');
							$('.checkout').css('display','block');
	                        if (result.length != '0') {
	                        	_this.navition = false;
	                        	_this.isnext = false;
	                        	$('.serviceMap .refure-dispatchpage').css('bottom','.65rem')
	                            for (var i = 0; i < result.length; i++) {
	                                let netpoint = [result[i].lng, result[i].lat];//当前网点位置信息
	                                _this.Array.push(netpoint);
	                                addMarker(netpoint, result[i].name, result[i].address, result[i].car_num,result[i].branch_id,result[i].biz_type);//小图标
	                                addMarkerbig(netpoint, result[i].name, result[i].address, result[i].car_num,result[i].branch_id,result[i].biz_type);//大图标
	                            }
	                            //map.setFitView();
	                        } else {
	                            this.$_LIKE_toast("附近五公里内没有停车网点");
	                            _this.navition = false;
	                            _this.isnext = false;
	                        }
	                    } else {
	                        this.$_LIKE_toast(res.msg)
	                    }
	                    // 编写自定义函数,创建小图标标注
	                    function addMarker(netpoint, branch_name, address, lin_recommend_car,branch_id,biz_type) {
	                        let classtype = '';
	                        if (biz_type == '0') {
	                            classtype = 'marker-route2';
	                        } else {
	                            classtype = 'marker-route';
	                        }
	                        let marker = new AMap.Marker({
	                            position: netpoint,
	                            offset: new AMap.Pixel(-20.5, -48),
	                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>',   //自定义点标记覆盖物内容
	                            map: _this.map//创建时直接赋予map属性
	                        });
	                        if(_this.branch_id==branch_id){
	                        	$('.serviceMap .refure-dispatchpage').css('bottom','1.6rem')
	                            marker.hide();
	                            _this.next_id = branch_id;
	                            _this.next_name = branch_name;
	                        }
	                        _this.smallicon.push(marker);//存放小图标
								$('.amap-marker .div1 .span1').css('background-color','#666');
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
	                            $('.serviceMap .refure-dispatchpage').css('bottom','1.6rem')
	                            _this.navition = true;
	                            _this.isnext = true;
	                        });
	                    }
	
	                    // 编写自定义函数,创建大图标标注
	                    function addMarkerbig(netpoint, branch_name, address, lin_recommend_car,branch_id,biz_type) {
	                        let classtype = '';
	                        if (biz_type == '0') {
	                            classtype = 'bigmarker-route2';
	                        } else {
	                            classtype = 'bigmarker-route';
	                        }
	                        let marker2 = new AMap.Marker({
	                            position: netpoint,
	                            offset: new AMap.Pixel(-20.5, -48),
	                            zIndex:103,
	                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>',   //自定义点标记覆盖物内容
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
	                            _this.isnext = true;
	                        }
							$('.amap-marker .div1 .span1').css('background-color','#666');
	                        marker2.on('click', function () {
	
	                        });
	                    }
	                     //导航
			           _this.driving;
			            AMap.plugin(["AMap.Driving"], function () {
			                var drivingOption = {
			                    policy: AMap.DrivingPolicy.LEAST_TIME,
			                    map: ''
			                };
			                _this.driving = new AMap.Driving(drivingOption); //构造驾车导航类
			            });
			            //根据起终点坐标规划驾车路线
			            $(".right").on("click", function () {
			                driving.search(
			                    [userData.state.locationsLng, userData.state.locationsLat], [$(this).find(".lng").val(), $(this).find(".lat").val()],
			                    function (status, result) {
			                        driving.searchOnAMAP({
			                            origin: result.origin,
			                            destination: result.destination
			                        });
			                    });
			            });
			            //定位
			            $(".current_location2").on("click", function () {
			                _this.map.panTo([userData.state.locationsLng, userData.state.locationsLat]);
			            });
	                }).catch(err => {
				        console.log(err)
				    })
	    	},
	    	guide(e){
	    		var that = this;
	    		this.driving.search(
			                    [userData.state.locationsLng, userData.state.locationsLat], [$(e.target).parent().find(".lng").val(), $(e.target).parent().find(".lat").val()],
			                    function (status, result) {
			                        that.driving.searchOnAMAP({
			                            origin: result.origin,
			                            destination: result.destination
			                        });
			                    });
	    	},
	    	filterShow () {
		        this.filter_show = true;
	      	},
	      	filterClose () {
	        	this.filter_show = false;
	      	},
		    filterReset(){
		        this.$refs.filter.reset();
		        this.$refs.oilfilter.reset();
		        this.$refs.taskfilter.reset()
		    },
	      	filterSearch(){
		        this.filter_show = false;
		        this.status = this.$refs.filter.getResult();
		        this.oilStatus = this.$refs.oilfilter.getResult();
		        this.taskStatus = this.$refs.taskfilter.getResult();
		        this.creatMap();
	      	},
	    	goEnd(){
	    		var yy= this.next_name.substring(8,this.next_name.length);
				this.next_name.length>=8?this.next_name=this.next_name.replace(yy,"..."):this.next_name;
	    		if(this.isnext&&this.type!=2&&this.type!='3'){
	    			window.location.href="index.html#/endOrder?branch_id="+this.next_id+"&branch_name="+this.next_name+'&order_id='+this.$route.query.order_id
	    		}else if(this.type==2){
	    			window.location.href="index.html#/orderDetail?order_id="+this.$route.query.order_id
	    		}else if(this.type==3){
	    			window.location.href="index.html#/finishedOrder?order_id="+this.$route.query.order_id
	    		}
	    	}
	    },
  	}
</script>

<style scoped>
	body {
    width: 100%;
    height: 100%;
}
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
.box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
    }
    .btn {
        width: 47%;
    }
.dispatch-top {
    width: 100%;
    box-sizing: border-box;
    padding: .1rem .15rem;
    min-height: .25rem;
    line-height: .2rem; 
    font-size: .14rem;
    /* white-space: nowrap; */
    background: #fff;
    z-index: 100;
}

#dispatch-map {
    position: absolute;
    width: 100%;
    height: 100%;
}
.serviceMap /deep/ .repair_sear{width: 100%;}
.serviceMap /deep/ .repair_sear input{width: 100%;}

.dispatch-search {
    position: absolute;
    left: 2.5%;
    width: 95%;
    z-index: 100;
    margin-top: .1rem;
}

.dispatch-search .net-enter {
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    line-height: .44rem;
    padding-left: .65rem;
    border-radius: 3px;
    background: #fff;
    color: #bdbdbd;
}

.dispatch-search .icon {
    font-family: 'iconfont';
    display: inline-block;
    width: .4rem;
    line-height: .4rem;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: .15rem;
    top: 0.06rem;
}

/*ˢ�°�ť*/
.refure-dispatchpage {
	display: none;
    position: fixed;
   	bottom: .65rem;
    right: .07rem;
    width: .45rem;
    height: .45rem;
    border-radius: 50%;
    z-index: 100;
}

.refure-dispatchpage img {
    width: .45rem;
}

/*��λicon*/
.current_location2 {
	display: none;
    position: fixed;
    bottom: 1.13rem;
    right: .12rem;
    width: .4rem;
    height: .4rem;
    z-index: 100;
}

.current_location2 img {
    vertical-align: middle;
    width: .4rem;
}

/*����*/
.netdispatch-bottom {
    width: 95%;
    position: fixed;
    bottom: .8rem;
    padding: 0 2.5%;
}

.netdispatch-bottom button {
    width: 100%;
    height: .8rem;
    background: #187aeb;
    border: none;
    outline: none;
    border-radius: 3px;
    text-align: center;
    color: #fff;
}

/*��������*/
.navition-bottom {
    box-sizing: border-box;
    position: fixed;
    bottom: .7rem;
    left: 2.5%;
    width: 95%;
    height: .8rem;
    border-radius: 5px;
    background: #fff;
}

.navition-bottom .left {
    box-sizing: border-box;
    padding: .18rem;
    width: 80%;
    height: 1rem;
    border-right: 1px solid #dcdcdc;
}

.navition-bottom .left span {
    width: 2.5rem;
    display: inline-block;
    /*line-height: .32rem;*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.navition-bottom .left .address {
    color: #999999;
}

.navition-bottom .right {
    box-sizing: border-box;
    width: 20%;
    height: .8rem;
    text-align: center;
}

.navition-bottom .right img {
    width: .21rem;
    vertical-align: middle;
    margin-top: .21rem;
}

/*Сͼ��*/
#dispatch-map /deep/ .amap-marker .marker-route {
    position: absolute;
    width: 50px;
    height: 50px;
    background: url("../images/white-net.png") no-repeat;
    background-size: 50px;
    display: flex;
    justify-content: flex-end;
}

#dispatch-map /deep/ .amap-marker .marker-route2 {
	display: flex;
    justify-content: flex-end;
    position: absolute;
    width: 50px;
    height: 50px;
    background: url("../images/black-net.png") no-repeat;
    background-size: 50px;
}

/*��ͼ��*/
#dispatch-map /deep/ .amap-marker .bigmarker-route {
	/*display: flex;
    justify-content: flex-end;*/
    position: absolute;
    width: 60px;
    height: 60px;
    background: url("../images/bigwhite-net.png") no-repeat;
    background-size: 60px;
}

#dispatch-map /deep/ .amap-marker .bigmarker-route2 {
	/*display: flex;
    justify-content: flex-end;*/
    position: absolute;
    width: 60px;
    height: 60px;
    background: url("../images/bigblack-net.png") no-repeat;
    background-size: 60px;
}

#dispatch-map /deep/ .amap-marker .div1 {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    white-space: nowrap;
    /*padding: 2px;*/
    position: absolute;
    right: 0;
    /*left: 28px;
    top: -8px;*/
    background: #fff;
    border-radius: 10px;
    /*使数字居中处理*/
   display: flex;
   justify-content: center;
   align-items: center;
}

#dispatch-map /deep/ .amap-marker .div1 .span1 {
    display: inline-block;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    line-height: 18px;
    /*margin-right: 8px;*/
    background: #666;
    border-radius: 50%;
    text-align: center;
    font-size: .12rem;
    color: #fff;
    /*position: absolute;*/
}

#dispatch-map /deep/ .amap-marker .div1 .span2 {
    display: inline-block;
    width: 18px;
    line-height: 18px;
    font-size: .12rem;
    position: absolute;
}

#dispatch-map /deep/ .amap-marker .marker-route2 .div1 .span2 {
    color: #999999;
}
#dispatch-map /deep/ .amap-marker .bigmarker-route2 .div1 .span2 {
    color: #999999;
}
.checkout{
	display: none;
    position: absolute;
    bottom: 1.64rem;
    right: .07rem;
    width: .45rem;
    height: .45rem;
    z-index: 100;
    text-align: center;
}
.checkout img {
    vertical-align: middle;
    width: .45rem;
}
.check_btn,.bgcff{
	
	width: 95%;
	height: .43rem;
	line-height: .43rem;
	position: fixed;
    bottom: .15rem;
    left: 2.5%;
    box-sizing: border-box;
    text-align: center;
}
.check_btn{
	color: #FFFFFF;
	background: #333333;
}
.bgcff{
    	background: #FFFFFF;
    	color: #333;
    }
.serviceMap /deep/ .repair_shop{
	padding-left: .6rem;
	border-bottom: none;
}
.serviceMap /deep/ .history_items{
	left: 0;
	width:100%
}
</style>