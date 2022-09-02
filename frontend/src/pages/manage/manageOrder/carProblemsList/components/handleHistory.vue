<!--xurr on 180613
	操作历史页面  
-->
<template>
	<div class="handleHistory">
		<p class="handle_title fc33">操作历史：</p>
		<div v-show = "isHisdata" class="noHis">暂无数据...</div>
		<div class="handle_cont" >
			<ul v-show="historyData.length>0">
				<vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
		            <ul class="hisUl">
		                <li class="handle_items fc66" v-for="hisItem in historyData">
							<p>
								<span>{{ hisItem.create_time }}</span>&nbsp;&nbsp;<span class="handle_name"> {{ hisItem.car_parts_status }}</span>
							</p>
							<p class="handle_note">
								<span class="note_title">备注：</span>
								<span>
									<span v-for="note in hisItem.car_parts">
										{{note.desc}}
									</span>
								</span>
							</p>
							<p class="user_info">
								<span class="user_name">
									{{ hisItem.manage_name }}
								</span>
								<span class="user_tel">
									({{hisItem.manage_phone}})
								</span>
							</p>
						</li>
		            </ul>
		       </vscroll>
			
			</ul>
		</div>
		
		<div class="Toast" v-show = 'isShow'><span class="msg">{{msg}}</span></div>
		
	</div>
</template>

<script>
	import $ from "jquery";
	import myAjax from '../../common/myAjax/withJq.js'
	import getApiUrl from '../../js/getApiUrl';
	import Loading from '../../../../../component/loading'
	import vscroll from '../../../../../component/VUEpullDownRefresh'
	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				listItem:JSON.parse(sessionStorage.getItem('listItem')),//获取缓存数据
				historyData:[],
				isShow:false,
				msg:'',
				//组件
				num: 1,
			      refreshing: false,
			      loading: false,
			      lastTxt:true,
			      loadedall:false,
			      noData:false,
			      isHisdata:false,
			      counter: 1, //当前页
	                pages: 10, // 一页显示多少条
	                pageStart: 0, // 开始页数
	                pageEnd: 0, // 结束页数
	                listdata: [], // 下拉更新数据存放数组
	                scrollData: {
	                    noFlag: false //暂无更多数据显示
	                },
	                onload:true,
	                carId:sessionStorage.getItem('car_id'),
			}
		},
		beforeCreate () {
			document.title = '操作历史';
		},
		destroyed(){
//			$('html').height('100%');
			this.loaded.destroy()//清除loading
		},
		mounted () {
			this.init();
			this.loaded= new Loading()//加载loading
			setTimeout(()=>{
				if(this.historyData.length<10){
					this.$el.querySelector('.load-more').remove();
				}
			},100)
			$('.noHis').css('margin-top',$('.handle_title').height()+50);
			let pullHeight = this.$el.querySelector('.pull-refresh')
		     	pullHeight.style.height = ".85rem";
		},
		methods:{
			init(){
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : '操作历史',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
				    //钉钉获取定位 钉钉浏览器内使用
				  	dd.ui.webViewBounce.disable(); 
				});
				var param = {
					'car_id' : this.listItem.car_id||this.carId,
					'page':this.num,
					mobile:sessionStorage.getItem('mobile'),
				}
				var _this = this;
				myAjax.post(getApiUrl('/vehicle-problem/operate-history'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy()//清除loading
						 _this.refreshing = false;//刷新后隐藏刷新按钮
						_this.historyData = data.data;
						if(_this.historyData.length==0)_this.isHisdata = true;
					}else{
						_this.isShow = true;
					 		_this.msg = data.msg;
						setTimeout(()=>{this.isShow=false;},2000)
					}
				})
			},
			onRefresh(done) {
		      this.refreshing = true;
		      this.noData = false;
		      $('.handleHistory').scrollTop(0);
		        this.num = 1;
		        this.init();
		        done();
		    },
		    onInfinite(done) {
		    	if(this.historyData.length>=10){
			    	let more = this.$el.querySelector('.load-more')
			      	this.loading = true;
			        this.num ++;
			        var param = {
			        	mobile:sessionStorage.getItem('mobile'),
						'car_id' : this.listItem.car_id||this.carId,
						'page':this.num
					}
					var _this = this;
					myAjax.post(getApiUrl('/vehicle-problem/operate-history'), param, function (data) {
						if(data.status==0){ 
							_this.loading = false;
							var reList = data.data;
							if(reList.length==0){
					 			_this.noData=true;
					 		}
							if(reList.length==0){
								_this.lastTxt = false;
								_this.loadedall = true;
								more.style.display = 'none'; //隐藏加载条
								_this.scrollData.noFlag = true;
								_this.onload = false;
							}else{
								_this.lastTxt = true;
							}
							var arr = _this.historyData;
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 		}
					 		_this.historyData = [];
					 		_this.historyData = arr;
						}else{
							_this.isShow = true;
						 	_this.msg = data.msg;
							setTimeout(()=>{_this.isShow=false;},2000)
						}
					})
				}
				done();
			},
						
		}
	}
</script>

<style>
</style>