<template>
	<div class="disDetail">
		<div id="container">
			<div ></div>
			<div id="panel"></div>
		<div class="current_location2" @click="mapPan()" v-show='isBig'><img src="../images/icon_location.png"/></div>
		<div class="hide_small" @click="hideSma()" v-show='isBig'><img src="../images/hide_small.png"/></div>
		<div class="icon_back" @click="hideSma()" v-show='isBig'><img src="../images/icon_back.png"/></div>
		<div class="show_big" @click="showBig()" v-show='!isBig'><img src="../images/show_big.png"/></div>
		</div>
		
		
		<div class="detail_cont" v-show='!isBig'>
			<div class="detail_item">
				<div class="detail_plat">
					<span class="plate_no">{{plate_no}}</span>
					<p class="day_type" v-show="carInfos.chengdu_limit_record==1">
									今日限行
					</p>
					<p class="day_type2" v-show='carInfos.chengdu_limit_record==2'>
						明日限行
					</p>
					<div class="four">
						<span class="three_type">
							<span 
								:class="item.limit==0?'is_drive':item.limit==1?'is_park':item.limit==2?'is_stay':'type_title'"  
								v-for="(item,index) in carInfos.limit_record"
								:key = 'index'
							>
								{{item.limit==0?'开':item.limit==1?'停':item.limit==2?'待':item.limit==3?'今':'明'}}
							</span>
						</span>
					</div>
				</div>
				<p class="detail_status">
					<span>当前状态：<span class="fc81d">{{carInfos.status_name}}</span></span>
					<span>{{carInfos.brand_name}}&nbsp;&nbsp;
						{{carInfos.color}}</span>
					<span>约续航{{carInfos.remain_km}}公里</span>
				</p>
			</div>
			<div class="addr">
				<div class="addr_get">
					<p class="addr_left">
						<span class="addr_icon get_icon">取</span>
						<span class="addr_det">{{branch_info.begin_name}}</span>
					</p>
					<p class="addr_km">
						<span class="fcb0">
							{{branch_info.begin_distance}}km
						</span>
						<span class="icon_guide" @click="goGuide(branch_info.begin_lng,branch_info.begin_lat,branch_info.end_lng,branch_info.end_lat,'get')">
							<img src="../images/icon_guide.png"/>
						</span>
					</p>
				</div>
				<div class="addr_give">
					<p class="addr_left">
						<span class="addr_icon give_icon">还</span>
						<span class="addr_det">{{branch_info.end_name}}</span>
					</p>
					<p class="addr_km">
						<span style="color: #b0b2b5">
							{{branch_info.end_distance}}km
						</span>
						<span class="icon_guide" @click="goGuide(branch_info.begin_lng,branch_info.begin_lat,branch_info.end_lng,branch_info.end_lat,'give')">
							<img src="../images/icon_guide.png"/>
						</span>
					</p>
				</div>
			</div>
			<p class="parking fcb0" v-if="carInfos.biz_type==1">
				当前停车费	<span class="fc33">{{carInfos.park_fee}}</span> 元
			</p>
		</div>
		<div class="btn_bottom task">
			<p class="get_task" v-if="tab_type==0" @click.stop="getTak(branch_info.task_id,branch_info.car_id)">领取任务</p>
			<p class="re_task" v-else>
    			<span class="creat" @click.stop="creatTask(branch_info.task_id)">
    				创建工单
    			</span>
    			<span class="cancel" @click.stop="cancelTak($event,branch_info.task_id)">
    				取消任务
    			</span>
    		</p>
		</div>
		<cancel v-show="modal" ref='cancel' @cancelOrder='cancelOrder' ></cancel>
	</div>
</template>

