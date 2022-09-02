<!--
	作者：xurui_518@163.com
	时间：2018-09-04
	描述：车辆数统计
	1、权限控制，无权限不可查看状态所占权重和车辆数
	2、点击各个状态跳转到车辆明细处，带入城市-状态，车辆数，权重
-->
<template>
	<div class="carNums">
		<div class="four_header fc33">
		    <div class="det_header">
				<p class="header_item item_center" @click="openFil()">
					<span class="detail_icon"><img src="../image/icon_filter.png"/></span><span>筛选</span>
				</p>
				<p class="header_item" @click="onreLoad()">
					<span class="detail_icon"><img src="../image/icon_refresh.png"/></span><span>刷新</span>
				</p>
			</div>
		</div>
		<!--<div class="four_content fc33" v-show="statusData.length>0">--> 
		<div class="four_content fc33"> 
	            	<div class="form_item" v-for="(status_item,index) in statusData" :key="index">
	            		<div class="car_num_title">
							<div class="title">
								{{status_item.city_name?status_item.city_name.substring(0,status_item.city_name.length-1):''}}车辆数统计
							</div>
	            			<div class="btn" @click="goK4t4DataPage" v-show="status_item.city_id==197" >开四停四数据</div>
	            		</div>
						
	            		<div class='form_dec'>
	            			<p class="fc66">全部车辆：<span class="fc33">{{status_item.all.count}}</span></p>
	            			<p class="fc66">运营车辆：<span class="fc33">{{status_item.business.count}}</span></p>
	            			<p class="fc66">上线率：<span class="fc33">{{status_item.business.percent}}%</span></p>
	            		</div>
	            		<ul class="ul_carlist">
	            			
	            			<li class="car_status" :key="index" v-for = '(detItem,index) in status_item.detail' @click="goDetail(detItem,status_item.city_name,status_item.city_id)">
	            				<span class="list_icon" v-if="index!=0"></span>
	            				<span>{{detItem.name}}</span>
	            				<span class="status_nums" v-if="detItem.count!='-1'||detItem.percent!='-1'">{{detItem.count}}/{{detItem.percent}}%</span>
	            			</li>
	            		</ul>
	        		</div>
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
					<div class="check_more">
						<div class="filter_dec">
							<p class="fildec_title fc99">城市</p>
							<div class="fildec_cont">
								<span class="fildec_items filmore1 isOne" id='0' @click="checkList('-1',$event)">全部</span><span class="fildec_items filmore notOne" :id = 'items.id' :key="index"  v-for="(items,index) in moreData" @click="checkList(items.id,$event)">{{items.name?items.name.substring(0,items.name.length-1):''}}</span>
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
		<!--统计说明-->
		<div class="check_modal note_modal fc33" v-show="currentDesc">
			<div class="note_content">
				<div class="note_title">
					统计说明
				</div>
				<p class="note_item fc66" v-for='(item,index) in noteData' :key="index">
					{{item}}
				</p>
				<p class="note_dec fc99">
					*注：车辆状态后的<span class="fc33">蓝色数字可点击</span>，点击后即可查看该状态的车辆明细
				</p>
			</div>
			<div class="note_close" @click="closeDesc">
				<img src="../image/close-btn.png"/>
			</div>
		</div>
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../js/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	import { Navbar, TabItem,Loadmore } from 'mint-ui';
	import authSingObj from '../js/signature'

	export default{
		props:{
			currentDesc:Boolean,
			hideCurrentDesc:Function
		},
		data () {
			return{
				//假数据
				formData:[],//列表数据
				loading:false,
	            filterShow:false,//筛选弹层
	            sortShow:false,//排序弹层
	            filterData1:[],//筛选弹层内容，多选
				isShow:false,//toast提示
				msg:'',//toast提示内容
				city_id:'',
				resetAll:false,//是否重置
				submits:false,
				moreData:'',//筛选数据
		        islimit:'',
		        noteData:["1.所有车辆状态均为实时统计；","2.空闲数量为可租赁的空闲数；","3.空闲占比=空闲/（空闲+租赁中）；","4.租赁中占比=租赁中/（空闲+租赁中）；","5.运营车辆=空闲+租赁中+下线；","6.上线率=运营车辆数/（总数-整备-办公用车）；","7.车辆整备占比=整备车辆数/该城市所有车辆；","8.除空闲、租赁中、整备外其他各状态占比=状态数量/（该城市所有车辆-车辆整备数量）。"],//调度说明需求
				//假数据
				statusData:'',

			}
		},
		beforeCreate () {
			document.title = '车辆数统计';
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		},
		mounted () {
			sessionStorage.removeItem('fourEnter');
			this.loaded= new Loading()//加载loading
			var params = {
            	"mobile":sessionStorage.getItem('mobile'),
			}
			//如果有筛选条件，加上筛选的条件
			//多选
			var statusArr = sessionStorage.getItem('fourStatus');
			if(statusArr&&statusArr!='-1'){
				params.city_id = statusArr;
			}else{
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#0').removeClass("bg_white").addClass('bg_black');
			}
            this.init(params);
		},
		methods:{
			goK4t4DataPage(){
				this.$router.push('/k4t4Data')
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
			    dd.error(function (error) {
					console.log('dd error: ' + JSON.stringify(error));
			 		alert("钉钉授权验证失败，请关闭页面重新打开")
				});
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : '车辆数统计',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
					dd.ui.webViewBounce.disable(); 
				    //钉钉获取定位 钉钉浏览器内使用
				});
			},
			init(param){
				var _this = this;
				$('.four_content').css('padding-bottom','0')
				myAjax.post(getApiUrl('/statistics/select-config'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.statusData = data.data.static;
						_this.moreData = data.data.select;
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
			filClose(){//关闭筛选层
				this.filterShow = false;
				this.sortShow = false;
				this.resetAll = false;
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('.limitIndex').css({'overflow':'auto'});
			},
			openFil(){//点击筛选按钮事件
				this.filterShow=true;
				//取当前缓存的已操作过的筛选条件
				var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr=='-1'||!statusArr){//默认空闲//如果有历史筛选，展示出
						$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
						$('#0').removeClass("bg_white").addClass('bg_black');
					}else if(statusArr&&statusArr!='-1'){
						var status = statusArr.split(',');
						 for(var i=0;i<status.length;i++){//车伤部位
						 	if(status[i]!=-1){
						 		$('#'+status[i]).removeClass("bg_white").addClass('bg_black');
						 	}
						 }
					}else if(statusArr=='-1'){
						$('.filmore').removeClass("bg_black").addClass('bg_white');
						$('.filmore1').removeClass("bg_white").addClass('bg_black');
					}
				$('.four_content').scrollTop(0);
			},
			fourFilter(type,num,e){//筛选框内内容
				this.resetAll = false;//重置状态置为初始状态
				$(e.target).removeClass("bg_white").addClass('bg_black');
				$(e.target).siblings().removeClass("bg_black").addClass('bg_white');
			},
			submitbut(){//确认
				this.submits = true;
				//多选
				var status = $('.fildec_cont').find($('.filmore.bg_black'));//车辆，取出当前选中的值
				var allstatus = $('.fildec_cont').find($('.filmore1.bg_black'));
				var statusArrs;
				if(allstatus.length>=1){
					statusArrs = '-1';
					sessionStorage.setItem('fourStatus','-1')
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
				}
				if(statusArrs&&statusArrs!=-1){
					param.city_id = statusArrs;
					sessionStorage.setItem('fourStatus',statusArrs)
				}
				if(this.resetAll){
					sessionStorage.setItem('fourStatus','-1')
					delete param.city_id;
				}
				this.allLoaded = false;
            	this.notMore = false;
            	$('.four_content').scrollTop(0);
				this.init(param);
				this.filterShow = false;
			},
			resetbtn(){//重置
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
				$('.filmore,.filmore1').removeClass("bg_black").addClass('bg_white');
				$('#0').removeClass("bg_white").addClass('bg_black');
				this.resetAll = true;
				//把push列表置空
			},
			onreLoad(){//右上角的刷新按钮
				this.pageNum = 1;
			    setTimeout(() => {
					 var param = {
					 	"mobile":sessionStorage.getItem('mobile'),
					}
					//多选
					var statusArr = sessionStorage.getItem('fourStatus');
					if(statusArr&&statusArr!='-1'){
						param.city_id = statusArr;
					}
			        var _this = this;
					myAjax.post(getApiUrl('/statistics/select-config'), param, function (data) {
						if(data.status==0){
							$('.four_content').scrollTop(0);
							_this.statusData = data.data.static;
							_this.moreData = data.data.select;
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
		    goDetail(details,city_name,city_id){
		    	var det = JSON.stringify(details)
		    	if(details.click==1){
		    		window.location.href = './index.html#/carDetails?details='+det+'&cityName='+city_name+'&cityId='+city_id;
		    	}
				
			},
			closeDesc(){
				this.$emit('hideCurrentDesc')
			}
		}
	}
	
	
</script>
<style lang="less" scoped>
	.car_num_title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title{
			font-size: .17rem;
		}
		.btn{
			width: .98rem;
			height: .3rem;
			line-height: .3rem;
			background: #44A8EC;
			border-radius: 2px;
			font-family: PingFangSC-Regular;
			font-size: .14rem;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
