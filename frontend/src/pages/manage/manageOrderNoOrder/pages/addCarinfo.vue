<!--
	作者：xurui_518@163.com
	时间：2019-01-10
	描述：追车信息录入
		
-->
<template>
	<div class="status_text" v-if="!dataReady&&enter=='check'">
            	加载中，请稍后...
    </div>
	<div class="addCarinfo" v-else>
			<div class="truck_type">
				<p class="reason_title">
					{{enter=='end'||enter=='check'?'追车结果：':'选择追车结果：'}}
				</p>
	    		<div class="check_con">
	    			<p class="sort_item" 
						:id="'sort'+sortItem.sortType" 
						v-for="(sortItem,index) in sorts"
						:key = 'index'
						@click="sortCheck(sortItem.sortType,$event,1)">
						<span class="sort_icon" v-if="sort_type==sortItem.sortType">
							<img src="../images/icon_duigou.png" alt="" />
						</span>
						<i class="icon_no" v-else></i>
						<span  class="sort_own" :class="sort_type==sortItem.sortType?'is_sort':'no_sort'">{{sortItem.sortCont}}</span>
					</p>
	    			
	    		</div>
			</div>
			<div class="fee_list">
				<p>
					<span class="left_txt">
						丢车网点：
					</span>
					<span>{{enter!=1?listItem.begin_branch:mapBranch}}</span>
				</p>
			</div>
			<div class="fee_list">
				<p>
					<span class="left_txt">
						追到车时车辆所在位置：
					</span>
					<span v-if="enter==1" class="center_txt fc33">
						{{finishData.name}}
					</span>
					<span v-else class="center_txt" :class="mapData?'fc33':'fc99'" @click="goMap">
						{{mapData?'已选择':'请选择车辆位置'}}
					</span>
				</p>
				<p v-if="mapData&&enter!=1" @click="goMap(1)">
					<span class="fc4a90">查看</span>
					<span :class="mapData?'check_icon':'fee_icon'"></span>
				</p>
				
			</div>
			<div class="fee_list car_peo" v-show="sort_type==1">
				<p>
					<span class="left_txt">
						盗开人手机号：
					</span>
					<span v-if="enter==1">{{phone}}</span>
					<input v-else maxlength="11"  type="number" name="phone" v-model='phone' placeholder="请输入盗开人手机号" @input.trim="keyupall($event)" @blur="keyupall($event)"/>
				</p>
				<span class="member" :class="ismember==-1?'not_member':'is_member'" v-show="ismember!=0">
					{{ismember == -1?'非会员':'会员'}}
				</span>
			</div>
			<div class="isMem" v-show="ismember>0">
				<p class="reason_title">
					是否是会员本人：
				</p>
	    		<div class="check_con">
	    			<p class="sort_item" 
						:id="'member'+sortItem.ismember" 
						v-for="(sortItem,index) in memType"
						:key = 'index'
						@click="sortCheck(sortItem.ismember,$event,3)">
						<span class="sort_icon" v-if="selfMem==sortItem.ismember">
							<img src="../images/icon_duigou.png" alt="" />
						</span>
						<i class="icon_no" v-else></i>
						<span  class="sort_own" :class="selfMem==sortItem.ismember?'is_sort':'no_sort'">{{sortItem.memcon}}</span>
						
					</p>
	    		</div>
			</div>
			<div class="isContinue" v-show="selfMem==1&&ismember!=0">
				<p class="reason_title">
					用户是否继续用车：
				</p>
	    		<div class="check_con">
	    			<p class="sort_item" 
						:id="'continue'+sortItem.is_not" 
						v-for="(sortItem,index) in continueCon"
						:key = 'index'
						@click="sortCheck(sortItem.is_not,$event,4)">
						<span class="sort_icon" v-if="continueUse==sortItem.is_not">
							<img src="../images/icon_duigou.png" alt="" />
						</span>
						<i class="icon_no" v-else></i>
						<span v-if="enter==1" class="sort_own">{{sortItem.iscon}}</span>
						<span v-else class="sort_own fc33">{{sortItem.iscon}}</span>
						
					</p>
	    		</div>
			</div>
			<div class="robber_info" v-if="ismember!=0||sort_type==2">
				<div class="fee_list">
					<p>
						<span class="left_txt">
							盗开里程：
						</span>
						<span >
							{{enter==1?finishData.catch_km:catch_km}}公里
						</span>
					</p>
				</div>
				<div class="fee_list">
					<p>
						<span class="left_txt">
							盗开时长：
						</span>
						<span >
							{{enter==1?finishData.catch_time:catch_time}}
						</span>
					</p>
				</div>
				<div class="feeType" v-show="enter==1&&feeInfo||enter!=1&&ismember==-1||enter!=1&&ismember>0&&continueUse==2||enter!=1&&selfMem==2">
					<p class="reason_title">
						收费方式：
					</p>
		    		<div class="check_con">
		    			<p class="sort_item" 
							:id="'feeInfo'+sortItem.infoType" 
							v-for="(sortItem,index) in fees"
							:key = 'index'
							@click="sortCheck(sortItem.infoType,$event,2)">
							<span class="sort_icon" v-if="feeInfo==sortItem.infoType">
								<img src="../images/icon_duigou.png" alt="" />
							</span>
							<i class="icon_no" v-else></i>
							<span class="sort_own" :class="feeInfo==sortItem.infoType?'is_sort':'no_sort'">{{sortItem.infoCont}}</span>
						</p>
		    		</div>
				</div>
				<div class="fee_list" v-show="continueUse!=1&&feeInfo==1||continueUse!=1&&feeInfo==3">
					<p>
						<span class="left_txt">
							收费金额：
						</span>
						<span v-if="enter==1">{{finishData.fee_num}}</span>
						<input v-else type="number" name="feeNum" v-model='feeNum' placeholder="请输入收费金额" @input.trim="feeInput($event)" @blur="feeInput($event)"/>
					</p>
				</div>
			</div>
			<div class="truck_photo">
				<p class="truck_title">请拍摄照片：</p>
				<div class="car_photo" v-for="(item,index) in finish_img">
					<img  @click="checkPhone(index)" 
						class="truck_img" 
						v-if="enter=='1'" 
						:src="item"
						alt="" 
					/>
					<span>
						{{index==0?'车辆正前方照片':'车辆正后方照片'}}
					</span>
				</div>
				<photo 
					v-if="enter!='1'"
					:allPhoto='allPhoto'
					ref='photo'
					@photoArray = 'photoArray'
					>
				</photo>
			</div>
			<div class="note">
	        	<p>备注：</p>
				<textarea class="creat_input fc66" v-model="feeNote" id="textarea" @input="noteTxt()" placeholder="请填写备注信息，200字以内（必填）" name="" maxlength ="200"></textarea>
			</div>
			<!--四大条件（追车结果，位置，图片，备注）满足后，
				1、仅追到车；
				2、追到人是会员，手机号，是本人，继续用车，
				3、追到人是会员，手机号，是本人，不继续用车，收费方式
				4、追到人是会员，手机号，是本人，不继续用车，收费方式线下收费或自助缴费，金额
				5、追到人是会员，手机号，不是本人，收费方式
				6、追到人是会员，手机号，不是本人，收费方式线下收费或自助缴费，金额
				7、追到人不是会员，手机号，收费方式，
				8、追到人不是会员，手机号，收费方式线下收费，金额
			-->
        <div class="creat_btn" @click="createSub(1)" v-show="enter!='1'" v-if="sort_type==2&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember==-1&&feeInfo==1&&feeNum&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember==-1&&feeInfo==2&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember>0&&selfMem==1&&continueUse==1&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember>0&&selfMem==1&&continueUse==2&&feeInfo!=2&&feeNum&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember>0&&selfMem==1&&continueUse==2&&feeInfo==2&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember>0&&selfMem==2&&feeInfo==2&&mapData&&length>0&&feeNote&&feeNote.length>0
        	||sort_type==1&&ismember>0&&selfMem==2&&feeInfo==1&&feeNum&&mapData&&length>0&&feeNote&&feeNote.length>0">
			<p class="crea_submit subf33">提交</p>
        </div>
        <div class="creat_btn" @click="createSub(2)" v-show="enter!='1'" v-else>
			<p class="crea_submit subfc8" >提交</p>
        </div>
	</div>
