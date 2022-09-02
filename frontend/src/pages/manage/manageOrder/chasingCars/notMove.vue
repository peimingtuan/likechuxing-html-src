<!--
	作者：xurui_518@163.com
	时间：2018-08-23
	描述：24小时未动
-->
<template>
	<div class="notMove">
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
		</div>
		<div class="four_content fc33" v-show="moveData.length>0"> 
			<!--上拉加载，下拉刷新-->
	            <mt-loadmore :top-method="loadTop" :autoFill=false :distance-index='1' @translate-change="translateChange" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
	            	<div class="move_item" v-for="(listItem,index) in moveData" @click = goDetail(listItem.plate_no,listItem.vin)>
	            		<div class="car_card">
							<p class="car_plat">
								<span class="fc33">{{listItem.plate_no}}</span>
								(<span class="fc99" v-show="listItem.vin">{{listItem.vin.substring(0, 11)}}</span>
								<span class="fc33" v-show="listItem.vin">{{listItem.vin.substring(11, 17)}}</span>)
							</p>
							<p class="day_type" v-show='listItem.chengdu_limit_record==1'>
								今日限行
							</p>
							<p class="day_type2" v-show='listItem.chengdu_limit_record==2'>
								明日限行
							</p>
						</div>
						<p class="car_dec"> 
							<span>{{listItem.status_name}}</span>
							<span>
								{{listItem.brand_name}}
							</span>
							<span>约续航 {{listItem.remain_km}} 公里</span>
						</p>
						<p class="fourdet_three" v-show='listItem.limit_record'>
							<span class="three_title">
								<span>今</span>
								<span>明</span>
							</span>
							<span class="three_type">
								<span :class="item.limit==0?'is_drive':item.limit==1?'is_park':'is_stay'"  v-for="item in listItem.limit_record">
									{{item.limit==0?'开':item.limit==1?'停':'待'}}
								</span>
							</span>
						</p>
						<p class="detail_addr fc66">
							<!--条件：根据是否是成都限行或广佛限行判断是否显示，判断限行区域内非与限'rule_not':'onNo'限-->
							<span class="move_rule" :class="listItem.area==1?'onNo':'rule_not'" v-show='listItem.area&&listItem.area!=0'>{{listItem.area&&listItem.area==1?'限':'非'}}</span>
							<span class="icon_addr">
								<img src="../image/mapb.png" alt=""  v-if='listItem.biz_type==0'/>
								<img src="../image/map-B.png" alt=""  v-else/>
							</span>
							<span>
								{{listItem.branch_addr}} <span class="fc33">{{ listItem.parking_floor}}</span>  层
								<span v-if="listItem.parking_no" ><span class="fc33">{{ listItem.parking_no }}</span> 车位</span> 
							</span>
						</p>
						<p class="stop_pays fc66">
							<span class="is_rule" v-show='listItem.area&&listItem.area!=0'></span><span class="icon_addr"></span>当前预计停车费 <span class="fc33"> {{listItem.park_fee}} </span>元
 						</p>
 						<p class="not_time">
 							未动时长：
							<span class='fcec6e' v-for="(times,num) in listItem.unmove_time">
								{{times}} <span class="fc33">{{num==0?'天':num==1?'小时':'分'}}</span>
							</span>
 						</p>
 						<p class="dot_line" v-if="listItem.last_desc"></p>
 						<p class="move_note" v-if="listItem.last_desc">
 							<span class="note_title fc33">备注：</span>
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
								<!--为了防止冒泡，不做js处理，html处理为v-if形式-->
								<span class="fildec_items filmore" :id = 'items.id' :class="[items.id==1||items.id==2||items.id==103||items.id==102?'isOne':'notOne']" v-for="(items,index) in moreData" @click="checkList(items.id,$event)" v-if='items.count<0'>{{items.name}}</span>
								<span class="fildec_items filmore" :id = 'items.id' :class="[items.id==1||items.id==2||items.id==103||items.id==102?'isOne':'notOne']" v-for="(items,index) in moreData" @click="checkList(items.id,$event)" v-if = 'items.count>=0'>{{items.name}} ({{items.count}})</span>
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
				//假数据
				moveData:[],//列表数据
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
	            filterShow:false,//筛选弹层
	            sortShow:false,//排序弹层
	            noteShow:false,//调度说明弹层
	            filterData1:[],//筛选弹层内容，多选
				sort:[
					{"sortCont":"未动时长从大到小",'sortType':'0'},
					{"sortCont":"距离当前从近到远",'sortType':'1'}
				],
				tabId:sessionStorage.getItem('type')||0,//当前tab栏
				isShow:false,//toast提示
				msg:'',//toast提示内容
				sort_type:'0',//排序
				biz_type:'10',//合作类型
				pageNum:'1',//分页
				icon_addr:'',
				city_id:'',
				resetAll:false,//是否重置
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
						{"title":"网点合作类型","all":[{"name":"全部网点","type":"10"},{"name":"B类网点","type":"0"},{"name":"B+类网点","type":"1"}],"type":"s1"},
					],
		        notMore:false,//初次加载是否有分页数据
		        botText:'',
		        limit_num:'',//是否显示筛选数字
		        car_id:'',
		        branch_id:''

			}
		},
		beforeCreate () {
			document.title = '24小时未动';
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			var url = window.location.href;
			this.car_id = this.getUrl(url).car_id;
			this.branch_id = this.getUrl(url).branch_id;
			//筛选
			var param = {
				'mobile':sessionStorage.getItem('mobile'),
				"city_id":sessionStorage.getItem('city_id'),
				"cat_type":0
			}
			var _this = this;
			myAjax.post(getApiUrl('/car-catch/move-dis-config'), param, function (data) {
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
			//初始化数据
			var params = {
            	"mobile":sessionStorage.getItem('mobile'),
				'lng':sessionStorage.getItem('lng'),		//经度
				'lat':sessionStorage.getItem('lat'),		//维度
				'sort_type':this.sort_type,//1距离  0车辆数
				'city_id':sessionStorage.getItem('city_id'),
				'cat_type':'0',//0 24小时未动   1远距离
				'page':'1'		//int	页码
			}
			//如果有筛选条件，加上筛选的条件
			var biz_type = sessionStorage.getItem('check_biz_type')
			if(biz_type==0||biz_type==1){params.branch_type = biz_type;}
			//多选
			var statusArr = sessionStorage.getItem('fourStatus');
			if(statusArr){
				params.car_status = statusArr;
			}else{
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#1,#2,#103,#102').removeClass("bg_white").addClass('bg_black');
			}
			 if(this.branch_id){
				params.branch_id = this.branch_id;
			}
			if(this.car_id){
				params.car_id = this.car_id;
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
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : '24小时未动',//控制标题文本，空字符串表示显示默认文本
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
				myAjax.post(getApiUrl('/car-catch/move-dis-list'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.moveData = data.data;
//						_this.moveData = _this.moveData.unshift({'unmove_time':'1天4小时5分钟'})
						for(var i=0;i<_this.moveData.length;i++){
							_this.city_id = _this.moveData[i].city_id;
						}
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
			goSearch(){//去搜索页面
				sessionStorage.setItem('type',this.tabId);
				window.location.href = './warnIndex.html#/searchPro?catType=0';
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
					'mobile':sessionStorage.getItem('mobile'),
					"city_id":sessionStorage.getItem('city_id'),
					"cat_type":0
				}
				var _this = this;
				myAjax.post(getApiUrl('/car-catch/move-dis-config'), param, function (data) {
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
					if(statusArr=='1,2,102,103'||!statusArr){//默认空闲//如果有历史筛选，展示出
						$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
						$('#1,#2,#103,#102').removeClass("bg_white").addClass('bg_black');
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
						 	}else if(status[i]==2){
						 		$('#2').removeClass("bg_white").addClass('bg_black');
						 	}
						 	
						 }
					}else if(statusArr=='-1'){
						$('.filmore').removeClass("bg_black").addClass('bg_white');
						$('.filmore1').removeClass("bg_white").addClass('bg_black');
					}
				this.biz_type = sessionStorage.getItem('check_biz_type')
				if(this.biz_type==0||this.biz_type==1){
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
					'sort_type':this.sort_type,//1距离 0车辆数
					'city_id':sessionStorage.getItem('city_id'),
					'cat_type':'0',//0 24小时未动   1远距离
					'page':'1'		//int	页码
				}
				if(this.biz_type==0||this.biz_type==1){
					param.branch_type = this.biz_type;
					sessionStorage.setItem('check_biz_type',this.biz_type)
				}else{
					sessionStorage.removeItem('check_biz_type');
				}
				if(statusArrs){
					param.car_status = statusArrs;
					sessionStorage.setItem('fourStatus',statusArrs)
				}
				if(this.branch_id){
					this.branch_id='';
				}
				if(this.car_id){
					this.car_id='';
				}
				if(this.resetAll){
					delete param.branch_type;
					delete param.drive_day;
					delete param.car_status;
				}
				this.allLoaded = false;
            	this.notMore = false;
            	$('.mint-loadmore').scrollTop(0);
            	$('.four_content').scrollTop(0);
				this.init(param);
				this.filterShow = false;
			},
			resetbtn(){//重置
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#1,#2,#102,#103').removeClass("bg_white").addClass('bg_black');
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
					'city_id':sessionStorage.getItem('city_id'),
					'cat_type':'0',//0 24小时未动   1远距离
					'sort_type':this.sort_type,
					'page':'1'		//int	页码
				}
				//多选
				var statusArr = sessionStorage.getItem('fourStatus');
				if(statusArr){
					param.car_status = statusArr;
				}
				if(this.biz_type==0||this.biz_type==1){param.branch_type = this.biz_type;}
				if(this.resetAll){
					delete param.branch_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.car_status;
				}
				if(this.branch_id){
					param.branch_id = this.branch_id;
				}
				if(this.car_id){
					param.car_id = this.car_id;
				}
				$('.four_content').scrollTop(0);
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
					'city_id':sessionStorage.getItem('city_id'),
					'cat_type':'0',//0 24小时未动   1远距离
					'sort_type':this.sort_type,
					'page':'1'		//int	页码
				}
				//以下为排序后查看是否有筛选条件
				//多选
				var statusArr = sessionStorage.getItem('fourStatus');
				if(statusArr){
					param.car_status = statusArr;
				}
				if(this.biz_type==0||this.biz_type==1){param.branch_type = this.biz_type;}
				if(this.branch_id){
					param.branch_id = this.branch_id;
				}
				if(this.car_id){
					param.car_id = this.car_id;
				}
				if(this.resetAll){
					delete param.branch_type;
					delete param.is_local;
					delete param.drive_day;
					delete param.car_status;
				}
				$('.four_content').scrollTop(0);
				this.init(param);
				setTimeout(()=>{
					this.sortShow = false;
				},600)
			},
			onreLoad(){//右上角的刷新按钮
				$('.mint-loadmore-content').scrollTop(0)
				this.pageNum = 1;
			    setTimeout(() => {
					 var param = {
					 	"mobile":sessionStorage.getItem('mobile'),
						'lng':sessionStorage.getItem('lng'),		//经度
						'lat':sessionStorage.getItem('lat'),		//维度
						'city_id':sessionStorage.getItem('city_id'),
						'cat_type':'0',//0 24小时未动   1远距离
						'sort_type':this.sort_type,//1距离  0车辆数
						'page':'1'		//int	页码
					}
					if(this.branch_id){
						param.branch_id = this.branch_id;
					}
					if(this.car_id){
						param.car_id = this.car_id;
					} 
					var biz_type = sessionStorage.getItem('check_biz_type')
					if(biz_type==0||biz_type==1){param.branch_type = biz_type;}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						param.car_status = statusArr;
					}
					if(this.resetAll){
						delete param.branch_type;
						delete param.is_local;
						delete param.drive_day;
						delete param.car_status
					}
			        var _this = this;
					myAjax.post(getApiUrl('/car-catch/move-dis-list'), param, function (data) {
						if(data.status==0){
							_this.moveData = data.data;
							if(_this.moveData.length!=10){_this.allLoaded = true;}else{
								_this.allLoaded = false;
							}
							for(var i=0;i<_this.moveData.length;i++){
								_this.city_id = _this.moveData[i].city_id;
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
						'lng':sessionStorage.getItem('lng')||'116.298611',		//经度
						'lat':sessionStorage.getItem('lat')||'40.044257',		//维度		
						'city_id':sessionStorage.getItem('city_id'),
						'cat_type':'0',//0 24小时未动   1远距离
						'sort_type':this.sort_type,//1距离  0车辆数
						'page':this.pageNum		//int	页码
					}
			       
			        var biz_type = sessionStorage.getItem('check_biz_type')
					if(biz_type==0||biz_type==1){param.branch_type = biz_type;}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr){
						param.car_status = statusArr;
					}
					if(this.branch_id){
						param.branch_id = this.branch_id;
					}
					if(this.car_id){
						param.car_id = this.car_id;
					}
					if(this.resetAll){
						delete param.branch_type;
						delete param.is_local;
						delete param.drive_day;
						delete param.car_status;
					}
			        var _this = this;
			        
					myAjax.post(getApiUrl('/car-catch/move-dis-list'), param, function (data) {
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
					 		for(var i=0;i<_this.moveData.length;i++){
								_this.city_id = _this.moveData[i].city_id;
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
							'city_id':sessionStorage.getItem('city_id'),
							'cat_type':'0',//0 24小时未动   1远距离
							'sort_type':this.sort_type,//1距离  0车辆数
							'page':'1'		//int	页码
						}
						var biz_type = sessionStorage.getItem('check_biz_type')
						if(biz_type==0||biz_type==1){param.branch_type = biz_type;}
						//多选
						var statusArr = sessionStorage.getItem('fourStatus');
						if(statusArr){
							param.car_status = statusArr;
						}			
						if(this.branch_id){
							param.branch_id = this.branch_id;
						}
						if(this.car_id){
							param.car_id = this.car_id;
						}
						if(this.resetAll){
							delete param.branch_type;
							delete param.is_local;
							delete param.drive_day;
							delete param.car_status;
						}
						
						this.init(param);
					},80)
			      	$('.mint-loadmore-content').scrollTop(0);
		          this.allLoaded = false;
		          this.notMore = false;
		          this.$refs.loadmore.onTopLoaded();
		        }, 1500);
		    },
		    goDetail(plate_no,vin){
		    	var enter;
            	var vins = vin.substring(11, 17)
            	plate_no?enter=plate_no:enter=vins;//有车牌号传车牌，无车牌号传Vin号
            	window.location.href = '../../manageOrderCardetail/index.html?plate_no='+enter;
		    },
		}
	}
	
	
</script>
<style>
</style>