<!--@xurr on 180612 车辆问题详情页面
	1、各渠道提交问题的总和（无数字）
	2、每列显示的顺序固定，上面没有内容时往上顶，横向上不飘动
	3、未选中时，按钮置灰
	4、增加全选功能，全选并点清楚部位问题后，该车的问题记录单整个删除；弹窗：全部清除后，将删除本问题记录单
	5、选中绿色后，需立即处理按钮高亮，同理选中红色后不需要立即处理按钮高亮；两种类型的问题全部选中后均不可点
	6、有选中状态时，清除问题按钮可点；并弹窗提示，弹窗内显示要删除的问题的个数和名称（最多9个，左右两列，多出的用“..."代替）
		全选状态下，弹窗内容为确认清除本车全部内容吗？
	7、清除确认后，删除列表内清除项;
-->
<template>
	<div class="carProDetail" ref='carProDetail'>
		<div class="out_warpper">
			<div class="carpro_header">
				<p class="carpro_card">
					<span class="fc33">{{listItem.plate_no}} </span>
					(<span class="fc99" v-show="listItem.vin">{{listItem.vin.substring(0, 11)}}</span>
					<span class="fc33" v-show="listItem.vin">{{listItem.vin.substring(11, 17)}}</span>)
				</p>
				<p class="carsAdd"> 
					<span>{{ carsData.status_name }}</span>
					<span>约续航 {{ carsData.remain}} 公里</span>
					<span>
						{{carsData.brand_name}}{{ carsData.model_name }}
					</span>
				</p>
				<div class="carpro_date">
					<p>
						<span>上传时间：</span><span>{{listItem.update_time||updaDate}}</span>
					</p>
					<p class="car_history" @click="goHandle()">
						<span>操作历史 </span>
						<span class="icon_history">
							<img src="../images/icon_right66.png" alt="" />
						</span>
					</p>
				</div>
			</div>
			<div class="carpro_content">
				<div class="carcon_header">
					<p class="fc66">
						<span class="car_red">
							红色：
						</span>
						<span>
							需要立即处理
						</span>
					</p>
					<p class="fc66">
						<span class="car_green">
							绿色：
						</span>
						<span>
							不需要立即处理
						</span>
					</p>
				</div>
				<div class="carpro_items">
					<div class="carpro_outer" v-show="outData.length>0">
						<p class="check_title">
							<span class="line"></span>
							<span>外观有伤部位</span>
							<span class="line"></span>
						</p>
						<div class="carout_cont" >
							<div class="prout_left">
								<p v-for="(left,index) in type_left" class="check_items isColor">
									<label :class="left.broken_level==1?'car_red':'car_green'" class="label_check">
										<input @click="isallCheck('left'+index,left.broken_level,left.part_id)" :data-i='left.part_id' :class="'leve'+left.broken_level" class="left_item ischeck" type="checkbox" :id="'left'+index" :value="left.part_name"/>
										{{ left.part_name }}</label>
								</p>
							</div>
							<div class="prout_center">
								<p  v-for="(center,index) in type_center" class="check_items isColor">
									<label :class="center.broken_level==1?'car_red':'car_green'" class="label_check">
									<input :class="'leve'+center.broken_level" @click="isallCheck('center'+index,center.broken_level,center.part_id)" :data-i='center.part_id' class="center_item ischeck" type="checkbox" :id="'center'+index" :value="center.part_name"/>
									{{ center.part_name }}</label>
								</p>
							</div>
							<div class="prout_right">
								<p  v-for="(right,index) in type_right" class="check_items isColor">
									<label :class="right.broken_level==1?'car_red':'car_green'" class="label_check">
									<input :class="'leve'+right.broken_level" @click="isallCheck('right'+index,right.broken_level,right.part_id)" :data-i='right.part_id' class="right_item ischeck" type="checkbox" :id="'right'+index" :value="right.part_name"/>
									{{ right.part_name }}</label>
								</p>
							</div>
						</div>
						
					</div>
					<div class="carpro_other" v-show="otherData.length>0">
						<p class="check_title">
							<span class="line"></span>
							<span>其他问题</span>
							<span class="line"></span>
						</p>
						<div class="carother_cont">
							<p class="other_items isColor" v-for="(other,index) in otherData">
								<label  :class="other.broken_level==1?'car_red':'car_green'" class="label_check">
								<input :class="'leve'+other.broken_level" @click="isallCheck('other'+index,other.broken_level,other.part_id)" :data-i='other.part_id'  class="other_item ischeck" type="checkbox" :id="'other'+index" :value="other.part_name"/>
								{{ other.part_name }}</label>
							</p>
						</div>
					</div>
					<div class="carpro_inner" v-show="innerData.length>0">
						<p class="check_title">
							<span class="line"></span>
							<span>内饰问题</span>
							<span class="line"></span>
						</p>
						<div class="carinner_cont">
							<p class="inner_items isColor" v-for="(inner,index) in innerData">
								<label  :class="inner.broken_level==1?'car_red':'car_green'" class="label_check">
								<input :class="'leve'+inner.broken_level" @click="isallCheck('inner'+index,inner.broken_level,inner.part_id)" :data-i='inner.part_id' class="inner_item ischeck" type="checkbox" :id="'inner'+index" :value="inner.part_name"/>
								{{ inner.part_name }}</label>
							</p>
						</div>
					</div>
					<div class="carcheck_all">
						<input @click="isAll()" class="check_input" name="check_false" type="radio" value="cheliang"/><label>全选</label> 
					</div>
					<div class="solve_btn">
						<p class="immed_btn noim" @click="doNot()">不需要立即处理</p>
						<p class="immed_btn isim" @click="doImmit()">需要立即处理</p>
					</div>
				</div>
				<div class="gohistory fc66" @click="goHisPic()">
					<span>查看历史验车单</span>
					<span class="icon_history">
						<img src="../images/icon_right66.png" alt="" />
					</span>
				</div>
			</div>
		</div>
		<div class="carpro_footer fc33">
			<div class="footer_btn clearn_btn" @click="clearnFun()">
				清除问题部位
			</div>
			<div class="footer_btn build_btn" @click="goCreate()">
				创建故障工单
			</div>
		</div>
		<div class="check_modal" v-show="clearModal">
			<div :class="!allcheck?'clearModal':'modal_content'">
				<p class="modal_title">{{ clearTitle }}</p>
				<div class="text_dec">
					{{ clearCont }}
					<span v-for="(arr_item,index) in checkedArr" v-if="!allcheck" :class="!allcheck&&checkedArr.length>5?'clear_dec':'text_decs'">
						{{ arr_item }}
					</span>
				</div>
				<div :class="!allcheck?'clealert_btn':'alert_btn'">
					<p class="cancel_btn" @click="clearBtn()">
						<a>取消</a>
					</p>
					<p class="confirm_btn" @click="confirBtn()">
						<a>确认</a>
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
	export default{
		data () {
			return{
				//数据
				type_left:[],//左边数据
				type_center:[],//中间数据
				type_right:[],//右边数据
				innerData:[],//内部问题数据
				otherData:[],//其他问题数据
				typeData:[],//出参
				ischeckAll:false,//是否全选了
				checkNum:'',//选中数量
				allcheck:false,//全部选中
				clearNum:'',//清除数量
				clearCont:'',//清除弹窗标题
				clearTitle:'',//根据清除
				clearModal:false,//是否弹窗
				checkedArr:[],//处理弹窗内数据展示
				cleData:[],//弹窗数据展示内容
				listItem:JSON.parse(sessionStorage.getItem('listItem'))||JSON.parse(sessionStorage.getItem('resultData')),//获取缓存数据
				carId:sessionStorage.getItem('car_id'),
				outData:[],//外观问题
				level:[],//问题紧急类型
				lone:0,//初始化紧急度
				ltwo:0,//初始化紧急度
				immit:false,//判断当前情况
				notImmit:false,//判断当前情况
				partId:[],//受伤部位的id
				msg:'',//弹层提示内容
				isShow:false,//是否弹层
				updaDate:'',//最后上传时间
				carsData:'',
				clearnBtn:false,
				
			}
		},
		beforeCreate () {
			document.title = '车辆问题详情';
		},
		destroyed(){
			$('html').height('100%');
			this.loaded.destroy()//清除loading
		},
		mounted () {
			this.init();
			this.loaded= new Loading()//加载loading
			var that = this;
			setTimeout(()=>{
				var btnHeight;
				var cliheight = that.$refs.carProDetail.offsetHeight;
				console.log(cliheight)
				$('.out_warpper').height($(window).height()-$('.carpro_footer').height());
				$(".gohistory").css("margin-bottom",'.39rem');
			},500)
		},
		methods:{
			init(){
				dd.ready(function () {
					dd.biz.navigation.setTitle({
					    title : '车辆问题详情',//控制标题文本，空字符串表示显示默认文本
					    onSuccess : function(result) {
					        
					    },
					    onFail : function(err) {}
					});
				})
				var param = {
					mobile:sessionStorage.getItem('mobile'),
					'car_id' : this.listItem.car_id||this.carId
				}
				var _this = this;
				myAjax.post(getApiUrl('/vehicle-problem/problem-detail'), param, function (data) {
					if(data.status==0){
						_this.loaded.destroy()//清除loading
						_this.typeData =[];
						_this.carsData =[];
				 		_this.outData = [];
				 		_this.innerData = [];
				 		_this.otherData = [];
				 		_this.type_left = [];
						_this.type_right = [];
						_this.type_center = [];
				 		_this.typeData = data.data.parts;
				 		_this.carsData = data.data.car;
						for(var i=0;i<_this.typeData.length;i++){//循环后分别分开类型
							var type = _this.typeData[i].type
							if(type==1){
								_this.outData.push(_this.typeData[i])
							}else if(type == 2) {
								_this.innerData.push(_this.typeData[i])
							}else if(type == 3){
								_this.otherData.push(_this.typeData[i])
							}
						}
		            	for(var j=0;j<_this.outData.length;j++){//循环外部问题后分为左中右
		            		var positions = _this.outData[j].position;
		            		if(positions==1){
								_this.type_left.push(_this.outData[j])
							}else if(positions == 2) {
								_this.type_center.push(_this.outData[j])
							}else if(positions == 3){
								_this.type_right.push(_this.outData[j])
							}
		            	}
						_this.updaDate = data.data.update_time;
						//向缓存数据listItem内添加数据
						_this.listItem.update_time=_this.updaDate;
						_this.listItem.biz_type=_this.carsData.biz_type;
						_this.listItem.branch_name=_this.carsData.branch_name;
						_this.listItem.brand_name=_this.carsData.brand_name;
						_this.listItem.model_name=_this.carsData.model_name;
						_this.listItem.remain=_this.carsData.remain;
						_this.listItem.status_name=_this.carsData.status_name;
						sessionStorage.setItem('listItem',JSON.stringify(_this.listItem));
					}else{
				 		_this.isShow = true;
				 		_this.msg = data.msg;
				 		setTimeout(()=>{_this.isShow=false;},2000)
				 	}
				})
			},
			isAll(){//全选
				var checkAll = $('.check_input');
				var checktrue = $('.ischeck');
				this.checkNum++;
				var even = this.checkNum%2;
				if(even==0){
					if(checktrue.is(":checked"))checktrue.prop('checked',false);
					checkAll.prop('checked',false);//全选按钮为未选中
					this.allcheck=false;//取消全选
					this.clearModal = false;//弹层不能出现
					//点击全选按钮时，恢复所有默认值
					this.checkedArr=[];
					this.partId = [];
					this.level = [];
					this.lone = 0;
					this.ltwo = 0;
					this.immit=false;
					this.notImmit=false;
					this.clearNum = 0;
					$('.noim').removeClass('not_immed');
					$('.isim').removeClass('immed');
				}else{
					checkAll.prop('checked',true);
					checktrue.prop('checked',true);
					var ischecka = $("[type='checkbox']:checked");
		         	this.clearNum = ischecka.length;
		         	this.allcheck=true;
		         	var  _this=this ;
		         	//把所有的复选框的值添加到数组内
		         	ischecka.each(function(){
		         		_this.checkedArr.push($(this).val());
		         		_this.partId.push($(this).data('i'));
		         	})
		         	var reds = $('.isColor').find('.car_red');
		         	var greens = $('.isColor').find('.car_green');
		         	if(reds.length==this.typeData.length){
						this.notImmit=true; 
						this.immit=false;
						$('.noim').addClass('not_immed');
						$('.isim').removeClass('immed');
					}else if(greens.length==this.typeData.length){
						this.immit=true;
						this.notImmit=false;
						$('.noim').removeClass('not_immed');
			         	$('.isim').addClass('immed');
					}else{
						this.immit=false;
						this.notImmit=false;
						$('.noim').removeClass('not_immed');
						$('.isim').removeClass('immed');
					}
				}
			},
			isallCheck(checkId,isOne,partId){//反选
				var checkAll = $('.check_input');
				var istrue = $('#'+checkId).is(":checked");
				if(!istrue){
					checkAll.prop('checked',false);
					this.allcheck=false;
				/**↓↓↓↓↓↓以下为当前已经全选以后再逐个取消的情况下执行↓↓↓↓↓↓***/
					var ischecka = $("[type='checkbox']:checked");
		         	var  _this=this ;
		         	_this.partId = [];
		         	_this.checkedArr = [];
		         	//把所有的复选框的值添加到数组内
		         	ischecka.each(function(){
		         		_this.checkedArr.push($(this).val());
		         		_this.partId.push($(this).data('i'));
		         	})
		        /**↑↑↑↑↑↑以上为当前已经全选以后再逐个取消的情况下执行↑↑↑↑↑↑***/
					var arrIndex = this.checkedArr.indexOf($('#'+checkId).val());
					if(arrIndex!=-1)this.checkedArr.splice(arrIndex,1);
					var islev = this.level.indexOf(isOne);
					this.level.splice(islev,1);
					isOne==1?this.lone--:this.ltwo--;
					//选中部位Id或反选取消时的部位Id
					var ispart = this.partId.indexOf(partId);
					if(ispart!=-1)this.partId.splice(ispart,1);
				}else{
					this.checkedArr.push($('#'+checkId).val());
					this.level.push(isOne);
			         isOne==1?this.lone++:this.ltwo++;
					this.partId.push(partId);
				}
				//对按钮颜色及是否可点击做处理
				if(this.level.length!=0){
					if(this.lone==this.level.length){
						this.notImmit=true; 
						this.immit=false;
						$('.noim').addClass('not_immed');
						$('.isim').removeClass('immed');
					}else if(this.ltwo==this.level.length){
						this.immit=true;
						this.notImmit=false;
						$('.noim').removeClass('not_immed');
			         	$('.isim').addClass('immed');
					}else{
						this.immit=false;
						this.notImmit=false;
						$('.noim').removeClass('not_immed');
						$('.isim').removeClass('immed');
					}
				}else{
					//如果当前全选后反选时，执行以下代码
					var reds = $('.isColor').find('.car_red');
		         	var greens = $('.isColor').find('.car_green');
		         	var redCheck = $(".car_red input[type='checkbox']:checked");
		         	var greenCheck = $(".car_green input[type='checkbox']:checked");
		         	if(greenCheck.length==0&&redCheck.length!=0){//如果当前全选后反选时
		         		this.checkNum = 0;
						this.notImmit=true; 
						this.immit=false;
						this.lone = 0;
						$('.noim').addClass('not_immed');
						$('.isim').removeClass('immed');
					}else if(redCheck.length==0&&greenCheck.length!=0){
						this.checkNum = 0;
						this.immit=true;
						this.notImmit=false;
						this.allcheck=false;
						this.ltwo = 0;
						$('.noim').removeClass('not_immed');
			         	$('.isim').addClass('immed');
					}else if(redCheck.length==0&&greenCheck.length==0){
						this.checkNum = 0;
						this.immit=false;
						this.notImmit=false;
						this.lone = 0;
						this.ltwo = 0;
						$('.noim').removeClass('not_immed');
						$('.isim').removeClass('immed');
					}
				}
				 var checkArry = $(".ischeck");
		         var ischecka = $("[type='checkbox']:checked");
		         this.clearNum = ischecka.length;
		         if(checkArry.length == ischecka.length){
		         	checkAll.prop('checked',true);this.allcheck=true;
		         }else this.allcheck=false;
			},
			clearnFun(){//清除按钮控制弹层
				this.clearnBtn = true;
				this.clearNum = this.checkedArr.length
				if(this.clearNum>0){
					if(this.allcheck){
						this.clearTitle = "确认清除本车全部问题吗?"
						this.clearCont = "全部清除后，将删除本车辆问题记录单"
					}else{
						if(this.clearNum>9){
				         	this.checkedArr = this.checkedArr.slice(0,9);
				         	this.checkedArr.push('...')
				         }else{
				         	this.checkedArr;
				         }
				         this.clearCont = ""
						this.clearTitle = "确认清除以下"+this.clearNum+"项问题?";
					}
					this.clearModal = true;
				}
			},
			clearBtn(){//取消弹层
				this.clearModal = false;
			},
			confirBtn(){//确认按钮
				var parts = this.partId.join(',')
				var param = {
						'car_id':this.listItem.car_id||this.carId,
						'car_parts':parts,
						'mobile':sessionStorage.getItem('mobile')||'13521758602'//上测试后删除
					}
					var _this=this;
					myAjax.post(getApiUrl('/vehicle-problem/deal-problem'), param, function (data) {
						if(data.status==0){
							if(_this.allcheck){
								window.location.href = "proOrder.html#/proDetails"
							}else{
								window.location.reload();
							}
							_this.clearModal = false;
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg;
					 		setTimeout(()=>{_this.isShow=false;},2000)
				 		}
					})
			},
			doImmit(){//点击需立即处理或者点击不需立即处理
				var parts = this.partId.join(',')
				if(this.immit){
					var level;
						level=1;
					var param = {
						'car_id':this.listItem.car_id||this.carId,
						'car_parts':parts,
						'level':level,
						'mobile':sessionStorage.getItem('mobile')||'13521758602'//上测试后删除
					}
					var _this=this;
					myAjax.post(getApiUrl('/vehicle-problem/change-level'), param, function (data) {
						if(data.status==0){
							//成功以后重新请求当前状态,所有状态置为初始状态
							_this.outData = [];
							_this.type_left = [];
							_this.type_right = [];
							_this.type_center = [];
							_this.innerData = [];
							_this.otherData = [];
							_this.checkedArr=[];
							_this.partId = [];
							_this.level = [];
							_this.lone = 0;
							_this.ltwo = 0;
							_this.init();
							_this.immit=false;
							_this.notImmit=false;
							$('.check_input').prop('checked',false);
							$('.noim').removeClass('not_immed');
							$('.isim').removeClass('immed');
							_this.clearModal = false;
							_this.clearNum = 0;
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg;
					 		setTimeout(()=>{_this.isShow=false;},2000)
				 		}
					})
				}
			},
			doNot(){
				var parts = this.partId.join(',')
				if(this.notImmit){
					var level;
						level=0;
					var param = {
						'car_id':this.listItem.car_id||this.carId,
						'car_parts':parts,
						'level':level,
						'mobile':sessionStorage.getItem('mobile')||'13521758602'//上测试后删除
					}
					var _this=this;
					myAjax.post(getApiUrl('/vehicle-problem/change-level'), param, function (data) {
						if(data.status==0){
							//成功以后重新请求当前状态,所有状态置为初始状态
							_this.outData = [];
							_this.type_left = [];
							_this.type_right = [];
							_this.type_center = [];
							_this.innerData = [];
							_this.otherData = [];
							_this.checkedArr=[];
							_this.partId = [];
							_this.level = [];
							_this.lone = 0;
							_this.ltwo = 0;
							_this.init();
							_this.immit=false;
							_this.notImmit=false;
							$('.check_input').prop('checked',false);
							$('.noim').removeClass('not_immed');
							$('.isim').removeClass('immed');
							_this.clearModal = false;
							_this.clearNum = 0;
						}else{
					 		_this.isShow = true;
					 		_this.msg = data.msg;
					 		setTimeout(()=>{_this.isShow=false;},2000)
				 		}
					})
				}
			},
			goHandle(){//操作历史
				window.location.href = "proOrder.html#/handleHistory"
			},
			goHisPic(){//去历史记录
				window.location.href = "proOrder.html#/pictureHis";
			},
			goCreate(){//去创建新的故障工单
				window.location.href = "proOrder.html#/createOrder";
			}
			
			
		}
	}
</script>

<style>
</style>