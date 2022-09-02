<!--
	作者：xurui_518@163.com
	时间：2018-07-31
	描述：小组任务列表
	1、去小组详情页的时候保留列表页当前的tab位置，和筛选的条件
	2、切换tab的时候保留当前筛选的条件
-->
<template>
	<div class="groupTask">
		<div class="det_header fc33">
			<p class="header_item item_center" @click="openFil()">
				<span class="detail_icon"><img src="../image/icon_filter.png"/></span><span class="fc33">筛选</span>
			</p>
			<p class="header_item" @click="reLoad()">
				<span class="detail_icon"><img src="../image/icon_refresh.png"/></span><span class="fc33">刷新</span>
			</p>
		</div>
		<div class="group_main">
			<div class="main_left">
				<p class="left_group group_one"  @click="changeTab('0','全部',$event)">
					全部
				</p>
				<p v-for="item in leftGroup" :class="'group'+item.id" class="left_group" @click="changeTab(item.id,item.name,$event)">
					{{item.name}}
				</p>
			</div>
			<div class="main_right">
				<p class="main_header fc99">
					调度类型：<span class="fc33">{{rightTitle}}</span>
				</p>
				<div class="main_all">
					<div v-for="item in rightMain" class="main_cont">
						<div v-for="listItem in item.list" class="main_group" @click="goDeatil(listItem.type,item.group_id,listItem.all,item.group_name)">
							<p class="group_dec">
								<span>{{item.group_name}}</span>
								<span class="fc99">{{listItem.type==1?'紧急调离限行区':listItem.type==2?'调离限行区':listItem.type==3?'调入限行区（粤A）':'调入限行区（非粤A）'}}</span>
							</p>
							<p class="group_num">
								<span class="fc66">网点数：<b class="fc33">{{listItem.branch}}</b></span>
								<span class="fc66">车辆数：<b class="fc33">{{listItem.all}}</b></span>
							</p>
							<div class="type_num">
							 	<span class="fc99">空闲(非低油)：<b class="fc99">{{listItem.normal}}</b></span>
							 	<span class="fc99">低油：<b class="fc99">{{listItem.low}}</b></span>
							 	<span class="fc99">缺油/电下线：<b class="fc99">{{listItem.offline}}</b></span>
							</div>
						</div>
						
					</div>
					
				</div>
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
					<div class="filter_more">
						<div class="filter_dec" v-for="(dec,indexs) in filterData" :class="'filter'+indexs">
							<p class="fildec_title fc99">调度类型</p>
							<div class="fildec_cont">
								<span class="fildec_items" :data-i='items.type' :id="dec.type+items.type" :class="[index==0?'bg_black':'bg_white',index==0?'isOne':'notOne']" v-for="(items,index) in dec.all" @click="fourFilter(dec.type,items.type,items.name,$event)">{{items.name}}({{items.num}})
								</span>
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
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
	</div>
</template>

