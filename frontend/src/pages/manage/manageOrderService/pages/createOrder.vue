<!--
	作者：xurui_518@163.com
	时间：2018-10-18
	描述：1、新建维修工单
		
-->
<template>
	<div class="createOrder">
		<div class="carpro_header">
			<p class="carpro_card">
				<span class="fc33">{{listData.plate_no}} </span>
				(<span class="fc99" v-show="listData.vin">{{listData.vin.substring(0, 11)}}</span>
				<span class="fc33" v-show="listData.vin">{{listData.vin.substring(11, 17)}}</span>)
			</p>
			<p class="carsAdd"> 
				<span>{{listData.status_name}}</span>
				<span>约续航{{listData.remain}} 公里</span>
				<span>
					{{listData.brand_name}}{{listData.model_name}}
				</span>
			</p>
			<div class="carpro_date">
				<p class="detail_addr fc66">
						<span class="icon_addr">
							<img src="../images/mapb.png" alt=""  v-if='listData.biz_type==0'/>
							<img src="../images/map-B.png" alt="" v-else/>
						</span>
						<span>{{listData.remark}}</span>
				</p>
			</div>
		</div>
		<div class="creat_cont">
			<textarea class="creat_input" v-model="creatNote" id="textarea" @input="noteTxt()" placeholder="*请填写备注信息，200字以内（必填）" name="" maxlength ="150"></textarea>
			<p class="creat_txt">提交后，该车的车辆状态将变为“维修”状态</p>
		</div>
		<div class="creat_btn" @click="createSub()">
			<p class="crea_submit" :class="textLen==0?'subfc8':'subf33'">提交</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	
	export default{
		data(){
			return{
				creatNote:'',//备注信息
				textLen:0,
				isShow:false,
				car_id:this.$route.query.car_id,
				source:this.$route.query.source,
				listData:JSON.parse(sessionStorage.getItem('resultData3'))
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
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			createSub(){
				if(this.textLen>0){
					if(this.source=='1'){
						var param = {
							mobile:userData.state.mobile,
						    order_id:this.$route.query.order_id,
						    item_id:'7',
						    params:{
						    	remark:this.creatNote
						    }
						}
						var isajax = this.goAjax(param);
						if(isajax.status=== 0 ){
							window.location.href = '../manageOrder/faultWork/faultend.html'
						}else{
							this.$_LIKE_toast(isajax.msg)
						}
			  		}else{
						myAjax.post(getOspApiUrl('/vehicle-repair/create-order'), {
						    car_id: this.car_id||'6',
						    source: this.source||'1',
						    remark:this.creatNote,
						    mobile:userData.state.mobile,
						}).then(res => {
						  	if (res.status === 0) {
							  		this.$router.push({
							          path:'/orderDetail',
							          query:{
							            order_id:res.data.id
							          }
							        })
					      	}else{
					      		this.$_LIKE_toast(res.msg)
					      	}
						}).catch(err => {
						    console.log(err)
						})
					}
				}
			},
			goAjax(param){
				var result;
				$.ajax({
			        timeout: 3000,
			        type: "post",
			        url: getOspApiUrl('/vehicle-fault/operate'),
			        data: param,
			        async: false,
			        success: function (data) {
			            result = data;
			        },
			        error: function (data) {
			            result = data;
			        }
			       })
			        return result;
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
	.carsAdd{
	margin-top: .15rem;
}
.carsAdd span{
	display: inline-block;
	padding: .08rem .14rem;
    border: 1px solid #cdcdcd;
    border-radius: 2px;
}
.createOrder{
	background: #F6F6F6;
}
.createOrder .carpro_header{
	background-color: #FFFFFF;
	padding: 0.19rem 0.16rem 0.12rem 0.12rem;
}
.detail_addr{
	padding-top: .14rem;
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	-webkit-align-items: center;
}
.icon_addr{
	display: inline-block;
	width: 0.15rem;
	height: 0.2rem;
}
.icon_addr img{width: 100%;height: 100%;}
.creat_cont{
	padding: 0.13rem 0.1rem;
}
textarea{
	border: 1px solid #C1C1C1;  
	font-size: .14rem;
}
.creat_input#textarea{
	height: 0.83rem;
	border: 1px solid #999;
	background: #F6F6F6;
	width: 100%;
	padding: .1rem;
    box-sizing: border-box;
    -webkit-appearance: none;
}
.creat_input#textarea::-webkit-input-placeholder{
	font-size: .14rem;
}
.creat_txt{
	font-size: .15rem;
	color: #333333;
	padding-bottom: 0.16rem;
	padding-top: .1rem;
}
.creat_btn{
	width: 100%;
	height: 0.63rem;
	position: absolute;
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
	color: #FFFFFF;
	padding: 0.15rem;
	text-align: center;
	border-radius: 2px;
}
.subf33{
	background: #333333;
}
.subfc8{
	background: #c8c8c8;
}
.carpro_header{
	background-color: #FFFFFF;
	padding: 0.19rem 0.16rem 0.12rem 0.12rem;
}
.carpro_card{font-size: .14rem;}
.carpro_date{
	display: -webkit-box;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	-webkit-align-items: center;
	justify-content: space-between;
	-webkit-justify-content: space-between;
}
</style>