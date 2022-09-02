<!--
	作者：xurui_518@163.com
	时间：2018-12-13
	描述：费用信息录入
		
-->
<template>
	<div class="status_text" v-if="!dataReady&&enter=='check'">
            	加载中，请稍后...
    </div>
	<div class="chargeInfo" v-else>
			<div class="fee_list charge_branch">
				<p>
					<span class="left_txt">
						选择充电站：
					</span>
					<span class="center_txt" :class="charge_branch?'fc33':'fc99'" @click="choiceCharge()">
						{{charge_branch?charge_branch:'请选择充电站'}}
					</span>
				</p>
				<span class="fee_icon"></span>
			</div>
			<div class="truck_type">
	    		<p>充电方式：</p>
					<label class="fee_radio"><input class="radio1" @change="typeRadio(1)" checked="checked" type="radio" name="feeType" value="1"/>快充</label>
					<label class="fee_radio"><input class="radio2" @change="typeRadio(2)" type="radio" name="feeType" value="2"/>慢充</label>
	    	</div>
			<div class="fee_list" 
				v-for="(item,index) in listItem"
				:key = 'index'
			>
				<p>
					<span class="left_txt">
						{{item.name}}：
					</span>
					<span class="center_txt" :class="fee_status?'fc33':'fc99'" v-if='index==0' @click="choiceFee()">{{fee_status?fee_status:item.center}}</span>
					<span class="center_txt fc33" v-if='index!=0'>
						<input type="text" name="fee" @input="changeType(index)" :class="'fee'+index"  
							:v-model="'fee'+index" 
							:placeholder="item.center"/>
					</span>
				</p>
				<span :class="index==0?'fee_icon':'right_txt' ">{{item.right}}</span>
			</div>
			<div class="truck_photo">
				<img @click="checkPhone(index)" 
					class="truck_img" 
					v-if="enter=='1'" 
					:src="finishData"
					alt="" 
				/>
				<photo 
					v-if="enter!='1'"
					:allPhoto='allPhoto'
					ref='photo'
					@photoArray = 'photoArray'
					>
				</photo>
			</div>
        <div class="creat_btn" @click="isSub()" v-show="enter!='1'">
			<p class="crea_submit" :class="charge_id&&fee_id&&fee1&&fee2&&fee3&&length>0?'subf33':'subfc8'">提交</p>
		</div>
		<deleteAlert ref='dAlert' 
			:pageModal = 'pageModal'
			:modal_txt = 'modal_txt'
			:isCharge = 'isCharge'
			@subOrder = 'createSub()'
			@cancelOrder = 'cancelOrder()'
			
		>	
		
		</deleteAlert>
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
		name:'chargeInfo',
		components: {
	      photo,
	      deleteAlert
	    },
		data(){
			return{
				fee_status:'',
				fee_id:'',
				listItem:[
					{'name':'选择充电桩公司','center':'请选择','right':''},
					{'name':'电量','center':'请输入电量','right':'度'},
					{'name':'电费','center':'请输入电费','right':'元'},
					{'name':'服务费','center':'请输入服务费','right':'元'},
				],
				filterData:[],
			    resetAll:false,//是否重置
			    modal:false,
			    checkData:[],
			    checkId:[],
			    fee1:'',
			    fee2:'',
			    fee3:'',
			    detais:'',
			    endData:'',
			    finishData:'',
			    enter:this.$route.query.enter,
				dataReady:false,
				imageArray:[],
				length:'',
				allPhoto:[{'title':'充电费用照片','top':false},],
				charge_branch:this.$route.query.branch_name||'',
				charge_id:this.$route.query.branch_id||'',
				chargeData:[],//充电桩公司
				pageModal:false,
				 modal_txt:'',
				 isCharge:false,//删除
				 subType:'',
				
			}
		},
		beforeCreate () {
		},
		created(){
			if(this.enter=='1'){
				var url = '/vehicle-office/history-result';
				var param = {
					mobile:userData.state.mobile,
				    id:this.$route.query.his_id
				}
			
				this.checkInfo(url,param).then(res=>{
					if(res.length!=0){
				     	this.finishData = res.photo;
				     	this.fee1 = res.electricity;
				     	this.fee2 = res.fee;
				     	this.fee3 = res.service_fee;
		                this.fee_status = res.charging_hub_name;
		                this.charge_branch =  res.charge_branch_name;
				   		$('.fee1').val(res.electricity);
				   		$('.fee2').val(res.fee);
				   		$('.fee3').val(res.service_fee);
				   		$('.radio'+res.type).attr('checked','true')
				   		$('input').attr("disabled","disabled")
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
			if(this.enter!=1&&this.charge_id)this.chargeCom();
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
			chargeCom(){
				myAjax.post(getOspApiUrl('/vehicle-charging/hub-list'), {
	    			mobile:userData.state.mobile,
				    charging_branch:this.charge_id	
//				    charging_branch:'4'	
				}).then(res => {
				  	if (res.status === 0) {
				  		this.chargeData = res.data
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
			},
	    	
			choiceFee(){
				if(this.chargeData.length!==0&&this.enter!=1){
		            let _this2=this;
		            new Select({
		                name: '选择充电桩公司',
		                id: '公司id',
		                options: this.chargeData,
		                callback: function (item) {
		                    _this2.fee_status=item.name;
		                    _this2.fee_id = item.id;
		                }
		            })
	            }else{
	            	this.$_LIKE_toast('请选择充电站')
	            }
	        },
	        photoArray(){
				this.imageArray = this.$refs.photo.imageArray;
				this.length = this.$refs.photo.length;
			},
			isSub(){
				if (this.charge_id&&this.fee_status&&this.fee1&&this.fee2&&this.fee3&&this.length>0) {
		    		this.pageModal = true;
					this.isCharge = true;
					this.modal_txt = '请确认信息是否准确，提交后将不能修改。'
				}
			},
			cancelOrder(){
	    		this.pageModal = false;
	    		this.isCharge = false;
	    	},
	        createSub(){
	        	this.pageModal = false;
				this.isCharge = false;
	        	this.feeType = $("input[name='feeType']:checked").val();
	        	this.fee1 = $(".fee1").val();
	        	this.fee2 = $(".fee2").val();
	        	this.fee3 = $(".fee3").val();
	        	var param = {
						mobile:userData.state.mobile||sessionStorage.getItem('mobile'),
					    order_id:this.$route.query.order_id,
					    item_id:8,
					    params:{
					    	charge_branch:this.charge_id,
					    	type:this.feeType,
					    	charging_hub:this.fee_id,//充电公司
					    	electricity:this.fee1,//电量
					    	fee:this.fee2,//电费,
					    	service_fee:this.fee3,//服务费,
							photo:this.imageArray.join(','),
							end_time:this.getFormatDate(new Date())
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
				}else{
					this.$_LIKE_toast(isajax.msg)
				}
	        }, 
	        typeRadio(type){
				this.feeType = type;
			},
			choiceCharge(){
				if(this.enter!=1){
		    		window.location.href='../manageOrder/chargeWork/charge.html#/choicechargestation?type=1&order_id='+this.$route.query.order_id
				}
			},
			getFormatDate(date) {
		        var seperator1 = "-";
		        var seperator2 = ":";
		        var year = date.getFullYear();
		        var month = date.getMonth() + 1;
		        var strDate = date.getDate();
		        if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
		        if (strDate >= 0 && strDate <= 9) {
		            strDate = "0" + strDate;
		        }
		        var currentdate = year + seperator1 + month + seperator1 + strDate
		            + " " + date.getHours() + seperator2 + date.getMinutes()
		            + seperator2 + date.getSeconds();
		        return currentdate;
		    },
		    changeType(index){
		    	index==1?this.fee1=$(".fee1").val():index==2?this.fee2=$(".fee2").val():this.fee3=$(".fee3").val();
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
				var imgs = [that.finishData]
			    //图片浏览器
			    dd.previewImage({
			        urls: imgs,//图片地址列表,数组
			        current:imgs[0] //当前显示的图片链接//当前显示的图片链接
			    }).then(result=> {
			        
			    }).catch(err => {
			      this.$_LIKE_toast('查看大图失败')
			      console.log(err)
			    })
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
	.chargeInfo{
		background: #F6F6F6;
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
	.center_txt input{
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
	.fee_icon {
	    display :inline-block;
	    position: relative;
	    width: 20px;
	    height: 15px;
	}
	.fee_icon::after {
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
	    margin-top: -6px;
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
  		padding: .17rem .17rem .17rem .23rem;
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
	.chargeInfo /deep/ .getpicture-content{
		padding: 0;
	}
	.chargeInfo /deep/ .getpicture-content>div>div{
		width: .88rem;
		height: .88rem;
	}
	.chargeInfo /deep/ .uploadIcon{
		left: .28rem;
    	top: .28rem;
	}
	.chargeInfo /deep/ .end-photo {
	    left: .17rem;
	    top: .13rem;
	    font-size: .17rem;
	}
	.chargeInfo /deep/ .check-photo {
	    top: .5rem;
	    left: .08rem;
	}
	.chargeInfo /deep/ .swat-photo{
		top: .5rem;
		left:.54rem;
	}
	.truck_img{
		width: .87rem;
		height: .87rem;
		
	}
	.charge_branch{
		margin-bottom: .1rem;
	}
	.truck_type{
  		padding: .19rem .1rem;
  		margin-top: .1rem;
  		background: #FFFFFF;
  		display: flex;
  		align-items: center;
  		display: -webkit-flex;
  		-webkit-align-items: center;
  		border-bottom: 1px solid #F6F6F6;
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
</style>