<script>
	import $ from 'jquery'
	import userData from '../../../../../other_modules/like-manageOrder/UserData'
	import {getOspApiUrl} from '../js/getApiUrl'
	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
	import cancel from '../component/cancelOrder'
	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
	require("../css/modal.css")

	export default {
		name: "disMap",
		components: {
	      cancel
	    },
	    data () {
	      return {
	        dataReady: false,
	        item: {},
	        plate_no: '',
	        map:'',
	        smallicon:[],
	        bigicon:'',
	        Array:[],
	        isBig:false,//地图大小
	        type_dec:false,
	        textarea1:'',
	        type_cont:'',
	        select_con:['车辆已被租走','需要更换车辆','临时有其他事情','其他'],
	        modal:false,
	        branch_info:JSON.parse(this.$route.query.branch_info),
	        plate_no:this.$route.query.plate_no,
	        carInfos:'',
	        tab_type:this.$route.query.tab_type,
	        limit_record:[{'day':18,'limit':0},{'day':18,'limit':1},{'day':18,'limit':0},{'day':18,'limit':0},{'day':18,'limit':2}]
	      }
	    },
	    mounted () {
	    	$('.disDetail').height(window.innerHeight)
		    dd.getLocation().then(res => {
		          userData.save({
		            locationsLng: res.longitude,
		            locationsLat: res.latitude
		          })
//		        userData.save({
//		            locationsLng: '116.298611',
//		            locationsLat: '40.044257',
//		        
//		        })
			    //基本地图加载
			    this.map = new AMap.Map("container", {
			        resizeEnable: true,
			        center: [userData.state.locationsLng, userData.state.locationsLat],//地图中心点
			        zoom:13//地图显示的缩放级别
			    });
			    this.map.clearMap();
			    var _this = this;
			    //构造路线导航类
		            var driving;
		            AMap.plugin(["AMap.Driving"], function () {
		                var drivingOption = {
		                    map: _this.map,
		        			panel: "panel"
		                };
		                driving = new AMap.Driving(drivingOption); //构造驾车导航类
		            });   
			    // 根据起终点经纬度规划驾车导航路线     起点 终点 经
			    driving.search(new AMap.LngLat(userData.state.locationsLng, userData.state.locationsLat), new AMap.LngLat(_this.branch_info.end_lng, _this.branch_info.end_lat),{
			        waypoints:[new AMap.LngLat(_this.branch_info.begin_lng, _this.branch_info.begin_lat)]//经
			    });
	          _this.carInfo().then(res=>{
		          _this.carInfos = res;
		          if(_this.carInfos.limit_record){
			          _this.carInfos.limit_record.splice(0, 0, {'day':0,'limit':3})
			          _this.carInfos.limit_record.splice(2, 0, {'day':0,'limit':4})
		          }
		        }).catch(_this.handleError)
	          
	          
	        }).catch(err => {
	          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
	    	})
	    	
	    },
	    methods: {
	    	creatTask(task_id){
	    		sessionStorage.setItem('task_id',task_id);
			    window.location.href = '../manageOrderCardetail/index.html?plate_no='+this.plate_no+"&task_id="+task_id;
	    	},
	    	getTak(task_id,car_id){
	    		myAjax.post(getOspApiUrl('/algorithm/receive-task'), {
				    mobile: userData.state.mobile,
				    task_id: task_id,
				    car_id:car_id
				}).then(res => {
				  	if (res.status === 0) {
				  		sessionStorage.setItem('task_id',task_id);
			      		window.location.href = '../manageOrderCardetail/index.html?plate_no='+this.plate_no+"&task_id="+task_id;
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
	    	},
	    	carInfo(){
	    		return myAjax.post(getOspApiUrl('/work-order/car-detail'),{
		          mobile:userData.state.mobile||'13521758602',
    			  PhoneInfo: userData.state.phoneInfo|| '',
    			  content: this.plate_no
		        }).then(res=>{
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		            
		          }
		        })
	    	},
	    	mapPan(){
	    		this.map.panTo([userData.state.locationsLng, userData.state.locationsLat])
	    	},
	    	hideSma(){
	    		this.isBig = false;
	    		$('#container').height('55%')
	    	},
	    	showBig(){
	    		this.isBig = true;
	    		$('#container').animate({height:'100%'},"fast");
	    	},
	    	goGuide(begin_lng,begin_lat,end_lng,end_lat,type){//导航
	            var driving;
	            AMap.plugin(["AMap.Driving"], function () {
	                var drivingOption = {
	                    policy: AMap.DrivingPolicy.LEAST_TIME,
	                    map: ''
	                };
	                driving = new AMap.Driving(drivingOption); //构造驾车导航类
	            });
	            var type = type;
	            var nowLng,nowLat,overLng,overLat;
	           	if(type=='get'){
	           		nowLng = userData.state.locationsLng;
	           		nowLat = userData.state.locationsLat;
	           		overLng = begin_lng;
	           		overLat = begin_lat;
	           	}else{
	           		nowLng = begin_lng;
	           		nowLat = begin_lat;
	           		overLng = end_lng;
	           		overLat = end_lat;
	           	}
	            //根据起终点坐标规划驾车路线
                driving.search(
                    [nowLng, nowLat], [overLng, overLat],
                    function (status, result) {
	                    driving.searchOnAMAP({
	                        origin: result.origin,
	                        destination: result.destination
	                    });
                });
	    	},
	    	cancelTak(e,task_id){//取消任务
		      	e.preventDefault();
		    	 this.$refs.cancel.type_dec=false;
		    	 this.$refs.cancel.modal=true;
		    	 this.$refs.cancel.type_cont='';
		    	 //取消时清除弹层状态
		    	 this.$refs.cancel.textarea1='';
		    	 $('.selec').removeClass('fc44a');
		    	 this.task_id = task_id;
		    },
		    cancelOrder(){//确认取消
		      	this.textarea1 = this.$refs.cancel.textarea1;
		      	this.type_cont = this.$refs.cancel.type_cont;
		      	this.type_num = this.$refs.cancel.type_num;
		      	if(this.textarea1.length>0&&this.type_cont){
		      		this.$refs.cancel.modal = false;
		      		this.head_id = 0;
		      		myAjax.post(getOspApiUrl('/algorithm/cancel'), {
				        mobile: userData.state.mobile,
				        task_id: this.task_id,
				        cancel_type:this.type_num,
				        cancel_remark:this.textarea1
				      }).then(res => {
				      	if (res.status === 0){
				      		window.location.href = 'index.html#/list'
				      	}else {
				          this.$_LIKE_toast(res.msg)}
				      }).catch(err => {
				        console.log(err)
				      })
		      	}else if(!this.type_cont||this.type_cont.length==0){
		      		this.$_LIKE_toast('请填写取消类型')
		      	}else if(!this.textarea1&&this.textarea1.length==0){
		      		this.$_LIKE_toast('请填写备注')
		      	}
		    },
	    }
		
	}
</script>

<style scoped>
	#container{
		height: 55%;
	}
   #panel {
   	display: none;
            position: fixed;
            background-color: white;
            max-height: 90%;
            overflow-y: auto;
            top: 10px;
            right: 10px;
            width: 280px;
       }
