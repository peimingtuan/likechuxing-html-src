<!--
	作者：xurui_518@163.com
	时间：2018-06-26
	描述：事故管理
	1、判断事故专员的城市权限，只显示权限内城市
	2、钉钉获取头像，点击头像拨打电话，拨打电话前弹窗提示
	3、顶部状态为固定
	4、
-->
<template>
	<div class="office">
		<div class="offi_til fc99" v-show="iflimit==1||ifoffDuty==1">
			<p class="offi_txt" v-if="noduty">您当前不在线，请点击下方按钮上班~</p>
			<div class="offi_duty" v-else>
				<p class="self_info">
					<span class="self_filt">
						<span v-show='selfImg==null||!selfImg'>{{selfName}}</span>
						<img :src="selfImg" alt=""  v-show = 'selfImg'/>
					</span>
					<span class="self_name">{{selfData.real_name}}</span>
					<span class="self_status">上班中</span>
				</p>
				<p class="self_addr">
					<span class="addr_icon">
						<img src="../image/icon_addr.png" alt="" />
					</span>
					<span>{{selfData.city_name}}</span>
				</p>
			</div>
			<div class="offi_line"></div>
		</div>
		<div class="offi_content">
			<ul class="offiUl">
				<vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
		            <ul class="dutyHei">
		                <li class="offi_item" v-for="duty in dutyList">
							<p class="city_title">{{duty.city_name}}事故处理专员</p>
							<div class="offi_staffs">
								<div class="staff_items" v-for="staff in duty.list">
									<span class="staff_img" @click="goTel(staff.real_name,staff.mobile)">{{staff.real_name.substring(staff.real_name.length-2)}}</span>
									<span class="staff_name">{{staff.real_name}}</span>
								</div>
							</div>
						</li>
					</ul>
		       	</vscroll>
			</ul>
		</div>
		<div class="offi_footer" v-show="iflimit==1&&dutyOn">
			<div class="offi_btn offi_on" @click="goDuty()">
				我要上班
			</div>
		</div>
		<div class="offi_footer" v-show="initNo&&ifoffDuty==1&&!dutyOn">
			<div class="offi_btn offi_up" @click="goDuty()">
				我要下班
			</div>
		</div>
		
		<div class="check_modal" v-show="isModal">
			<!--拨打电话内容-->
			<div class="modal_content"  v-show="isTel">
				<p class="modal_title">是否给  {{telName}} 拨号？</p>
				<div class="text_dec">
					{{telNum}}
				</div>
				<div class="alert_btn">
					<p class="cancel_btn" @click="cancelBtn()">
						<a>取消</a>
					</p>
					<p class="tel_con confirm_btn">
						<a :href="mobile" @click="proConfirm()">拨号</a>
					</p>
					
				</div>
			</div>
			<!--上下班不符合条件内容-->
			<div class="modal_content duty_cont" v-show="isDuty">
				<div class="text_dec" v-show="!upDuty">
					<p>{{modalTxt}}</p>
				</div>
				<div class="text_dec" v-show="upDuty&&dutyStatus!='11050'">
					<p>{{modalTxt}}</p>
				</div>
				<div class="text_dec" v-show="upDuty&&dutyStatus=='11050'">
					<p>您是   <span class="fca623">{{modalTxt}}</span> 最后一位事故专员</p>
					<p>无法下班，请先联系该城市</p>
					<p>其他同事上班</p>
				</div>
				<div class="alert_btn">
					<p class="confirm_btn">
						<a @click="btnAll()">我知道了</a>
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
	import vscroll from '../../../../component/VUEpullDownRefresh'
	import authSingObj from '../js/signature'
	export default{
		components: {
	        vscroll
	    },
		data () {
			return{
				msg:'',//弹窗内容
				isShow:false,//是否弹窗提示
				isModal:false,//蒙层
				isTel:false,//拨打电话内容
				isDuty:false,//上下班内容
				onDuty:false,
				upDuty:false,
				noduty:'o',//是否上班了
				dutyList:'',//人员列表
				telName:'',
				telNum:'',
				mobile:'',
				dutyOn:false,//默认进来以后为未上班状态
				dutyUp:false,
				dutyOnData:'',//点击上班后用户自己的状态
				selfData:'',
				selfImg:sessionStorage.getItem('avatar')||'',
				modalTxt:'',//弹窗提示内容
				selfName:'',
				iflimit:sessionStorage.getItem('on_duty'),
				ifoffDuty:sessionStorage.getItem('off_duty'),
				refreshing: false,
      			loading: false,
      			loaded:'',
      			lng:'',
      			lat:'',
      			dutyStatus:'',
      			initNo:false,
      			counter: 1, //当前页
	                pages: 10, // 一页显示多少条
	                pageStart: 0, // 开始页数
	                pageEnd: 0, // 结束页数
	                listdata: [], // 下拉更新数据存放数组
	                scrollData: {
	                    noFlag: false //暂无更多数据显示
	                },
			}
		},
		beforeCreate () {
			document.title = '事故管理';
			
		},
		created(){
			this.init();
		},
		mounted () {
			this.loaded= new Loading()//加载loading
			this.$el.querySelector('.load-more').remove();
			$('.offiUl').height($(window).height() - $('.offi_til').height());//解决html的height100%带来的scroll问题
			this.dutyData();
			if(this.iflimit!=1&&this.ifoffDuty!=1){
				this.$el.querySelector('.pull-refresh').style.top = '0px';
				this.$el.querySelector('.pull-refresh').style.display = 'none';}
			
		},
		methods:{
			init(){
				var url = window.location.href
				var newUrl = url.substr(0,url.indexOf(location.hash));
				var that = this;
				var sign_name = authSingObj.getSign(decodeURIComponent(newUrl));
				var data = sign_name.data;
			    var url = sign_name.url;
			    var nonceStr = sign_name.nonceStr;
			    var agentId = sign_name.agentId;
			    var timeStamp = sign_name.timeStamp;
			    var corpId = sign_name.corpId;
			    var access_token = sign_name.access_token;
			    var signature = sign_name.signature;
			    //钉钉授权接口
			    dd.config({
			        agentId: agentId, // 必填，微应用ID
			        corpId: corpId,//必填，企业ID
			        timeStamp: timeStamp, // 必填，生成签名的时间戳
			        nonceStr: nonceStr, // 必填，生成签名的随机串
			        signature: signature, // 必填，签名
			        type: '0',   //选填，0表示微应用的jsapi，1表示服务窗的jsapi，不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
			        jsApiList: ['runtime.info', 'biz.contact.choose',
			            'device.notification.confirm', 'device.notification.alert',
			            'device.notification.prompt', 'biz.ding.post','biz.util.uploadImageFromCamera','biz.util.uploadImage','biz.util.previewImage',
			            'biz.util.openLink', 'biz.user.get', 'device.geolocation.get', 'biz.navigation.setLeft','biz.util.datepicker','biz.util.scan'] // 必填，需要使用的jsapi列表，注意：不要带dd。
			    });
			    dd.error(function (error) {
					console.log('dd error: ' + JSON.stringify(error));
			 		alert("钉钉授权验证失败，请关闭页面重新打开")
				});
				
				dd.ready(function () {
				    //钉钉获取定位 钉钉浏览器内使用
				    dd.device.geolocation.get({
				        targetAccuracy: 200,
				        coordinate: 1,
				        withReGeocode: true,
				        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
				        onSuccess: function (result) {
				            sessionStorage.setItem('lng',result.longitude);
				            sessionStorage.setItem('lat',result.latitude);
				            that.dutyData();
						},
						onFail: function (err) {
					            console.log(err);
					        }
				    });
				});
			},
			dutyData(){//获取员工列表
				var param = {
						'city_id':sessionStorage.getItem('city_id')||'1,2',
						'mobile':sessionStorage.getItem('mobile')||'13521758602',
						'lng':sessionStorage.getItem('lng')||'116.29870',
						'lat':sessionStorage.getItem('lat')||'40.04426',
						//上测试后删除
					}
					var _this=this;
					myAjax.post(getApiUrl('/insure-duty/duty-list'), param, function (data) {
						_this.selfData = data.data;
						_this.dutyList = data.data.data;	
						var pullHeight = _this.$el.querySelector('.pull-refresh');
						if(data.status==0){
							_this.loaded.destroy();//清除loading
							_this.initNo=true;
							if(_this.iflimit!=1&&_this.ifoffDuty!=1){//处理绝对定位引起的页面遮挡
//								$(".offi_content").css({"margin-bottom":0,"margin-top":0})
								$(".dutyHei").css({"margin-bottom":0,"margin-top":0})
							}else{
								setTimeout(()=>{
									var offiHeight = $('.offi_til').height()
								     	pullHeight.style.height = offiHeight+'px'
									var btnHeight = $('.offi_footer').height();
									var topHei = $(".offi_til").height();
									$(".offi_content").css({"margin-bottom":btnHeight+7,"margin-top":topHei});
									$(".dutyHei").css({"margin-bottom":btnHeight+7});
									if(_this.iflimit!=1&&_this.ifoffDuty!=1){
										pullHeight.style.top = '0px'
										_this.$el.querySelector('.pull-refresh').style.display = 'none';}
										
								},80)
							}
							_this.selfName = _this.selfData.real_name.substring(_this.selfData.real_name.length-1)
							if(data.data.status==1){//当前为上班状态
								_this.dutyUp=true;
								_this.dutyOn=false;
								_this.noduty=false;
								pullHeight.style.top = '.15rem';
							}else{
								_this.dutyOn=true;
								_this.noduty=true;
								pullHeight.style.top = '0.08rem'
							}
							if(_this.iflimit!=1&&_this.ifoffDuty!=1){//当前为上班状态情况下，上下班又都无权限
								pullHeight.style.top = '0px'
								_this.$el.querySelector('.pull-refresh').style.display = 'none';
							}
							setTimeout(()=>{_this.refreshing=false;},2000)
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg;
					 		setTimeout(()=>{_this.isShow=false;},2000)
				 		}
					})
			},
			goTel(staffName,staffTel){//点击头像拨打电话
				this.isModal = true;
				this.isTel = true;
				$(".office").css("overflow","hidden");
				this.telName = staffName;
				this.telNum = staffTel;
				this.mobile = 'tel:'+this.telNum;
			},
			cancelBtn(){//取消按钮操作
				this.btnAll();
			},
			proConfirm(){//确认按钮
				this.btnAll();
			},
			btnAll(){//蒙层上按钮操作事件
				this.isModal=false;
				this.isTel = false;
				this.isDuty = false;
				$('.office').css({'overflow-y':'auto','overflow-x':'hidden'});
			},
			goDuty(){//上下班按钮
				var pullHeight = this.$el.querySelector('.pull-refresh');
				var _this = this;
				var param = {
					"mobile":sessionStorage.getItem('mobile')||'13521758602',
					'lng':sessionStorage.getItem('lng')||'116.29870',
					'lat':sessionStorage.getItem('lat')||'40.04426',
				}
				setTimeout(()=>{//处理绝对定位引起的页面遮挡
					var btnHeight = $('.offi_footer').height();
					var topHei = $(".offi_til").height();
					$(".dutyHei").css({"margin-bottom":btnHeight+7});
					$(".offi_content").css({"margin-bottom":btnHeight+7,"margin-top":topHei});
				},80)
				if(this.dutyOn){//点击我要上班
					myAjax.post(getApiUrl('/insure-duty/on-duty'), param, function (data) {
						_this.dutyOnData = data.data;
						_this.selfData = data.data;
						var name = _this.dutyOnData.city_name;
						if(data.status==0){
							//自己push到已上班列表
							$('.offi_content .mu-paper').scrollTop = 0;
//							for(var i=0;i<_this.dutyList.length;i++){
//								if(_this.dutyList[i].city_name == name){
//									var list = _this.dutyList[i].list
//									list.unshift(_this.dutyOnData)
//								}
//							}
							_this.selfName = _this.selfData.real_name.substring(_this.selfData.real_name.length-1)
							_this.dutyData();
							_this.noduty=false;
							_this.dutyOn = false;
							_this.dutyUp = true;
							_this.isShow = true;
					 		_this.msg = _this.selfData.city_name+'专员已上班';
					 		setTimeout(()=>{_this.isShow=false;},1500)
					 		setTimeout(()=>{//处理绝对定位引起的页面遮挡
								var btnHeight = $('.offi_footer').height();
								var topHei = $(".offi_til").height();
								$(".offi_content").css({"margin-bottom":btnHeight+7,"margin-top":topHei});
								$(".dutyHei").css({"margin-bottom":btnHeight+7});
					 			pullHeight.style.top = '.15rem'
					 		},80)
						}else{
							_this.isModal = true;
							_this.isDuty = true;
							_this.upDuty = false;
							_this.noduty=true;
							pullHeight.style.top = '.08rem'
							$(".office").css("overflow","hidden");
					 		_this.modalTxt = data.msg;
				 		}
					})
				}
				if(this.dutyUp){//点击我要下班
					myAjax.post(getApiUrl('/insure-duty/off-duty'), param, function (data) {
						_this.dutyStatus = data.status;
						if(data.status==0){
							_this.dutyData();
							_this.dutyOn = true;
							_this.dutyUp = false;
							_this.isShow = true;
					 		_this.msg = '已下班';
					 		setTimeout(()=>{_this.isShow=false;},1500)
						}else{
							_this.isModal = true;
							_this.isDuty = true;
							$(".office").css("overflow","hidden");
							_this.upDuty = true;
					 		_this.modalTxt = data.msg;
				 		}
					})
				}
			},
			onRefresh(done) {
				this.$el.querySelector('.pull-refresh').style.display = 'flex';
				setTimeout(()=>{
					if(this.iflimit!=1&&this.ifoffDuty!=1){
						this.$el.querySelector('.pull-refresh').style.display = 'none';
						this.$el.querySelector('.pull-refresh').style.top = '0';
					}
					this.dutyData();
				},100)
		      	this.refreshing = true;
		      	$('.office').scrollTop(0);
		        done();
		    },
		    onInfinite(done){
//		    	done.preventDefault();
		    	done()
		    }
		}
	}
	
	
</script>
<style>
</style>