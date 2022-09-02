<!--
	作者：xurui_518@163.com
	时间：2018-10-22
	描述：维修信息录入
		
-->
<template>
	<div class="serviceInfo">
		<div class="remain" v-if="enter=='end'">
			维修厂：<span class="fc99">{{finishData.repair_branch_name}}</span>
		</div>
		<search 
			v-else
			@result = 'result' 
			ref='search'
			:search_name="'维修厂：'"
			:plac_txt="'请输入维修厂名'"
			:apiUrl="'/vehicle-repair/search-station'"
			:search_type='1'
			>
			
		</search>
		<div class="remain_num">
			<span class="remain_txt">
				维修前里程表数：
			</span>
			<span v-if="enter=='end'" class="fc99">
				{{finishData.begin_km}}
			</span>
			<input @input="remainNum()"  v-else type="text" name="remainKm" v-model='remain'  placeholder='请输入里程数，单位km' value=""/>
		</div>
		<div class="get_time" v-if="enter=='end'">
			<span>预计取车时间：</span>
			<span class="get_date fc99">{{finishData.expect_car_fetch_time}}</span>
		</div>
		<div v-else class="get_time" @click="getTime()">
			<span>预计取车时间：</span>
			<span class="get_date">{{checkTime}}</span>
		</div>
		<div class="creat_btn" v-show="enter!='end'">
			<p class="submit" @click="subNext(0)">提交</p>
			<p class="waiting" @click="subNext(1)">{{waiting==0||waiting==2?'等配件':'配件已到'}}</p>
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
  	import {goAjax} from '../js/ajaxCommon.js'
  	import search from '../component/search'

	export default{
		name:'serviceInfo',
		components: {
			search,
		},
		data(){
			return{
				searchWord:'',
				isnone:false,//全部清除按钮
				issucc:false,//是否请求回来数据
//				result: [],//所有数据
				limit:false,
				remain:'',
				checkTime:'请输入预计取车时间',
				search_id:'',
				enter:this.$route.query.type,
				finishData:'',
				checkData:'',
				waiting:'0'
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
//			this.checkTime = this.getFormatDate(new Date());
			if(this.enter=='end')this.endEnter();
			if(this.enter=='check')this.checkInfo();
		},
		methods: {
			remainNum(){
				var regPos = /^-?\d+\.?\d{0,1}$/;
				var val = $("input[name='remainKm']").val();
				if(!regPos.test(val)||val==0){
					$("input[name='remainKm']").val('');
					this.remain = '';
					this.$_LIKE_toast('请输入大于等于0的数字')
				}
			},
			checkInfo(){//查看
				myAjax.post(getOspApiUrl('/vehicle-repair/item-result'), {
					 mobile:userData.state.mobile,
				    order_id:this.$route.query.order_id,
					item_id:this.$route.query.item_id,
				}).then(res => {
				  	if (res.status === 0) {
				  		this.checkData = res.data;
				  		this.searchWord = this.checkData.repair_branch_name;
				  		this.search_id = this.checkData.repair_branch;
				  		this.$refs.search.searchWord = this.checkData.repair_branch_name;
				  		this.$refs.search.search_id = this.checkData.repair_branch;
				  		this.$refs.search.id = this.checkData.repair_branch;
				  		this.remain = this.checkData.begin_km;
				  		this.checkTime = this.checkData.expect_car_fetch_time;
				  		this.waiting= this.checkData.waiting;
				  		$("input[name='remainKm']").val(this.remain);
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
			},
			endEnter(){
				myAjax.post(getOspApiUrl('/vehicle-repair/history-result'), {
					 mobile:userData.state.mobile,
				    id:this.$route.query.his_id
				}).then(res => {
				  	if (res.status === 0) {
				  		this.finishData = res.data;
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
			},
			result(){
				this.searchWord = this.$refs.search.searchWord;
				this.search_id = this.$refs.search.search_id;
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
			getTime(){
				var that = this;
				 dd.datetimepicker().then(result=> {
			        that.checkTime = result.value
			    }).catch(err => {
			      this.$_LIKE_toast('获取时间失败')
			      console.log(err)
			    })
			},
			subNext(index){
				var waiting
				if(index=='0'){
					waiting = this.waiting
				}else if(index=='1'&&this.waiting=='0'){
					waiting = 1
				}else if(index=='1'&&this.waiting=='2'){
					waiting = 1
				}else if(index=='1'&&this.waiting=='1'){
					waiting = 2
				}
				var param = {
						mobile:userData.state.mobile,
					    order_id:this.$route.query.order_id,
					    item_id:this.$route.query.item_id,
					    params:{
					    	repair_branch:this.search_id,
					    	begin_km:this.remain,
					    	expect_car_fetch_time:this.checkTime,
							repair_branch_name:this.searchWord,
							waiting:waiting
					    }
				};
				if (this.search_id&&this.remain&&this.checkTime) {
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						window.location.href = 'index.html#/orderDetail?order_id='+this.$route.query.order_id
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}else{
					this.$_LIKE_toast('请填写信息')
				}
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
	.serviceInfo{
		background: #F6F6F6;
	}
	.ser_input{
		background: #FFFFFF;
	}
	.repair_shop,.remain,.get_time,.remain_num{
		height: .53rem;
	    background: #ffffff;
	    line-height: .53rem;
	    padding: 0 .15rem;
	    border-bottom: 1px solid #F6F6F6;
	    position: relative;
	}
	.repair_shop input,.remain input,.remain_num input{border: none; padding: 0;font-size: 14px;-webkit-appearance: none;width: 80%;}
	.remain input{width: 66%;}
	.remain_num input{width: 50%;}
	input::-webkit-input-placeholder{font-size: 14px;color: #999999;}
	input, select, textarea {
	    font-family:none;
	    -webkit-tap-highlight-color: rgba(0,0,0,0);
			-webkit-tap-highlight-color: transparent;
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
		justify-content: space-between;
		-webkit-justify-content: space-between;
		align-items: center;
		-webkit-align-items: center;
		-moz-box-shadow: 0px -3px 5px #e7e7e7;
	    -webkit-box-shadow: 0px -3px 5px #e7e7e7;
	    box-shadow: 0px -3px 5px #e7e7e7;
	    padding: 0 .1rem;
	}
	.creat_btn p{
		height: .45rem;
	    width: 48%;
	    text-align: center;
	    background: #333;
	    line-height: .45rem;
	    color: #fff;
	}
	.crea_submit{
		width: 95%;
		padding: 0.15rem;
		text-align: center;
		border-radius: 2px;
		border: 1px solid #333333;
	}
	.repair_sear{
		display: inline-block;
	}
	.input_clearn{
		display: inline-block;
		width: .14rem;
		height: .14rem;
		position: absolute;
		right: .15rem;
		top: 0;
	}
	.input_clearn img{
		width: 100%;
		height: 100%;
	}
	.history_item{
		padding: 0.1rem 0.15rem;
	}
	.noSearch{
		text-align: center;
		margin-top: .5rem;
	}
	.noSearch img{
		width: 0.5rem;
		height: 0.54rem;
	}
	.history_items{
		z-index: 120;
		background: #FFFFFF;
		position: absolute;
		width: 95%;
		left: 2.5%;
		min-height: 1rem;
		border: 1px solid #F0F0F0;
		max-height: 6rem;
		overflow: hidden;
		
	}
	.get_date{
		font-size: 14px;
		color: #999999;
	}
</style>