/*****修改地图样式******/
   #container /deep/ .amap-maps .amap-marker .marker-route {
	    position: absolute;
	    width: 35px;
	    height: 35px;
	    background: url("../images/white-net.png") no-repeat;
	    background-size: 35px;
	    display: flex;
	    justify-content: flex-end;
	}

	#container /deep/ .amap-marker .marker-route2 {
		display: flex;
	    justify-content: flex-end;
	    position: absolute;
	    width: 35px;
	    height: 35px;
	    background: url("../images/black-net.png") no-repeat;
	    background-size: 35px;
	}
	#container /deep/ .amap-marker .amap-lib-marker-from{/*起点*/
		width: .17rem!important;
		height: .29rem!important;
		background-image: url(../images/location.png)!important;
	}
	#container /deep/ .amap-marker .amap-lib-marker-to{/*终点*/
		width: .25rem!important;
		height: .28rem!important;
		background-image: url(../images/give_icon.png)!important;
	}
	#container /deep/ .amap-marker .amap-lib-marker-mid{/*经过*/
		width: .25rem!important;
		height: .28rem!important;
		background-image: url(../images/get_icon.png)!important;
	}
	.current_location2,.hide_small,.show_big,.icon_back {
		/*display: none;*/
	    position: absolute;
	    width: .4rem;
	    height: .4rem;
	    z-index: 100;
	}
	.current_location2{
		bottom: .8rem;
		left: .12rem;
	}
	.show_big{
		width: .35rem;
	    height: .35rem;
		bottom: .05rem;
		right: .05rem;
	}
	.hide_small{bottom: .8rem;right: .12rem;}
	.icon_back{
		top: .1rem;
		left: .1rem;
		border-radius: 50%;
		overflow: hidden;
	}
	.current_location2 img,.hide_small img,.show_big img,.icon_back img{
	    vertical-align: middle;
	    width: .4rem;
	}
	.show_big img{width: .35rem;}
	.btn_bottom{
		width: 100%;
	    position: fixed;
	    bottom: .1rem;
	    text-align: center;
	    margin: 0 auto;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    display: -webkit-flex;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	.btn_bottom .get_task{
		width: 95%;
		height: .4rem;
		line-height: .4rem;
		background: #333333;
		color: #FFFFFF;
		text-align: center;
	}
	.re_task{width: 95%;}
	.re_task span{
		text-align: center;
	    border: 1px solid #979797;
	    height: .4rem;
	    line-height: .4rem;
	    border-radius: 2px;
		display: inline-block;
		width: 46%;
		background: #333;
		color: #FFFFFF;
	}
	.creat{
		margin-right: 2%;
		
	}
	.day_type{
		padding: .03rem .06rem;
		border: 1px solid #ed3800;
		color: #ef5633;
		border-radius: 2px;
	}
	.day_type2{
		padding: .03rem .06rem;
		border: 1px solid #ff9500;
		color: #ff9500;
		border-radius: 2px;
	}
	.detail_plat{
		display: flex;
	    align-items: center;
	    justify-content: flex-start;
	   	display: -webkit-flex;
	    -webkit-align-items: center;
	    -webkit-justify-content: flex-start;
		padding-bottom: .1rem;
	}
	.fc81d{
		color: #81dc00;
	}
	.fc33{
		color: #333333;
	}
	.fc66{
		color: #666666;
	}
	.fc99{
		color: #999999;
	}
	.fcb0{
		color: #b0b2b5;
	}
	.detail_cont{
		padding: 0 .12rem;
		padding-bottom: .55rem;
	}
	.detail_item{
		padding: .15rem 0;
		border-bottom: 2px solid #EEEEEE;
	}
	.plate_no{
		margin-right: .15rem;
		font-size: .2rem;
	}
	.detail_status,.addr_get,.addr_give,.addr_left{
		display: flex;
	    justify-content: space-between;
	    align-items: center;
		display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    -webkit-align-items: center;
	}
	.addr_left{
		width: 66%;
	}
	.addr_det{
		flex: 1;
		-webkit-flex: 1;
		padding: 0 .05rem;
	}
	.addr_km{
		text-align: right;
	}
	.addr_get{
		margin-bottom: .21rem;
	}
	.addr_icon{
		display: inline-block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		border-radius: 50%;
		color: #FFFFFF;
		text-align: center;
	}
	.get_icon{
		background-color: #46be57;
	}
	.give_icon{
		background-color: #f15b5b;
	}
	.addr{
		padding: .2rem 0;
		border-bottom: 1px solid #EEEEEE;
	}
	.icon_guide{
		display: inline-block;
		width: .2rem;
		height: .2rem;
	}
	.icon_guide img{
		width: 100%;
		height: 100%;
	}
	.parking{
		padding: .15rem 0;
		text-align: center;
		padding-bottom: .55rem;
	}
	.three_title,.three_type{
		display: flex;
		align-items: center;
	}
	.three_title{
		margin-bottom: .05rem;
	}
	.is_drive,.is_park,.is_stay{
		  display: flex;
		  display: -webkit-flex;
	    width: .18rem;
	    height: .18rem;
	    line-height: .18rem;
	    font-size: .14rem;
	    text-align: center;
	    border-radius: 3px;
	    margin-right: .2rem;
	    color: #fff;
	    justify-content: center;
	    align-items: center;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	.type_title{
		display: flex;
		  display: -webkit-flex;
	    width: .18rem;
	    height: .18rem;
	    line-height: .18rem;
	    font-size: .14rem;
	    text-align: center;
	    border-radius: 3px;
	    margin-right: .05rem;
	    color: #666;
	    justify-content: center;
	    align-items: center;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	}
	.is_drive{
		background-color: #b6e088;
	}
	.is_park{
		background-color: #ff8e8e;
	}
	.is_stay{
		background-color: #D2D2D2;
	}
</style>