</template>
<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  	import {Select} from '../../../../component/Select/index'
  	import {goAjax} from '../js/ajaxCommon.js'
  	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	import photo from '../component/photo' 
	import deleteAlert from '../component/delete'
	
	export default{
		name:'addCarinfo',
		components: {
	      photo,
	      deleteAlert
	    },
		data(){
			return{
				fee_status:'',
				filterData:[],
			    resetAll:false,//是否重置
			    modal:false,
			    checkData:[],
			    checkId:[],
			    endData:'',
			    finishData:'',
			    enter:this.$route.query.enter,
				dataReady:false,
				imageArray:[],
				length:'',
				allPhoto:[{'title':'车辆正前方照片','top':false},{'title':'车辆正后方照片','top':false},],
				charge_branch:this.$route.query.branch_name||'',
				charge_id:this.$route.query.branch_id||'',
				chargeData:[],//充电桩公司
				pageModal:false,
				 modal_txt:'',
				 isCharge:false,//删除
				 subType:'',
				 sort_show:false,
		        sorts:[
					{"sortCont":"追到车及盗开人",'sortType':'1'},
					{"sortCont":"仅追到车",'sortType':'2'},
				],
				sort_type:'',
				feeNote:'',
				phone:'',
				feeType:'',//追车人结果
				feeInfo:'',//收费信息
				fees:[
					{"infoCont":"线下收费",'infoType':'1'},
					{"infoCont":"拒绝缴费",'infoType':'2'},
				],
				feeNum:'',
				memType:[//是否是会员本人
					{"memcon":"是",'ismember':'1'},
					{"memcon":"否",'ismember':'2'},
				],
				selfMem:'',
				continueCon:[//是否继续用车
					{"iscon":"是",'is_not':'1'},
					{"iscon":"否",'is_not':'2'},
				],
				continueUse:'',
				ismember:'0',//0 未填写，-1非会员 ，其余值为会员id值
				listItem:JSON.parse(sessionStorage.getItem('lastData')),//默认信息
				mapData:JSON.parse(sessionStorage.getItem('mapData'))||'',//地图选择信息
				mapBranch:'',
				finish_img:[],
				catch_km:sessionStorage.getItem('catch_km')||'',//盗开里程
				catch_time:sessionStorage.getItem('catch_time')||'',//盗开时间
				
			}
		},
		beforeCreate () {
		},
		created(){
			if(this.enter=='1'){
				var url = '/vehicle-abnormal/item-result';
				var param = {
					mobile:userData.state.mobile,
					order_id:this.$route.query.order_id,
				    item_id:'1'
				}
				this.checkInfo(url,param).then(res=>{
					if(res.length!=0){
						this.finishData = res;
				     	this.sort_type = res.catch_type;
				     	this.mapBranch = res.catch_branch;
				     	this.phone = res.telephone;
				     	this.ismember = res.is_member==1?'1':'-1';
				     	this.selfMem = res.is_self;
				     	this.continueUse = res.is_continue;
				     	this.feeInfo = res.fee_type;
				     	if(this.selfMem==1){
							this.fees = [
								{"infoCont":"创建自助缴费单收费",'infoType':'3'},
								{"infoCont":"线下收费",'infoType':'1'},
								{"infoCont":"拒绝缴费",'infoType':'2'},
							];
						}
				     	this.feeNote=res.remark;
				     	$('#textarea').attr("disabled","disabled");
				     	this.finish_img = res.photo_string.split(',')
			   		}
				}).catch(this.handleError);
			}
			
		},
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		mounted () {
			$('html').css('height','100%');
			$('body').css('height','100%');
			$('body').css('background','#F6F6F6');
			//去地图后返回信息
			this.sort_type = sessionStorage.getItem('feeType')||this.sort_type;
			this.imageArray = JSON.parse(sessionStorage.getItem('imageArray'))||this.imageArray;
			this.feeNote = this.feeNote||sessionStorage.getItem('feeNote');
		},
		methods: {
			checkInfo(url,param){//查看
				return myAjax.post(getOspApiUrl(url), param).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
			},
	        photoArray(){
				this.imageArray = this.$refs.photo.imageArray;
				this.length = this.$refs.photo.length;
			},
			cancelOrder(){
	    		this.pageModal = false;
	    		this.isCharge = false;
	    	},
	        createSub(num){
	        	//清除缓存
	        	if(num==1){
		        	var param = {
							mobile:userData.state.mobile||sessionStorage.getItem('mobile')||'13521758602',
						    order_id:this.$route.query.order_id,
						    item_id:1,
						    params:{
						    	catch_type:this.sort_type,
						    	telephone:this.phone,
						    	is_member:this.ismember==-1?'2':this.ismember>0?'1':'',//是否是会员
						    	is_self:this.selfMem,//是否是会员本人
						    	uid:this.ismember>0?this.ismember:'',//会员id
						    	is_continue:this.continueUse,//是否继续用车
						    	fee_type:this.feeInfo,//收费类型
						    	fee_num:this.feeNum,//收费金额
						    	remark:this.feeNote,
								photo_string:this.imageArray.join(','),
								name:this.mapData.name,//
								address:this.mapData.address,
								lat:this.mapData.lat,
								lng:this.mapData.lng,
								catch_time:this.catch_time,
								catch_km:this.catch_km,
								catch_branch:this.listItem.begin_branch
						    }
					};
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						this.$router.push({
							path:'/orderDetail',
							query:{
								order_id:this.$route.query.order_id,
							}
						})
						sessionStorage.setItem('continueUse',this.continueUse);
						//清楚页面缓存
						sessionStorage.removeItem('lastData');
						sessionStorage.removeItem('feeType');
			        	sessionStorage.removeItem('imageArray');
			        	sessionStorage.removeItem('feeNote');
			        	sessionStorage.removeItem('mapData');
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}
	        }, 
		    handleError(err){
		        if(err && err.msg){
		          this.$_LIKE_toast(err.msg)
		        }else{
		          console.log(err)
		        }
	      	},
	      	checkPhone(index){
				var that = this;
			    //图片浏览器
			    dd.previewImage({
			        urls: finish_img,//图片地址列表,数组
			        current:finish_img[index] //当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
			},
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			sortCheck(sortType,e,num){
				if(this.enter!='1'){
					if(num==1){
						this.phone = '';
						this.ismember = 0;
		      			this.selfMem = '';
		      			this.continueUse = '';  
		      			this.feeInfo = '';
		      			this.feeNum = '';
		      			this.fees = [
								{"infoCont":"线下收费",'infoType':'1'},
								{"infoCont":"拒绝缴费",'infoType':'2'},
							]
						this.sort_type=this.sort_type==sortType?'':sortType;
						myAjax.post(getOspApiUrl('/vehicle-abnormal/find'), {
							    order_id:this.$route.query.order_id,
							}).then(res => {
							  	if (res.status === 0) {
								  	this.catch_km = res.data.catch_km;
								  	this.catch_time = res.data.catch_time;
						      	}else{
						      		this.$_LIKE_toast(res.msg)
						      	}
							}).catch(err => {
							    console.log(err)
							})
					}else if(num==2){
						this.feeInfo=this.feeInfo==sortType?'':sortType;
					}else if(num==3){
						this.selfMem=this.selfMem==sortType?'':sortType;
						if(this.selfMem==1){
							this.fees = [
								{"infoCont":"创建自助缴费单收费",'infoType':'3'},
								{"infoCont":"线下收费",'infoType':'1'},
								{"infoCont":"拒绝缴费",'infoType':'2'},
							];
						}else{//如果为非会员重置已选状态值
							this.continueUse = '';
							this.feeInfo = '';
							this.fees = [
								{"infoCont":"线下收费",'infoType':'1'},
								{"infoCont":"拒绝缴费",'infoType':'2'},
							]}
					}else if(num==4){
						this.continueUse=this.continueUse==sortType?'':sortType;
					}
					
				}
	      	},
	      	keyupall(){//判断手机号是否正确，先判断是否已经选择车辆位置，如果没有选择，提示
	      		if(this.mapData){
		      		if(this.phone.length==11){
			      		if(!(/^1[34578]\d{9}$/.test(this.phone))){
					    	this.$_LIKE_toast('请输入正确的手机号')
					    }else{//调取接口获取是否为会员
					    	myAjax.post(getOspApiUrl('/vehicle-abnormal/member'), {
							    tel:this.phone,
							}).then(res => {
							  	if (res.status === 0) {
								  	this.ismember = res.data.uid;
						      	}else{
						      		this.$_LIKE_toast(res.msg)
						      	}
							}).catch(err => {
							    console.log(err)
							})
					    	
					    }
		      		}else if(!(/^[0-9]+\.?[0-9]*$/.test(this.phone))||this.phone.length>11){
		      			this.phone=this.phone.substring(0,11)
		      			this.$_LIKE_toast('请输入正确的手机号');
		      		}else if(this.phone.length<11){
		      			this.ismember = 0;
		      			this.selfMem = '';
		      			this.continueUse = '';  
		      			this.feeInfo = '';
		      			this.feeNum = '';
		      			this.fees = [
								{"infoCont":"线下收费",'infoType':'1'},
								{"infoCont":"拒绝缴费",'infoType':'2'},
							]
		      		}
		      	}else{
		      		this.phone = '';
		      		this.$_LIKE_toast('请先选择车辆位置');
		      	}
	      	},
	      	feeInput(){
	      		if(!(/^-?\d+\.?\d{0,1}$/.test(this.feeNum))){
	      			this.$_LIKE_toast('请输入大于等于0的数字')
	      		}
	      	},
	      	goMap(){
	        	window.location.href = 'index.html#/serviceMap?order_id='+this.$route.query.order_id+'&type=4&info=1';
	        	if(this.sort_type)sessionStorage.setItem('feeType',this.sort_type);
	        	if(this.imageArray)sessionStorage.setItem('imageArray',JSON.stringify(this.imageArray));
				if(this.feeNote)sessionStorage.setItem('feeNote',this.feeNote);
				if(this.catch_km)sessionStorage.setItem('catch_km',this.catch_km);
				if(this.catch_time)sessionStorage.setItem('catch_time',this.catch_time);
	      	},
		}
	}
</script>

<style scoped>
	*{
   	 box-sizing: border-box;
   	}
   	.status_text{
        color:#999;
        margin:1rem auto;
        text-align: center;
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
	.fc4a90{
		color: #4a90e2;
	}
	.subf33{
		background: #333333;
	}
	.subfc8{
		background: #c8c8c8;
	}
	.addCarinfo{
		background: #F6F6F6;
		padding-bottom: .68rem;
	}
	.fee_list{
		background: #fff;
	    height: .53rem;
	    padding: 0 .1rem;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    border-bottom: 1px solid #F6F6F6;
	}
	input{
		border: none;
		color: #999999;
		font-size: 14px;
		padding: 0;
		background: #FFFFFF;
	}
	input::-webkit-input-placeholder{
		color: #999999;
		font-size: 14px;
		padding: 0;
	}
	.left_txt{
		display: inline-block;
	}
	/*右箭头*/
	.fee_icon,.check_icon {
	    display :inline-block;
	    position: relative;
	    width: 20px;
	    height: 15px;
	}
	.fee_icon::after,.check_icon::after {
	    display: inline-block;
	    content: " ";
	    height: 10px;
	    width: 10px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #b4b4b4;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 0px;
	    margin-top: -5px;
	}
	.check_icon::after{
		border-color: #4a90e2;
	}
	.bgc8{
		background-color: #C8C8C8!important;
	}
	.not_icon{
		display: inline-block;
		width: .2rem;
		height: .2rem;
	}
	.not_icon img,.delete img{
		width: 100%;
		height: 100%;
	}
	.check_cont{
		padding: .1rem .21rem .1rem .24rem;
		background: #FFFFFF;
	}
	.delete{
		display: inline-block;
		width: .24rem;
		height: .24rem;
	}
	.check_left{
		flex: 1;
	}
	.check_center{
		width: .92rem;
		margin-left: .3rem;
		margin-right: .12rem;
	}
	.check_center input{
		width: 80%;
	}
	.creat_btn{
		width: 100%;
		height: 0.63rem;
		position: fixed;
		bottom: 0;
		background: #FFFFFF;
		display: -webkit-box;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		-webkit-justify-content: center;
		align-items: center;
		-webkit-align-items: center;
		-moz-box-shadow: 0px -3px 5px #e7e7e7;
	    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
	    box-shadow: 0px -3px 5px #e7e7e7;
	}
	.crea_submit{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
	}
	.check_center input{
		text-align: right;
	}
	.truck_photo{
		background: #FFFFFF;
  		padding: .17rem .17rem 0rem .14rem;
  		margin-top: .1rem;
  	}
  	.uploadIcon {
	    font-family: 'iconfont';
	    font-size: .32rem;
	}
	
	.end-photo{
	    display:inline-block;
	    position:absolute;
	    left: .34rem;
	    top: .3rem;
	    font-size: .19rem;
	    color: #333333;
	}
	
	.check-photo{
	    display:inline-block;
	    position:absolute;
	    left: .23rem;
	    top: .77rem;
	    color:#43aff7;
	}
	
	.swat-photo{
	    display:inline-block;
	    position:absolute;
	    left: .73rem;
	    top: .77rem;
	    color:#43aff7;
	}
	
	.getpicture-nextbtn {
	    position: fixed;
	    bottom: 0;
	    width: 100%;
	    padding: 5% 2.5%;
	}
	
	.getpicture-nextbtn button {
	    width: 95%;
	    line-height: .45rem;
	    font-size: 14px;
	    text-align: center;
	    color: #fff;
	    background: #d1d1d1;
	    outline: none;
	    border: none;
	    border-radius: 2px;
	    box-sizing: border-box;
	}
	.getpicture-nextbutton{
	    background:#333!important;
	}
	.addCarinfo /deep/ .getpicture-content{
		padding: 0;
		padding-left: .09rem;
		justify-content: flex-start;
		-webkit-justify-content: flex-start;
	}
	.addCarinfo /deep/ .getpicture-content>div>div{
		width: .88rem;
		height: .88rem;
	}
	.addCarinfo /deep/ .getpicture-content>div{
		margin: 0;
		margin-right: .25rem;
	}
	.addCarinfo /deep/ .uploadIcon{
		left: .28rem;
    	top: .28rem;
	}
	.addCarinfo /deep/ .end-photo {
	    left: .17rem;
	    top: .13rem;
	    font-size: .17rem;
	}
	.addCarinfo /deep/ .check-photo {
	    top: .5rem;
	    left: .08rem;
	}
	.addCarinfo /deep/ .swat-photo{
		top: .5rem;
		left:.54rem;
	}
	.truck_img{
		width: .87rem;
		height: .87rem;
		margin-bottom: .05rem;
	}
	.charge_branch{
		margin-bottom: .1rem;
	}
	.car_photo{
		display: inline-flex;
	    flex-direction: column;
	    justify-content: center;
		display: -webkit-inline-flex;
	   -webkit-flex-direction: column;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	    padding-bottom: .1rem;
	    padding-left: .1rem;
	}
	.truck_type,.feeType,.isMem,.isContinue{
  		padding: .19rem .1rem;
  		background: #FFFFFF;
  		display: flex;
  		align-items: center;
  		display: -webkit-flex;
  		-webkit-align-items: center;
  		border-bottom: 1px solid #F6F6F6;
  		margin-bottom: .1rem;
  	}
  	.feeType,.isMem,.isContinue{
  		align-items: flex-start;
  		-webkit-align-items: flex-start;
  		margin: 0;
  	}
  	.fee_radio{
  		display: inline-flex;
	    justify-content: center;
	    align-items: center;
  		display: -webkit-inline-flex;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
	    margin-right: .1rem;
  	}
  	.truck_title{
  		margin-bottom: .12rem;
  	}
  	.note{
		margin-top: .1rem;
		margin-bottom: .7rem;
		padding: .2rem .12rem .16rem .1rem;
		background: #FFFFFF;
	}
	#textarea{
		height: 0.83rem;
		border: 1px solid #c1c1c1;
		background: #F6F6F6;
		width: 100%;
		padding: .1rem;
	    box-sizing: border-box;
	    margin-top: .15rem;
	    box-shadow: none;
	    font-size: .14rem;
	}
	#textarea::-webkit-input-placeholder{
		font-size: .14rem;
	}
	.is_sort{
		color: #44a8ec;
	}
	.no_sort{
		color: #333333;
	}
	.sort_icon{
		display: inline-flex;
		width: .15rem;
		height: .15rem;
		margin-right: .07rem;
	}
	.sort_icon img{
		width: 100%;
		height: 100%;
	}
	.icon_no{
		display: inline-block;
		width: .15rem;
		height: .15rem;
		background: #FFFFFF;
		border: 1px solid #D8D8D8;
		border-radius: 50%;
		margin-right: .07rem;
	}
	.sort_item,.check_con{
		display: flex;
		align-items: center;
		display: -webkit-flex;
		-webkit-align-items: center;
	}
	.car_peo,.robber_info{
		margin-top: .1rem;
	}
	.check_con{
		flex-flow: wrap;
		-webkit-flex-flow: wrap;
	}
	.reason_title{
		flex: none;
		-webkit-flex: none;
	}
	.member{
		display: flex;
		width: .5rem;
		height: .21rem;
		text-align: center;
		border-radius: 2px;
		align-items: center;
		justify-content: center;
		display: -webkit-flex;
		-webkit-align-items: center;
		-webkit-justify-content: center;
	}
	.not_member{
		border: 1px solid #ff6868;
		color: #ff6868;
	}
	.is_member{
		border: 1px solid #6cdb63;
		color: #6cdb63;
	}
</style>