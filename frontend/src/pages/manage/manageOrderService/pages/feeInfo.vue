<!--
	作者：xurui_518@163.com
	时间：2018-10-23
	描述：费用信息录入
		
-->
<template>
	<div class="status_text" v-if="!dataReady&&enter=='check'">
            	加载中，请稍后...
    </div>
	<div class="feeInfo" v-else>
		<div class="fee_all">
			<div class="fee_list" 
				v-for="(item,index) in listItem"
				:key = 'index'
			>
				<p>
					<span class="left_txt">
						{{item.name}}：
					</span>
					<span class="center_txt fc99" v-if='index==0' @click="choiceFee()">{{fee_status?fee_status:item.center}}</span>
					<span class="center_txt fc99" v-if='index!=0'>
						<input @input="totalFee('fee'+index)" type="text" name="fee" :class="'fee'+index"  
							:v-model="'fee'+index" 
							:placeholder="item.center"/>
					</span>
				</p>
				<span :class="index==0?'fee_icon':'right_txt' ">{{item.right}}</span>
			</div>
		</div>
		<div class="fee_list fee_total">
			<p>
			<span class="left_txt">费用总计：</span>
			<span> {{total_fee}}元</span>
			</p>
			<span></span>
		</div>
		<div class="not_out">
			<p>请添加费用明细</p>
			<span class="not_icon" @click="openCheck()" v-if="enter!='end'">
				<img src="../images/icon_add.png" alt="" />
			</span>
		</div>
		<div class="check_cont" v-if="checkData.length>0">
			<p class="check_item" v-for="(item,index) in checkData" :key = 'index'>
				<span class="check_left">{{item}}</span>
				<span class="check_center">
					<input ref='input_txt' v-if="enter=='end'" type="text" name="detail"  :class="'detail'+index" placeholder="请输入费用" value="" disabled="disabled"/>
					<input  v-else type="text" name="detail"  :class="'detail'+index" placeholder="请输入费用" value=""/>
					元
				</span>
				<span class="delete" @click="deleteItem(index)" v-if="enter!='end'">
					<img  src="../images/icon_delete.png"/>
				</span>
			</p>
		</div>
		<div class="fee_toast" v-if="checkData.length>0">*所有明细总金额应等于费用总计</div>
		<OptMore v-show="modal" 
        	ref='optMores' 
        	:title = '"维修部位"'
        	:resetAll='resetAll' 
        	:filterData='filterData'
        	:source = "'1'"
        	@modalClose = 'modalClose' 
        	@partsData = 'partsData'
        	@optData = 'optData'>
        </OptMore>
        <div class="note">
        	<p>备注：</p>
			<textarea class="creat_input" v-model="feeNote" id="textarea" @input="noteTxt()" placeholder="*请填写备注信息，200字以内（必填）" name="" maxlength ="200"></textarea>
		</div>
        <div class="creat_btn" @click="createSub()" v-show="enter!='end'">
			<p class="crea_submit" :class="fee_id&&fee1&&fee2&&fee3&&checkId.length>0&&textLen>0?'subf33':'subfc8'">提交</p>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData'
  	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  	import OptMore from '../component/optMore'
  	import {Select} from '../../../../component/Select/index'
  	import {goAjax} from '../js/ajaxCommon.js'
	export default{
		name:'feeInfo',
		components: {
	      OptMore
	    },
		data(){
			return{
				fee_status:'',
				fee_id:'',
				listItem:[
					{'name':'垫付方式','center':'请选择垫付方式','right':''},
					{'name':'工时费','center':'请输入工时费','right':'元'},
					{'name':'配件费','center':'请输入配件费','right':'元'},
					{'name':'维修金额','center':'请输入维修金额','right':'元'},
				],
				filterData:[],
			    resetAll:false,//是否重置
			    modal:false,
			    checkData:[],
			    checkId:[],
			    feeNote:'',
			    textLen:'',
			    fee1:'0',
			    fee2:'0',
			    fee3:'0',
			    total_fee:'0',
			    detais:'',
			    endData:'',
			    finishData:'',
			    enter:this.$route.query.type,
				dataReady:false,
			}
		},
		beforeCreate () {
		},
		created(){
			if(this.enter=='check'){
				var url = '/vehicle-repair/item-result';
				var param = {
					 mobile:userData.state.mobile,
				    order_id:this.$route.query.order_id,
					item_id:this.$route.query.item_id,
				}
			}else if(this.enter=='end'){
				var url = '/vehicle-repair/history-result';
				var param = {
					 mobile:userData.state.mobile,
				    id:this.$route.query.his_id
				}
			}
			this.checkInfo(url,param).then(res=>{
				if(res.length!=0){
			     	this.finishData = res;
			     	this.fee1 = res.work_hour_fee;
			     	this.fee2 = res.fitting_fee;
			     	this.fee3 = res.repair_fee;
	                this.fee_id = res.pay_type;
	                this.fee_id==1?this.fee_status='员工垫付':this.fee_id==2?this.fee_status='公司垫付':this.fee_id==3?this.fee_status='用户垫付':this.fee_status='保险直赔'
			   		this.total_fee=Number(this.fee1)+Number(this.fee2)+Number(this.fee3);
			   		$('.fee1').val(res.work_hour_fee);
			   		$('.fee2').val(res.fitting_fee);
			   		$('.fee3').val(res.repair_fee);
			   		this.feeNote=res.remark;
			   		for(var i=0;i<res.detail.length;i++){
			   			this.checkData.push(res.detail[i].name);
			   			this.checkId.push(res.detail[i].key);
			   			this.$refs.optMores.checkData.push(res.detail[i].name);
			   			this.$refs.optMores.checkId.push(res.detail[i].key);
			   		}
					this.$nextTick(()=>{
						for(var i=0;i<res.detail.length;i++){
				   			$('.detail'+i).val(res.detail[i].fee)
						}
					})
			   		this.textLen = this.feeNote.length;
		   		}
			}).catch(this.handleError);
			
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
			this.partsData();
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
			totalFee(fee){
				var regPos = /^-?\d+\.?\d{0,1}$/;;
				if(!regPos.test($('.'+fee).val())){
					$('.'+fee).val('');
					if(fee=='fee1'){
						this.fee1 =0
					}else if(fee=='fee2'){
						this.fee2 =0
					}else{
						this.fee3 = 0
					}
					this.$_LIKE_toast('请输入大于等于0的数字')
				}else{
					if(fee=='fee1'){
						this.fee1 = $('.'+fee).val()
					}else if(fee=='fee2'){
						this.fee2 = $('.'+fee).val()
					}else{
						this.fee3 = $('.'+fee).val()
					}
				}
				var feeone = Number(this.fee1),
					feetwo = Number(this.fee2),
					feethree = Number(this.fee3);
				this.total_fee=Number(feeone)+Number(feetwo)+Number(feethree);
			},
			partsData(){
	    		myAjax.post(getOspApiUrl('/vehicle-fault/fault-type'), {
				    type:'6',
				    mobile:userData.state.mobile,
				}).then(res => {
				  	if (res.status === 0) {
				  		this.filterData = res.data;
				  		setTimeout(()=>{
				  			this.$refs.optMores.checkedCon = this.filterData;
				  		},1000)
			      	}else{
			      		this.$_LIKE_toast(res.msg)
			      	}
				}).catch(err => {
				    console.log(err)
				})
	    	},
    		openCheck(){
	    		this.modal = true;
	    		this.$refs.optMores.allName.splice(this.$refs.optMores.allName.length-1,1);
    			this.$refs.optMores.allId.splice(this.$refs.optMores.allId.length-1,1);
	    	},
	    	optData(){//组件内筛选值
	    		this.checkData = this.$refs.optMores.checkData
	    		this.checkId = this.$refs.optMores.checkId;
	    		this.unique(this.checkData,1)
	    		this.unique(this.checkId,2)
	    	},
	    	modalClose(){
	    		this.modal = false;
	    	},
	    	deleteItem(index){
	    		this.$refs.optMores.checkData.splice(index,1)
	    		this.checkData.splice(index,1)
	    		this.$refs.optMores.checkId.splice(index,1)
	    		this.checkId.splice(index,1)
	    	},
	    	unique(allarr,type){//去重
				var res = [];
				var obj = {};
				for(var i=0; i<allarr.length; i++){
				  	if( !obj[allarr[i]] ){
				   		obj[allarr[i]] = 1;
				   		res.push(allarr[i]);
				  	}
				} 
				type===1?this.checkData = res:this.checkId = res;
			},
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			choiceFee(){
	            let _this2=this;
	            new Select({
	                name: '选择充电桩公司',
	                id: '公司id',
	                options: [{'name':'员工垫付','id':'1'},
            					{'name':'公司垫付','id':'2'},
            					{'name':'用户垫付','id':'3'},
            					{'name':'保险直赔','id':'4'},
	                ],
	                callback: function (item) {
	                    _this2.fee_status=item.name;
	                    _this2.fee_id = item.id;
	                    
	                }
	            })
	        },
	        createSub(){
	        	if (this.fee_id&&this.fee1&&this.fee2&&this.fee3&&this.feeNote) {
	        		if(this.fee1<=999999&&this.fee2<=999999&&this.fee3<=999999){
			        	var detailFee =[],deVal=[],detailTotal = '',detail={},fee,id;
			        	detailFee=($("input[name='detail']"))
			        	$(detailFee).each(function(){
				            deVal.push($(this).val());//添加至数组
				        });
			        	for(let i=0,j=0;i<deVal.length,j<this.checkId.length;i++,j++){
			        		fee = deVal[i];
			        		var fees = Number(fee)
			        		detailTotal = Number(detailTotal)
			        		detailTotal+=fees;
			        			id = this.checkId[j];
			        			detail[id]=fee
			        			this.detais = detail;
			        	}

			        	var param = {
								mobile:userData.state.mobile,
							    order_id:this.$route.query.order_id,
							    item_id:this.$route.query.item_id,
							    params:{
							    	pay_type:this.fee_id,//垫付类型1员工2公司3用户
							    	work_hour_fee:this.fee1,//工时费,
							    	fitting_fee:this.fee2,//配件费用,
							    	repair_fee:this.fee3,//维修费用,
							    	remark:this.feeNote,
							    	detail:this.detais
		
							    }
						};
						if(detailTotal!==this.total_fee){
							this.$_LIKE_toast('明细金额与总金额不等')
						}else{
							var isajax = goAjax(param);
							if(isajax.status=== 0 ){
								window.location.href = 'index.html#/orderDetail?order_id='+this.$route.query.order_id
							}else{
								this.$_LIKE_toast(isajax.msg)
							}
						}
					}else{
						this.$_LIKE_toast('录入费用错误，请检查。')
					}
				}
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
	.feeInfo{
		background: #F6F6F6;
	}
	.fee_all{
		margin-bottom: .1rem;
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
	.fee_total{
		border: none;
		margin-bottom: .1rem;
	}
	.center_txt input,.check_item input{
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
		width: .85rem;
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
	    margin-top: -10px;
	}
	.not_out{
		width: 100%;
		background: #FFFFFF;
		display: flex;
	    justify-content: space-between;
	    padding: .2rem .1rem;
	    display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    font-size: 15px;
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
	.check_item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		-webkit-align-items: center;
		padding: .1rem;
		border-radius: 6px;
		border: 1px solid #CDCDCD;
	}
	.check_item:not(last-child){
		margin-bottom: .08rem;
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
	.fee_toast{
		padding: .1rem;
	}
	.note{
		margin-top: .1rem;
		margin-bottom: .63rem;
		padding: .2rem .12rem .63rem .1rem;
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
</style>