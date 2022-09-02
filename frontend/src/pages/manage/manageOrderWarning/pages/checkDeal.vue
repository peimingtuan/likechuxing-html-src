<!--
	作者：xurui_518@163.com
	时间：2018-11-29
	描述：选择处理方式
		
-->
<template>
	<div class="checkDeal">
		<div class="last_note" v-if="topData&&topData.length!=0">
			<div class="last_txt">
				<p class="last_txtp">
				该车 {{topData.hours}} 前创建过预警工单，处理方式为 {{topData.process_mode_text}}
				</p><span class="last_right" @click="goDetail()">
					详情
					<span class='arrdown'></span>
				</span>
				
			</div>
		</div>
		<div class="truck_cont">
			<p class="truck_type">
				<span>选择处理方式：</span>
				<label class="fee_radio"><input class="radio1" @change="typeRadio(1)" checked="checked" type="radio" name="feeType" value="1"/>打火启动</label>
				<label class="fee_radio"><input class="radio2" @change="typeRadio(2)" type="radio" name="feeType" value="2"/>行驶1公里</label>
			</p>
			<div class="truck_photo" v-if="feeType==1&&topShow">
				{{enter=='end'||enter=='check'?'打火时里程表照片：':'请拍摄照片：'}}
				<div  v-if="enter=='end'||enter=='check'" >
					<img @click="checkPhone()" class="truck_img" :src="finishData.photo" alt=""/>
				</div>
				<photo 
					v-if="enter!='end'&&enter!='check'"
					:allPhoto='allPhoto'
					ref='photo'
					@photoArray = 'photoArray'
					>
				</photo>
			</div>
		</div>
		<div class="truck_note">
			注：当该车未动时长大于48小时时，建议处理方式选择行驶1公里。
		</div>
		<div class="creat_btn" v-show="enter!='end'">
			<p :class="feeType==2||length>0?'crea_submit':'not_crea'" @click="subMit()">保存</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import CarDamage from '../../../../component/carDamage/index'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
	import photo from '../component/photo'  
  	import {goAjax} from '../js/ajaxCommon.js'
	
	
	export default{
		name:'checkDeal',
		 components: {
	      photo,
	    },
		data(){
			return{
				vin:this.$route.query.vin,
				imageArray:[],
				length:'',
				allPhoto:[{'title':'打火时里程表照片','top':false},],
				textarea1:'',
				feeType:'1',
				truck_fee:'',
				enter:this.$route.query.type,
				finishData:'',
				topData:'',
				topShow:false
			}
		},
		beforeCreate () {
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
		},
		methods: {
			isNum(){
				var regNum = /^-?\d+\.?\d{0,1}$/;
				var vals = $("input[name='fee']").val();
				if(!regNum.test(vals)||vals==0){
					$("input[name='fee']").val('');
					this.truck_fee = '';
					this.$_LIKE_toast('请输入大于等于0的数字')
				}
			},
			checkEnter(){
				return myAjax.post(getOspApiUrl('/vehicle-zombie/item-result'), {
					mobile:userData.state.mobile||'13521758602',
				    order_id:this.$route.query.order_id,
				    item_id:'3'
				}).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
			},
			endEnter(){
				return myAjax.post(getOspApiUrl('/vehicle-zombie/history-result'), {
					mobile:userData.state.mobile||'13521758602',
				    id:this.$route.query.his_id
				}).then(res=>{
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
			subMit(){
				this.feeType = $("input[name='feeType']:checked").val()
				var param = {
						mobile:userData.state.mobile||'13521758602',
					    order_id:this.$route.query.order_id,
					    item_id:'3',
					    params:{
					    	process_mode:this.feeType,//处理方式：1打火启动  2行驶1公里
					    	photo:this.imageArray.join(','),
					    }
				}
				if (this.length>=1||this.feeType==2) {
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						window.location.href = 'index.html#/warningOrder?order_id='+this.$route.query.order_id
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}else if(this.feeType==1&&this.length<1){
					this.$_LIKE_toast('请上传里程照片')
				}
			},
			
			checkPhone(index){
				var that = this;
				var imgs = [that.finishData.photo]
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
			typeRadio(type){
				this.feeType = type;
			},
			lastInfo(){
				return myAjax.post(getOspApiUrl('/vehicle-zombie/last'), {
					mobile:userData.state.mobile||sessionStorage.getItem('mobile'),
				    order_id:this.$route.query.order_id	
				}).then(res=>{
		          this.dataReady = true
		          if(res.status !== 0){
		            throw res
		          }else{
		            return res.data;
		          }
		        })
			},
			goDetail(){
				if(this.topData.id){
					this.$router.push({
			          	path:'/hisDetail',
			          	query:{
			            	order_id:this.topData.id,
			            	list:this.$route.query.list
			          	}
			        })
				}
			}
		},
		created(){
			
			if(this.enter!='end'&&this.enter!='check'){
				this.topShow=this.feeType==1?true:false;
				this.lastInfo().then(res=>{
			     	this.topData = res;
			   	}).catch(this.handleError);
		   }
		   	if(this.enter=='end'){
				this.endEnter().then(res=>{
		  			if(res){
			  			this.enter = 'end'
			  			this.finishData = res;
				  		$('.radio'+this.finishData.process_mode).attr('checked','checked')
				  		$('input').attr("disabled","disabled")
				  		$('#textarea').attr("disabled","disabled")
				  		this.feeType = this.finishData.process_mode;
				  		this.truck_fee = res.trailer_cost;
				  		this.topShow=this.feeType==1?true:false;
			  		}
				})
			}else if(this.enter=='check'){
				this.checkEnter().then(res=>{
		  			if(res){
			  			this.enter = 'end'
			  			this.finishData = res;
				  		$('.radio'+this.finishData.process_mode).attr('checked','checked')
				  		$('input').attr("disabled","disabled")
				  		$('#textarea').attr("disabled","disabled")
				  		this.feeType = this.finishData.process_mode;
				  		this.truck_fee = res.trailer_cost;
				  		this.topShow=this.feeType==1?true:false;
			  		}
				})
			}
		}
	}
</script>

<style scoped>
	*{
   	 box-sizing: border-box;
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
	.truck_img{
		width: .87rem;
		height: .87rem;
		margin-top: .1rem;
		margin-bottom: .1rem;
	}
	.checkDeal{
		background: #F6F6F6;
	}
	.checkDeal /deep/ .getpicture-content{
		padding: 0;
	}
	.checkDeal /deep/ .getpicture-content>div{
		margin-bottom: 0;
	}
	.checkDeal /deep/ .getpicture-content>div>div{
		width: .88rem;
		height: .88rem;
		margin-left: .1rem;
		
	}
	.checkDeal /deep/ .photo{
		margin-top: .1rem;
	}
	.checkDeal /deep/ .uploadIcon{
		left: .28rem;
    	top: .28rem;
	}
	.checkDeal /deep/ .end-photo {
	    left: .17rem;
	    top: .13rem;
	    font-size: .17rem;
	}
	.checkDeal /deep/ .check-photo {
	    top: .5rem;
	    left: .08rem;
	}
	.checkDeal /deep/ .swat-photo{
		top: .5rem;
		left:.54rem;
	}
  	.truck_cont{
  		margin-bottom: .1rem;
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
  	.truck_type{
  		padding: .19rem .1rem;
  		margin-bottom: .1rem;
  		background: #FFFFFF;
  		display: flex;
  		align-items: center;
  	}
  	.truck_photo{
  		padding: .17rem .17rem 0rem .1rem;
  		background: #FFFFFF;
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
	.truck_note{
		padding: 0rem .12rem .12rem .12rem;
		margin-bottom: .63rem;
		color: #999999;
	}
	#textarea{
		width: 100%;
		height: .83rem;
		padding: .12rem .08rem .08rem .08rem;
		background: #FFFFFF;
		font-size: .14rem;
		color: #333;
	}
	.note_txt{
		color: #666666;
		margin-bottom: .13rem;
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
	.crea_submit,.not_crea{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		color: #FFFFFF;
		
	}
	.crea_submit{
		background: #333333;
	}
	.not_crea{
		background: #D1D1D1;
	}
	.last_note{
		padding: .1rem;
		background: #FFFFFF;
		margin-bottom: .1rem;
	}
	.last_txt{
		padding: .12rem .1rem;
		background: #FDFDFD;
		border: 1px dashed #E6E6E6;
		height: .7rem;
	}
	/*右箭头*/
	.arrdown {
	    display :inline-block;
	    position: relative;
	    width: 15px;
	    height: 15px;
	}
	.arrdown::after {
	    display: inline-block;
	    content: " ";
	    height: 6px;
	    width: 6px;
	    border-width: 2px 2px 0px 0px;
	    border-color: #4A90E2;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 10px;
	    margin-top: -2px;
	}
	.last_txt{
		position: relative;
	}
	.last_right{
		position: absolute;
		right: .1rem;
		color: #4A90E2;
		bottom: .11rem;
	}
</style>