<script>
	import $ from "jquery"
	import myAjax from '../common/myAjax/withJq.js'
	import getApiUrl from '../js/getApiUrl';
	import Loading from '../../../../component/loading'
	import {Confirm,Toast} from '../common/LikeAlert/index'
	import authSingObj from '../js/signature'

	export default{
		data () {
			return{
				leftGroup:'',//左边tab栏
				rightMain:'',//右边内容列表
				typeTitle:sessionStorage.getItem('typeTitle')||'全部',//右边调度类型，默认全部
				mainAll:'',//存储右边全部数据
				isShow:false,//弹层提示
				msg:'',
				filterShow:false,//筛选
				totalone:'',
				judgeData:'',//点击筛选内容后筛选出所有符合条件的
				judgeType:sessionStorage.getItem('groupType')||10,//点击筛选内容存储当前筛选类型
				subType:'',//点击确定后储存确定的筛选类型
				tabId:sessionStorage.getItem('tabId')||0,//当前左侧tab栏
				typeOne:'',
				typeTwo:'',
				typeThree:'',
				typeFour:'',
				filterData:[],//筛选弹层内容，单选
				rightTitle:sessionStorage.getItem('rightTitle')||'全部',//右侧调度类型
				rightNot:sessionStorage.getItem('rightTitle')||'全部',//暂存
			}
		},
		beforeCreate () {
			document.title = '小组任务数';
		},
		created(){
			this.dingding();
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			this.loaded= new Loading()//加载loading
			var param = {"mobile":sessionStorage.getItem('mobile')};
			if(this.judgeType&&this.judgeType!=10){
				param.type = this.judgeType;
			}
			this.init(param);
		},
		methods:{
			dingding(){
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : '小组任务数',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
				    
				});
			},
			init(param){
				setTimeout(()=>{
					$('.group_main').height($(window).height()-30);
//					var topHei = $('.main_header').height();
//					$('.main_all').css('margin-top',topHei+20);
					$('.main_all').height($(window).height()-$('.main_header').height()-50);
				},80)
				
				var _this = this;
				myAjax.post(getApiUrl('/limit-line/group-list'),param, function (data) {
					if(data.status==0){
						_this.loaded.destroy();//清除loading
						_this.leftGroup = data.data.group;
						_this.rightMain = data.data.list;
						_this.mainAll = data.data.list;
						var typeNum = data.data.filter;
						_this.typeOne = typeNum.one;
						_this.typeTwo = typeNum.two;
						_this.typeThree = typeNum.three;
						_this.typeFour = typeNum.four;
						_this.filterData=[//筛选弹层内容，单选
							{"title":"调度类型","all":[{"name":"全部","type":"10"},{"name":"紧急调离限行区","type":"1","num":_this.typeOne},{"name":"调离限行区","type":"2","num":_this.typeTwo},{"name":"调入限行区（粤A）","type":"3","num":_this.typeThree},{"name":"调入限行区（非粤A）","type":"4","num":_this.typeFour}],"type":"s1"},
						]
						setTimeout(()=>{//如果是从详情页面返回，需要记录当前tab栏的值
							var tabId = sessionStorage.getItem('tabId')
							if(tabId&&tabId!='0'){
								$('.left_group.group'+tabId).addClass('show');
								$('.left_group.group'+tabId).siblings().removeClass('show');
								_this.tabEvent(tabId);
							}else{
								$('.group_one').addClass('show');
								$('.group_one').siblings().removeClass('show');
							}
						},30)
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
				
			},
			changeTab(leftId,leftName,e){//切换tab方法
				$(e.target).addClass('show');
				$(e.target).siblings().removeClass('show');
				this.typeTitle = leftName;//右侧调度类型赋值
				this.rightMain = this.mainAll;//为了下面的循环把列表数据重新全部赋值
				this.tabId = leftId;//保留当前值，去其他页面回来时保持当前tab
				this.tabEvent(leftId);
				$(".main_all").scrollTop(0);
			},
			tabEvent(leftId){//
				if(leftId!='0'){//如果点击tab不是全部情况时执行赋值
					var mainCon = this.rightMain;
					var arr = []
					for(var i=0;i<mainCon.length;i++){
						if(leftId==mainCon[i].group_id){
							arr.push(mainCon[i])
						}
					}
					this.rightMain=[];//把右侧小组内容置空
					this.rightMain = arr;//把筛选后的值赋给html中的数据
				}
			},
			filClose(){//筛选关闭
				this.filterShow = false;
				$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
			},
			fourFilter(decType,type,name,e){//点击筛选内容
				this.judgeType = type;//点击的时候给筛选条件赋值
				this.resetAll = false;//重置状态置为初始状态
				$(e.target).removeClass("bg_white").addClass('bg_black');
				$(e.target).siblings().removeClass("bg_black").addClass('bg_white');
				this.rightNot = name;
			},
			submitbut(){//筛选确定按钮
				var param={"mobile":sessionStorage.getItem('mobile')};
//				this.typeTitle = '全部';
				this.rightTitle = this.rightNot;
				sessionStorage.removeItem('rightTitle');
				if(this.judgeType&&this.judgeType!=10){
					param.type = this.judgeType;
					sessionStorage.setItem('groupType',this.judgeType)
				}else{
					$('.group_one').addClass('show');
					$('.group_one').siblings().removeClass('show');
					sessionStorage.removeItem('groupType')
					delete param.type
				}
				if(this.resetAll){
					delete param.type
					this.rightTitle='全部'
				}
				this.init(param);
				this.filterShow = false;
			},
			openFil(){//点击筛选按钮
				this.filterShow = true;
				$('.isOne').html('全部');//解决全部带（）的问题
				sessionStorage.removeItem('tabId');
				this.tabId = '0'
				this.judgeType = sessionStorage.getItem('groupType')
				if(this.judgeType&&this.judgeType!=10){
					$('#s1'+this.judgeType).removeClass("bg_white").addClass('bg_black');
					$('#s1'+this.judgeType).siblings().removeClass("bg_black").addClass('bg_white');
				}
			},
     		resetbtn(){//重置按钮
     			this.resetAll = true;
     			this.judgeType=10;
     			$('.isOne').removeClass("bg_white").addClass('bg_black');
				$('.notOne').addClass("bg_white").removeClass('bg_black');
     		},
     		reLoad(){//刷新按钮
     			$('.group_one').addClass('show');
				$('.group_one').siblings().removeClass('show');
				var param = {"mobile":sessionStorage.getItem('mobile')};
				if(this.judgeType&&this.judgeType!=10){
					param.type = this.judgeType;
				}
				var _this = this;
				myAjax.post(getApiUrl('/limit-line/group-list'),param, function (data) {
					if(data.status==0){
						_this.leftGroup = data.data.group;
						_this.rightMain = data.data.list;
						_this.mainAll = data.data.list;
						_this.isShow = true;
				 		_this.msg = '刷新成功';
				 		setTimeout(()=>{_this.isShow=false;},2000)
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
			 		}
				})
	     	},
     		goDeatil(type,id,carNum,name){//去任务详情
     			sessionStorage.setItem('tabId',this.tabId);
     			sessionStorage.setItem('typeTitle',name);
     			sessionStorage.setItem('rightTitle',this.rightTitle)
     			window.location.href = 'fourList.html#/groupDetail?type='+type+'&id='+id+'&carNum='+carNum;
     		},
     	
     	
		}
	}
</script>

<style>
</style>