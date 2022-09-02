<!--
	作者：xurui_518@163.com
	时间：2018-06-20
	描述：历史验车单页面
-->
<template>
	<div class="pictureHis">
		<div class="pic_header">
			<p class="pic_fil" @click="picShow()">
				<span class="detail_icon"><img src="../images/icon_filter.png"/></span><span>筛选</span>
			</p>
		</div>
		<div class="noSearch" v-show='picData.length==0&&nofil'>
			<img class="icon_nosearch" src="../images/icon_nosearch.png"/>
			<p>无筛选结果</p>
		</div>
		<ul class="picList" v-show="picData.length>0">
			<vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
	            <ul>
	                <li class="pic_item" v-for="picItem in picData">
						<div class="pic_title">
							<p class="pic_cont">
								<span class="pic_icon">
						
								</span>
								<span>
									<span class="fc33 pic_name">{{ picItem.name }}</span>
									<span class="fc66">{{ picItem.rental_id }}</span>
								</span>
								
							</p>
							<span class="fc66">{{ picItem.updatetime }}</span>
						</div>
						<div class="pic_all">
							<div v-show="picItem.type!=0" class="fc66 pic_dec">
								{{picItem.get_back_type}}&nbsp;&nbsp;&nbsp;{{picItem.real_name}}&nbsp;({{picItem.mobile}})
							</div>
							<div class="pics">
								<span class="pic_img" v-for="(pic,index) in picItem.photo_string">
									<!--<img :src="pic['pre_'+index]"/ >-->
									<img @click="bigImg(pic)" :src="pic"/>
								</span>
								
							</div>
						</div>
						
					</li>
	            </ul>
	       	</vscroll>
		</ul>
		<div class="check_modal" v-show="filterShow">
			<div class="filter_cont">
				<div class="filter_header">
					<span class="close_modal" @click="picClose()">
						X
					</span>
					<span class="filter_title">筛选</span>
				</div>
				<div class="filter_all">
					<div class="filter_more">
						<div class="filter_dec" v-for="(dec,indexs) in picfil" :class="'filter'+indexs">
							<p class="fildec_title fc99">{{dec.title}}</p>
							<div class="fildec_cont">
								<span class="fildec_items" v-for="(items,index) in dec.all" :id='items.type' :class="[index==0?'bg_black':'bg_white',index==0?'piccheck':'piconly']" @click="picFils(items,index,$event)">{{items.name}}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="filter_footer">
					 <input class="filter_reset" type="reset" name="butReset" value="重置" @click="picReset()">
					 <input class="filter_submit" type="submit" name="butSubmit" value="确定" @click="picSub()">
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
	import vscroll from '../../../../component/VUEpullDownRefresh'
	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				listItem:JSON.parse(sessionStorage.getItem('listItem')),//获取缓存数据
				type:'',
				picData:[],
				filterShow:false,//弹层 0短租订单图片;1长租订单图片;2加油工单;3调度工单
				picfil:[//筛选条件
					{"title":"上报来源","all":[{"name":"全部","type":"4"},{"name":"用户上报","type":"0"},{"name":"调度工单","type":"3"},{"name":"加油工单","type":"2"}]}
				],
				pictype:'',//筛选类型
				loads:'',//是否刷新页面
				msg:'',
				isShow:false,
				//组件
				num: 1,
		      	refreshing: false,
		      	loading: false,//是否加载中
				noData:false,//没有数据
				bigPic:false,//查看大图
				nofil:false,
				counter: 1, //当前页
	                pages: 10, // 一页显示多少条
	                pageStart: 0, // 开始页数
	                pageEnd: 0, // 结束页数
	                listdata: [], // 下拉更新数据存放数组
	                scrollData: {
	                    noFlag: false //暂无更多数据显示
	                },
	            isBig:false,//是否触发钉钉查看图片
	            bigData:'',//当前图片的所有连接
	            carId:sessionStorage.getItem('car_id'),
	            
			}
		},
		beforeCreate () {
			document.title = '历史验车单';
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			var param = {
					mobile:sessionStorage.getItem('mobile'),
					'car_id' : this.listItem.car_id||this.carId,
					'type':'',
					'page':this.num,
				}
			this.init(param);
			this.dingReady();
			$('.picList').height($(window).height() - $('.pic_header').height());
			let pullHeight = this.$el.querySelector('.pull-refresh')
		     	pullHeight.style.height = ".85rem";
		    sessionStorage.removeItem('picType')
			this.loaded= new Loading()//加载loading
		},
		methods:{
			dingReady(imgUrl){
				var _this = this;
				dd.ready(function () {
					dd.ui.webViewBounce.disable();
					dd.biz.navigation.setTitle({
					    title : '历史验车单',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
					if(_this.isBig){
						dd.biz.util.previewImage({//图片预览
						    urls: _this.bigData,//图片地址列表
						    current: imgUrl,//当前显示的图片链接
						    onSuccess : function(result) {
						        /**/
						    },
						    onFail : function(err) {}
						})
					}
					
					
				})
			},
			bigImg(imgUrl){
				this.isBig =true;
				this.dingReady(imgUrl);
			},
			init(param){
				var _this = this;
				myAjax.post(getApiUrl('/vehicle-problem/car-failure-list'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy()//清除loading
						_this.picData = data.data;
						_this.refreshing = false;
						var bigPic = []
						for(var i=0;i<_this.picData.length;i++){
							var pics = _this.picData[i].photo_string
							for(var j=0;j<pics.length;j++){
								bigPic.push(pics[j])
							}
						}
						_this.bigData = bigPic;
					}else{
						_this.isShow = true;
					 	_this.msg = data.msg;
						setTimeout(()=>{_this.isShow=false;},2000)
						
					}
				})
				
			},
			picShow(){//筛选按钮
				this.filterShow=true;
				$('.pictureHis').scrollTop(0);
				$('.pictureHis').css({'overflow':'hidden'});
				var sePic = sessionStorage.getItem('picType');
				if(sePic&&sePic!=4){
					$('#'+sePic).removeClass("bg_white").addClass('bg_black');
					$('#'+sePic).siblings().removeClass("bg_black").addClass('bg_white');
				}
				
			},
			picFils(all,index,e){//筛选框
				var name = all.name;
				var filtype = all.type;
				filtype==4?filtype='':filtype;
				this.pictype = filtype;
				$(e.target).removeClass("bg_white").addClass('bg_black');
				$(e.target).siblings().removeClass("bg_black").addClass('bg_white');
				this.loads = true;
			},
			picReset(){//重置
				$('.piccheck').removeClass("bg_white").addClass('bg_black');
				$('.piconly').addClass("bg_white").removeClass('bg_black');
				this.pictype = '';
//				this.loads=false;
			},
			picSub(){
//				if(this.loads){
					var param = {
						mobile:sessionStorage.getItem('mobile'),
						'car_id' : this.listItem.car_id||this.carId,
						'type':this.pictype,
						'page':1,
					}
					
					var _this = this;
					myAjax.post(getApiUrl('/vehicle-problem/car-failure-list'), param, function (data) {
						if(data.status==0){
							_this.loaded.destroy()//清除loading
							_this.picData = data.data;
							_this.refreshing = false;
							_this.nofil = true;
							var bigPic = []
							for(var i=0;i<_this.picData.length;i++){
								var pics = _this.picData[i].photo_string
								for(var j=0;j<pics.length;j++){
									bigPic.push(pics[j])
								}
							}
							_this.bigData = bigPic;
						}else{
							_this.isShow = true;
						 	_this.msg = data.msg;
							setTimeout(()=>{_this.isShow=false;},2000)
							
						}
					})
//				}
				if(this.pictype&&this.pictype!=4){
					sessionStorage.setItem('picType',this.pictype)
				}else{
					sessionStorage.removeItem('picType')
				}
				
				this.filterShow=false;
				$('.pictureHis').css({'overflow-y':'scroll','overflow-x':'hidden'});
				
			},
			picClose(){
				this.filterShow=false;
				$('.pictureHis').css({'overflow-y':'scroll','overflow-x':'hidden'});
			},
		    onRefresh(done) {
		      this.refreshing = true;
		      this.noData = false;
		      this.nofil = false;
		      $('.pictureHis').scrollTop(0);
		        this.num = 1;
		        var param = {
		        	mobile:sessionStorage.getItem('mobile'),
					'car_id' : this.listItem.car_id||this.carId,
					'type':this.pictype||'',
					'page':this.num,
				}
				this.init(param);
		        done();
		    },
		    onInfinite(done) {
		    	let more = this.$el.querySelector('.load-more')
		      	this.loading = true;
	      		this.nofil = false;
	        	this.num ++;
	        	var param = {
	        		mobile:sessionStorage.getItem('mobile'),
					'car_id' : this.listItem.car_id||this.carId,
					'type':this.pictype||'',
					'page':this.num,
				}
	        	var _this = this;
	        	myAjax.post(getApiUrl('/vehicle-problem/car-failure-list'), param, function (data) {
					if(data.status==0){
						_this.loading = false;
						var reList = data.data;
						if(reList.length==0){
				 			_this.noData=true;
				 			more.style.display = 'none';
				 			_this.scrollData.noFlag = true;
				 		}else{
				 			var arr = _this.picData
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 		}
					 		_this.picData = [];
					 		_this.picData = arr;
					 		var bigPic = []
							for(var i=0;i<_this.picData.length;i++){
								var pics = _this.picData[i].photo_string
								for(var j=0;j<pics.length;j++){
									bigPic.push(pics[j])
								}
							}
							_this.bigData = bigPic;
				 		}
				 		
					}else{
						_this.isShow = true;
					 	_this.msg = data.msg;
						setTimeout(()=>{_this.isShow=false;},2000)
						
					}
				})
				done();
					
		    }
		}
	}
</script>

<style>
</style>