<!--@xurr on 180612 车辆问题列表详情页面      
	1、显示车牌号/vin号，地址，车辆问题，上传时间；地址可点击，点击后打开地图，显示车辆位置（同非租赁状态车辆列表）
	2、车辆问题标签样式同“故障工单--车辆记录”里的标签，数字表示多渠道提交次数累加；红色标签表示需立即处理的问题，红色优先显示
	3、便签默认只显示前三个，其他的需要点开下拉箭头查看，展开后可收起
	4、列表分页，每10项一页，上滑加载
-->
<template>
	<div class="proDetails">
		<div class="det_header">
			<p class="header_item" @click="goHistory()">
				<span class="detail_icon"><img src="../../image/icon_search.png"/></span><span>搜索</span>
			</p>
			<p class="header_item item_center" @click="ifFilter()">
				<span class="detail_icon"><img src="../../image/icon_filter.png"/></span><span>筛选</span>
			</p>
			<p class="header_item" @click="onReload()">
				<span class="detail_icon"><img src="../../image/icon_refresh.png"/></span><span>刷新</span>
			</p>
		</div>
		<div class="noSearch" v-show='listData.length==0&&noFilter'>
			<img class="icon_nosearch" src="../../image/icon_nosearch.png"/>
			<p>无筛选结果</p>
		</div>	
		<div class="detail_all">
			<ul  class="list_all">
				 <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
		            <ul class="listItem">
		            	<li class="search_result" v-show="isSearch">搜索“{{resultName}}”，结果如下：</li>
		                <li class="detail_item" 
		                	v-for="(items,index) in listData"
		                	:key = 'index'
		                >
							<div @click="goCarpro(items.plate_no,items.vin,items.update_time,items.car_id,items.branch_name,items.biz_type)">
							<p class="car_card">
								<span class="fc33">{{items.plate_no}} </span>
								(<span class="fc99" v-if="items.vin"> {{items.vin.substring(0, 11)}}</span> 
								<span class="fc33" v-if="items.vin">{{items.vin.substring(11, 17)}} </span>)
							</p>
							<p class="detail_addr fc66">
								<span class="icon_addr">
									<img src="../../image/mapb.png" alt=""  v-if='items.biz_type==0'/>
									<img src="../../image/map-B.png" alt=""  v-else/>
								</span>
								<span>{{items.branch_name}}</span>
								<span class="go_guide" @click="gotMap(items.plate_no,$event)">
									<span class="icon_guide">
										<img src="../../image/carNetstock/daohang.png"/>
									</span>
									导航
								</span>
								
							</p>
							<p class="detail_date fc99">上传时间：<span class="fc33">{{items.update_time}}</span></p>
							<div class="details_all show_content" data-num="'list'+index" :class="'list'+index">
								<span 
									v-for="(pro_item,keys) in items.part_info"
									:key = 'keys'
									:class='pro_item.broken_level==1?"red_detail":"black_detail"' 
									class="pro_item"
								>{{pro_item.desc}}<span>({{pro_item.report_cnt}})</span></span>
							</div>
							</div>
							<div class="click_btn" v-show = "items.part_info.length>3">
								<span class="show_btn"  @click="showHide('list'+index,$event)">
									<img src="../../image/icon_show.png"/>
								</span>
							</div>
						</li>
		            </ul>
		        </vscroll>
			</ul>
		</div>
		<div class="check_modal" v-show="filterShow">
			<div class="filter_cont">
				<div class="filter_header">
					<span class="close_modal" @click="filClose()">
						X
					</span>
					<span class="filter_title">筛选</span>
				</div>
				<div class="filter_all">
					<div class="filter_more">
						<div class="filter_dec" 
							v-for="(dec,indexs) in filterData1"
							:key = 'indexs'
							:class="'filter'+indexs"
						>
							<p class="fildec_title fc99">{{dec.title}}</p>
							<div class="fildec_cont">
								<span class="fildec_items" 
									:data-i='items.type' 
									:id = 'items.type' 
									v-for="(items,index) in dec.all"
									:key = 'index'
									:class="[index==0?'bg_black':'bg_white',index==0?dec.type+index:dec.type]" 
									@click="filterMore(items,dec.type,index,$event)"
								>{{items.name}}</span>
							</div>
						</div>
					</div>
					<div class="filter_only">
						<div class="filter_dec" 
							v-for="(dec,indexs) in filterData2"
							:key = 'indexs'
						>
							<p class="fildec_title fc99">{{dec.title}}</p>
							<div class="fildec_cont filonly_cont">
								<label :for="index"  
									v-for="(items,index) in dec.all"
									:key = 'index'
									class="filonly_items"
								>
									<!--<input class="only_check" :class="index==0?'only'+index:dec.type" :name="dec.type=='s3'?'radio':'source'" type="radio" :value="items.name"  :checked="index==0?true:false"  @click="filterOnly(items,dec.type,index,$event)">-->
									<input class="only_check" :class="[index==0?dec.type+index:dec.type,index==0?'only'+index:dec.type,index==0?'filcheck':'fil'+items.type]" :name="dec.type=='s3'?'radio':'source'" type="radio" :value="items.name" @click="filterOnly(items,dec.type,index,$event)">
									{{items.name}}
								</label>
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
	import myAjax from '../../common/myAjax/withJq.js'
	import vscroll from '../../../../../component/VUEpullDownRefresh'
	import getApiUrl from '../../js/getApiUrl';
	import Loading from '../../../../../component/loading'
	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				//假数据
				listData:'',
				show:true,
				filterShow:false,//筛选弹层
				//筛选弹层数据
				filterData1:[//筛选弹层内容，多选
					{"title":"车辆状态","all":[{"name":"全部状态","type":"0"},{"name":"空闲","type":"1"},{"name":"维修","type":"31"},{"name":"调度","type":"30"}],"type":"s1"},
					//保持循环一致，以下结构与上结构保持一致
					{"title":"部位","all":[{"name":"全部部位","type":"0"},{"name":"爆胎","type":"25"},{"name":"趴窝","type":"26"},{"name":"车机","type":"24"},{"name":"雷达","type":"21"},{"name":"仪盘表","type":"22"},{"name":"无法启动","type":"27"},{"name":"车胎没气","type":"23"}],"type":"s2"}
				],
				filterData2:[//筛选弹层内容，单选
					{"title":"车伤量","all":[{"name":"全部有伤","type":"0"},{"name":"1处伤","type":"1"},{"name":"2处伤","type":"2"},{"name":"3处伤","type":"3"},{"name":"4处及以上","type":"4"}],"type":"s3"},
					{"title":"来源","all":[{"name":"全部来源","type":"0"},{"name":"客服上报","type":"2"},{"name":"运维上报","type":"4"},{"name":"用户上报","type":"1"}],"type":"s4"}
				],
				isno:false,
				branchId:JSON.parse(sessionStorage.getItem('resId'))||'',
				isShow:false,//失败弹窗提示
				msg:'',//失败弹窗内容
				//上拉下拉数据
				loading:false,
				type:'',//入口
				num:'',//有伤数量
				source:'',//来源
				isload:false,//是否改变了筛选条件
				//组件
				 nums: 1,
			     refreshing: false,
			     loading: false,
			     //地图
			     lng:'',
			     lat:'',
			     noData:false,
			     isSearch:false,//是否搜索页面过来
			     resultName:JSON.parse(sessionStorage.getItem('name')),//搜索结果
			     apiUrl:'',
			     isAll:'',
			     noFilter:false,//是否为筛选结果
			     istype:'',
			     counter: 1, //当前页
                pages: 10, // 一页显示多少条
                pageStart: 0, // 开始页数
                pageEnd: 0, // 结束页数
                listdata: [], // 下拉更新数据存放数组
                scrollData: {
                    noFlag: false //暂无更多数据显示
                },
                rest:false,//重置
			}
			
		},
		beforeCreate () {
			document.title = '车辆问题列表';
		},
		created(){
			
		},
		destroyed(){
			this.loaded.destroy()//清除loading
		
		},
		mounted () {
			//进入页面重置筛选条件
			this.filterShow?$('.proDetails').css('overflow','hidden'):$('.proDetails').css({'overflow-y':'auto','overflow-x':'hidden'})
			let checkLen = $('.s1.bg_black').length;
			$('.list_all').height($(window).height() - $('.det_header').height());
			//初始化数据
			var url = window.location.href
			this.istype = this.getUrl(url).type;
			this.type = this.getUrl(url).type;
			this.type==8?this.isSearch=true:this.isSearch=false;
			this.type==4||this.type==8?this.type='':this.type=this.type;
			this.loaded= new Loading()//加载loading
			this.enterInit();//钉钉授权
			//筛选框恢复为默认
			sessionStorage.removeItem('car_parts');
			sessionStorage.removeItem('status');
			sessionStorage.removeItem('num');
			sessionStorage.removeItem('source');
			//限制上拉加载数据
			setTimeout(()=>{
				if(this.listData.length<10&&this.istype==8){
					this.$el.querySelector('.load-more').remove();
				}
			},100)
		},
		methods:{
			enterInit(){//初始化进入页面
				dd.ready(function () {
					//禁用iOS webview弹性效果
					dd.ui.webViewBounce.disable();
					dd.biz.navigation.setTitle({
					    title : '车辆问题列表',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
				})
				var that = this;
				if(that.istype==8){
	            	that.apiUrl = '/vehicle-problem/branch-car';
					var param = {
						mobile:sessionStorage.getItem('mobile'),
						"branch_id":that.branchId
					}
					that.init(param);
				}else{
					that.apiUrl = '/vehicle-problem/list';
					var param = {
						mobile:sessionStorage.getItem('mobile')||'13521758602',
						city_id:sessionStorage.getItem('city_id'),
						group:that.type,
						'lng':sessionStorage.getItem('lng'),
						'lat':sessionStorage.getItem('lat'),
						page:that.nums,
					}
					that.init(param);
				}

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
			init(param){//请求列表数据
				var _this = this;
				myAjax.post(getApiUrl(_this.apiUrl), param, function (data) {
					if(data.status==0){ 
				 		_this.listData = data.data;
						//上拉、下拉加载
						_this.refreshing = false;
						_this.loaded.destroy()//清除loading
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg
				 		setTimeout(()=>{_this.isShow=false;},2000)
				 	}
				})
			},
			goCarpro(chepai,vin,date,id,branch_name,biz_type){
				var listItem = {'plate_no':chepai,'vin':vin,'update_time':date,'car_id':id,'branch_name':branch_name,'biz_type':biz_type};
				sessionStorage.setItem('listItem',JSON.stringify(listItem));
				sessionStorage.removeItem('resultData')
				window.location.href = 'proOrder.html#/carProDetail';
			},
			showHide(listItem,e){//控制展开与收起
				e.preventDefault();
				var _this = e.target
				if(this.show){
					this.show=false;
					$('.'+listItem).removeClass("show_content").addClass("hide_content");
					$(e.target).attr('src',require('../../image/icon_hide.png'))
				}else{
					this.show=true;
					$('.'+listItem).addClass("show_content").removeClass("hide_content");
					$(e.target).attr('src',require('../../image/icon_show.png'))
				}
				
			},
			filterMore(all,type,index,e){//多选
				var name = all.name;
				var filtype = all.type;
				if(filtype==0){//处理全选与否
					$('.'+type).removeClass("bg_black").addClass('bg_white');
					$('.'+type+'0').removeClass("bg_white").addClass('bg_black');
				}else{
					var checkLen = $("."+type+".bg_black").length;
					if(checkLen>1){
						if($(e.target).hasClass("bg_black")){
							$(e.target).removeClass("bg_black").addClass('bg_white')
						}else{
							$(e.target).removeClass("bg_white").addClass('bg_black')
						}
					}else{
						$(e.target).removeClass("bg_white").addClass('bg_black')
					}
					$('.'+type+'0').removeClass('bg_black').addClass('bg_white');
					
				}
				this.isload = true;
				this.rest = false;
			},
			filterOnly(all,type,index,e){//单选
				this.isload = true;
				this.rest = false;
				if(type=='s3'){
					all.type!=0?this.num = all.type:this.num = '';//车伤量
				}else{
					all.type!=0?this.source = all.type:this.source='';//来源
				}
//				$('.s3.fil'+all.type).prop('checked',true);
//				$('.s4.fil'+all.type).prop('checked',true);
			},
			submitbut(){//确认
				//列表内问题项全部恢复默认
				$('.details_all').addClass("show_content").removeClass("hide_content");
				$('.show_btn img').attr('src',require('../../image/icon_show.png'));
				this.show = true;
			    var status = $('.fildec_cont').find($('.s1.bg_black'));//车辆状态
			    var status2 = $('.fildec_cont').find($('.s2.bg_black'));//部位
				var statusArr = [],statusArr2 = [],styleArr = [],styleArr2 = [];
				for(var i=0;i<status2.length;i++){
					var datai = $(status2[i]).data('i');
					statusArr2.push(datai);
				}
				for(var i=0;i<status.length;i++){
					var datai = $(status[i]).data('i')
					statusArr.push(datai);
				}
				var statusArr = statusArr.join(',');
				
				if(statusArr2){sessionStorage.setItem('car_parts',JSON.stringify(statusArr2))}else{
					sessionStorage.removeItem('car_parts')
				}
				if(this.source){sessionStorage.setItem('source',this.source)}else{
					sessionStorage.removeItem('source')
				}
				if(this.num){sessionStorage.setItem('num',this.num)}else{
					sessionStorage.removeItem('num')
				}
				if(statusArr){sessionStorage.setItem('status',statusArr)}else{
					sessionStorage.removeItem('status')
				}
				if(this.rest){
					sessionStorage.removeItem('status')
					sessionStorage.removeItem('num')
					sessionStorage.removeItem('source')
					sessionStorage.removeItem('car_parts')
					this.num='';
					this.source = '';
				}
					var param = {
						mobile:sessionStorage.getItem('mobile'),
						car_parts:statusArr2,
						city_id:sessionStorage.getItem('city_id'),
						source:this.source,
						group:this.type,
						status:statusArr,
						'lng':sessionStorage.getItem('lng'),
						'lat':sessionStorage.getItem('lat'),
						num	:this.num,
	//					page:1,
					}
				this.isload = true;
				if(this.isload){//筛选参数和筛选结果
					this.apiUrl = '/vehicle-problem/list';
					var _this = this;
					myAjax.post(getApiUrl(_this.apiUrl), param, function (data) {
						if(data.status==0){ 
							_this.noFilter = true;
					 		_this.listData = data.data;
							//上拉、下拉加载
							_this.refreshing = false;
							_this.loaded.destroy()//清除loading
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg
					 		setTimeout(()=>{_this.isShow=false;},2000)
					 	}
					})
					this.isSearch = false;
				}
				this.filterShow=false;
				$('.proDetails').css({'overflow-y':'auto','overflow-x':'hidden'});
				
			},
			resetbtn(){//重置
				$('.s10'+','+'.s20').removeClass("bg_white").addClass('bg_black');
				$(".s1"+","+".s2").removeClass('bg_black').addClass('bg_white');
				$('.only0').prop('checked',true);
				$(".s30"+","+".s40").prop('checked',true);
				$(".s3"+","+".s4").prop('checked',false);
				this.isload = false;
				this.rest = true;
			},
			filClose(){//关闭弹层
				 this.filterShow=false;
				 $('.proDetails').css({'overflow-y':'auto','overflow-x':'hidden'});
				 $('.s10'+','+'.s20').removeClass("bg_white").addClass('bg_black');
				$(".s1"+","+".s2").removeClass('bg_black').addClass('bg_white');
				$('.only0').prop('checked',true);
				$(".s30"+","+".s40").prop('checked',true);
				$(".s3"+","+".s4").prop('checked',false);
			},
			ifFilter(){//点击筛选按钮
				 this.filterShow=true;
				  $('.proDetails').css({'overflow':'hidden'});
				  //循环数组取出data-i，如果有则添加样式，没有移除样式
				  var statusArr2 = JSON.parse(sessionStorage.getItem('car_parts'));
				 var statusArr = sessionStorage.getItem('status');
				 var senum = sessionStorage.getItem('num');
				 var sesource = sessionStorage.getItem('source');
				 if(statusArr2){
//				 	var carparts = statusArr2.split(',');
				 	var carparts = statusArr2;
				 	for(var i=0;i<carparts.length;i++){//车伤部位
					 	if(carparts[i]!=0){
					 		$('.s20').removeClass("bg_black").addClass('bg_white');
					 		$('#'+carparts[i]).removeClass("bg_white").addClass('bg_black');
					 	}
					 	
					 }
				 }
				 if(statusArr){
				 	var status = statusArr.split(',');
				 	for(var i=0;i<status.length;i++){//状态
					 	if(status[i]!=0){
					 		$('.s10').removeClass("bg_black").addClass('bg_white');
					 		$('#'+status[i]).removeClass("bg_white").addClass('bg_black');
					 	}
					 	
					 }
				 }
				 
				 
				 if(senum&&senum!=0){
				 	$('.s30').prop('checked',false);
				 	$('.s3.fil'+senum).prop('checked',true);
				 }else{
				 	$('.s30').prop('checked',true);
				 	$(".s3").prop('checked',false);
				 }
				 if(sesource&&sesource!=0){
				 	$('.s40').prop('checked',false);
				 	$('.s4.fil'+sesource).prop('checked',true);
				 }else{
				 	$('.s40').prop('checked',true);
				 	$('.s4').prop('checked',false);
				 }
//				  $('.s10'+','+'.s20').removeClass("bg_white").addClass('bg_black');
//				$(".s1"+","+".s2").removeClass('bg_black').addClass('bg_white');
//				$('.only0').prop('checked',true);
//				$(".s3"+","+".s4").prop('checked',false);
				$('.proDetails').scrollTop(0)
			},
			goHistory(){//搜索
				window.location.href = 'proOrder.html#/searchPro?enter=1&&type='+this.type;
			},
			gotMap(plate_no,e){//去地图页面
				e.stopPropagation();
				window.location.href = "../oilerSingle/carLocation.html?name="+plate_no;
			},
			//刷新按钮
			onReload(){
				this.noData = false;
			    this.noFilter = false;
			    $('.proDetails').scrollTop(0);
			    setTimeout(() => {
			        this.nums = 1;
					if(this.istype==8){
		            	this.apiUrl = '/vehicle-problem/branch-car';
						var param = {
							mobile:sessionStorage.getItem('mobile'),
							"branch_id":this.branchId
						}
					}else{
						this.apiUrl = '/vehicle-problem/list';
						var param = {
				        	mobile:sessionStorage.getItem('mobile'),
							car_parts:JSON.parse(sessionStorage.getItem('car_parts')),
							city_id:sessionStorage.getItem('city_id'),
							source:sessionStorage.getItem('source'),
							group:this.type,
							status:sessionStorage.getItem('status'),
							'lng':sessionStorage.getItem('lng'),
							'lat':sessionStorage.getItem('lat'),
							num	:sessionStorage.getItem('num'),
							page:this.nums,
						}
					}
			        var _this = this;
					myAjax.post(getApiUrl(_this.apiUrl), param, function (data) {
						if(data.status==0){ 
							_this.isShow = true;
					 		_this.msg = '刷新成功';
					 		setTimeout(()=>{_this.isShow=false;},2000)
						
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg
					 		setTimeout(()=>{_this.isShow=false;},2000)
					 	}
					})
					
			    }, 1000)
			},
			//上拉加载，下拉刷新
            onRefresh(done) {
                this.noData = false;
			    this.noFilter = false;
			    $('.proDetails').scrollTop(0)
			    setTimeout(() => {
			        this.nums = 1;
			        if(this.istype==8){//判断入口
						var param = {
							mobile:sessionStorage.getItem('mobile'),
							"branch_id":this.branchId
						}
						this.apiUrl = '/vehicle-problem/branch-car'
						this.init(param);
					}else{
						var param = {
							mobile:sessionStorage.getItem('mobile'),
							car_parts:JSON.parse(sessionStorage.getItem('car_parts')),
							city_id:sessionStorage.getItem('city_id'),
							source:sessionStorage.getItem('source'),
							group:this.type,
							status:sessionStorage.getItem('status'),
							'lng':sessionStorage.getItem('lng'),
							'lat':sessionStorage.getItem('lat'),
							num	:sessionStorage.getItem('num'),
							page:this.nums,
						}
				        this.apiUrl = '/vehicle-problem/list'
						this.init(param);
					}
			    }, 2000)

                done(); // 回调子组件 done

            },
            onInfinite(done) {
            	if(this.listData.length>=10&&this.istype!=8){
	                this.counter++;
	                let end = this.pageEnd = this.pages * this.counter;
	                let i = this.pageStart = this.pageEnd - this.pages;
	                let more = this.$el.querySelector('.load-more')
	                this.loading = true;
			      	this.noFilter = false;
			        this.nums ++;
			        var param = {
			        	mobile:sessionStorage.getItem('mobile'),
						car_parts:JSON.parse(sessionStorage.getItem('car_parts')),
						city_id:sessionStorage.getItem('city_id'),
						source:sessionStorage.getItem('source'),
						group:this.type,
						status:sessionStorage.getItem('status'),
						'lng':sessionStorage.getItem('lng'),
						'lat':sessionStorage.getItem('lat'),
						num	:sessionStorage.getItem('num'),
						page:this.nums,
					}
			        var _this = this;
					myAjax.post(getApiUrl('/vehicle-problem/list'), param, function (data) {
						if(data.status==0){ 
							_this.loading = false;
					 		var reList = data.data;
					 		if(reList.length==0){
	//						 			_this.noData=true;
					 			more.style.display = 'none'; //隐藏加载条
		                        //走完数据调用方法
		                        _this.scrollData.noFlag = true;
					 		}
					 		var arr = _this.listData
					 		for(var i=0;i<reList.length;i++){
					 			arr.push(reList[i])
					 			
					 		}
					 		_this.listData = [];
					 		_this.listData = arr;
							//上拉、下拉加载
						
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg
					 		setTimeout(()=>{_this.isShow=false;},2000)
					 	}
					})
            	}
				
                done();
            }
			
		}
	}
</script>

<style>
</style>