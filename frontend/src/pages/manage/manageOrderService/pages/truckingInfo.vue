<!--
	作者：xurui_518@163.com
	时间：2018-10-19
	描述：拖车费信息录入
		
-->
<template>
	<div class="truckingInfo">
		<p class="truck_vin">
			车牌（vin）：&nbsp;{{vin}}
		</p>
		<div class="truck_cont">
			<p class="truck_type">
				<span>拖车费类型：</span>
				<label class="fee_radio"><input class="radio1" type="radio" name="feeType" value="1"/>月结</label>
				<label class="fee_radio"><input class="radio2" type="radio" name="feeType" value="2"/>实时</label>
			</p>
			<div class="truck_fee">
				<p>
					<span>
						拖车费用：
					</span>
					<span v-if="enter=='end'">
						{{finishData.trailer_cost}}
					</span>
					<span v-else>
						<input @input="isNum()" @change="isNum()"  type="number" name="fee" v-model="truck_fee" placeholder="请输入拖车费用"/>
					</span>
				</p>
				<span class="fee_txt">元</span>
			</div>
			<div class="truck_photo">
				<img @click="checkPhone(index)" 
					class="truck_img" 
					v-if="enter=='end'" 
					:src="item" 
					v-for="(item,index) in finishData.photo"
					:key = 'index'
					alt="" 
				/>
				<photo 
					v-if="enter!='end'"
					:allPhoto='allPhoto'
					ref='photo'
					@photoArray = 'photoArray'
					>
				</photo>
			</div>
		</div>
		<div class="truck_note">
			<p class="note_txt">
				备注：
			</p>
			<textarea type="textarea" @input="noteTxt()" v-model="textarea1" id="textarea" placeholder="*请填写备注信息，200字内（必填）" name="" maxlength ="200">
			</textarea>
		</div>
		<div class="creat_btn" v-show="enter!='end'">
			<p class="crea_submit fc33" @click="subMit()">保存</p>
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
		name:'truckingInfo',
		 components: {
	      photo,
	    },
		data(){
			return{
				vin:this.$route.query.vin,
				imageArray:[],
				length:'',
				allPhoto:[{'title':'添加拖车费照片','top':false},],
				textLen:'',
				textarea1:'',
				feeType:'',
				truck_fee:'',
				enter:this.$route.query.type,
				finishData:'',
				checkData:''
			}
		},
		beforeCreate () {
		},
	
		destroyed(){
			$('html').css('height','auto');
			$('body').css('height','auto');
			$('body').css('background','#FFFFFF');
		},
		created(){
			if(this.enter=='end'){
				
				this.endEnter().then(res=>{
		  			if(res){
			  			this.enter = 'end'
			  			this.finishData = res;
				  		$('.radio'+this.finishData.cost_type).attr('checked','checked')
				  		$('input').attr("disabled","disabled")
				  		$('#textarea').attr("disabled","disabled")
				  		this.textarea1 = this.finishData.remark;
				  		this.truck_fee = res.trailer_cost
			  		}
				})
			}else if(this.enter=='check'){
				this.checkEnter().then(res=>{
		  			if(res){
			  			this.enter = 'end'
			  			this.finishData = res;
				  		$('.radio'+this.finishData.cost_type).attr('checked','checked')
				  		$('input').attr("disabled","disabled")
				  		$('#textarea').attr("disabled","disabled")
				  		this.textarea1 = this.finishData.remark;
				  		this.truck_fee = res.trailer_cost;
			  		}
				})
			}
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
				return myAjax.post(getOspApiUrl('/vehicle-repair/item-result'), {
					mobile:userData.state.mobile||'13521758602',
				    order_id:this.$route.query.order_id,
				    item_id:'8'
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
				return myAjax.post(getOspApiUrl('/vehicle-repair/history-result'), {
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
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			subMit(){
				this.feeType = $("input[name='feeType']:checked").val()
				var param = {
						mobile:userData.state.mobile||'13521758602',
					    order_id:this.$route.query.order_id,
					    item_id:'8',
					    params:{
					    	trailer_cost:this.truck_fee,//费用
					    	cost_type:this.feeType,//付费类型1月结2实付
					    	photo:this.imageArray.join(','),
					    	remark:this.textarea1,
					    	
					    }
				}
				if (this.length>=1&&this.textarea1&&this.truck_fee&&this.feeType) {
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						window.location.href = 'index.html#/orderDetail?order_id='+this.$route.query.order_id
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}else{
					this.$_LIKE_toast('请填写信息')
				}
			},
			
			checkPhone(index){
				var that = this;
			    //图片浏览器
			    dd.previewImage({
			        urls: that.finishData.photo,//图片地址列表,数组
			        current:that.finishData.photo[index] //当前显示的图片链接//当前显示的图片链接
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
		
	}
	.truckingInfo{
		background: #F6F6F6;
	}
	.truckingInfo /deep/ .getpicture-content{
		padding: 0;
	}
	.truckingInfo /deep/ .getpicture-content>div>div{
		width: .88rem;
		height: .88rem;
	}
	.truckingInfo /deep/ .uploadIcon{
		left: .28rem;
    	top: .28rem;
	}
	.truckingInfo /deep/ .end-photo {
	    left: .17rem;
	    top: .13rem;
	    font-size: .17rem;
	}
	.truckingInfo /deep/ .check-photo {
	    top: .5rem;
	    left: .08rem;
	}
	.truckingInfo /deep/ .swat-photo{
		top: .5rem;
		left:.54rem;
	}
  	.truck_vin{
  		height: .55rem;
  		line-height: .55rem;
  		padding: 0 .1rem;
  		background: #FFFFFF;
  		margin-bottom: .1rem;
  	}
  	.truck_cont{
  		background: #FFFFFF;
  		margin-bottom: .1rem;
  	}
  	.fee_radio{
  		display: inline-flex;
	    justify-content: center;
	    align-items: center;
  		display: -webkit-inline-flex;
	    -webkit-justify-content: center;
	    -webkit-align-items: center;
  	}
  	.truck_type{
  		padding: .19rem .1rem;
  		border-bottom: 2px solid #F6F6F6;
  	}
  	.truck_fee{
  		padding: 0 .1rem;
  		height: .55rem;
  		border-bottom: 1px solid #F6F6F6;
  		display: flex;
  		justify-content: space-between;
  		align-items: center;
  		
  	}
  	.truck_fee input{
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
  	.truck_photo{
  		padding: .17rem .17rem .17rem .23rem;
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
		background: #FFFFFF;
		padding: .17rem .12rem .12rem .12rem;
		margin-bottom: .63rem;
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
	.crea_submit{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		border: 1px solid #333333;
	}
	textarea {-webkit-appearance: none;border-radius: 0;border-color: #999999;}
</style>