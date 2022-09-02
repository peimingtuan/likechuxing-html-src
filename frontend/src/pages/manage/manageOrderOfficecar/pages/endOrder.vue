<!--
	作者：xurui_518@163.com
	时间：2018-10-23
	描述：结束工单
		结束是判断车机里程，10013时弹窗可继续提交，其余为不可提交
-->
<template>
	<div class="endOrder">
		<div class="search_left">
			<search 
				@result = 'results' 
				ref='search'
				:search_name="'网点名称：'"
				:plac_txt="'请输入网点或使用地图选择'"
				:apiUrl="'/vehicle-problem/search'"
				:search_type='2'
				>
				
			</search>
			<span class="search_map" @click="goMap()">地图选择</span>
		</div>
		<div class="list_item">
			<div class="fee_list" v-for="(item,index) in listItem" :key = 'index'>
				<p>
					<span class="left_txt">
						{{item.name}}：
					</span>
					<span class="center_txt" :class="floor_status?'fc33':'fc99'" v-if='index==0' @click="choiceFloor()">{{floor_status?floor_status:item.center}}</span>
					<span class="center_txt" :class="car_num?'fc33':'fc99'" v-if='index!=0'>
						<input :class="car_num?'fc33':'fc99'" @input="ifNext()" type="text" name="car_num" v-model="car_num"  :placeholder="item.center"/>
					</span>
				</p>
				<span :class="index==0?'right_icon':'right_txt' ">{{item.right}}</span>
			</div>
		</div>
		<p class="status_note">
				注：创建工单前，车辆状态为“{{status_note}}”
			</p>
		<div class="fee_list">
			
				<p>
					<span class="left_txt">
						更改车辆状态：
					</span>
					<span class="center_txt" @click="choiceStatus()">{{status_txt?status_txt:'空闲'}}</span>
				</p>
				<span class='right_icon'></span>
			</div>
        <div class="note">
        	<p>备注：</p>
			<textarea class="creat_input" v-model="feeNote" id="textarea" @input="noteTxt()" placeholder="请填写备注信息，200字以内" name="" maxlength ="200"></textarea>
		</div>
        <div class="creat_btn" @click="createSub()">
			<p class="crea_submit" :class="floor_status&&searchWord&&car_num?'subf33':'subfc8'">提交</p>
		</div>
		<deleteAlert ref='dAlert' 
			:pageModal = 'pageModal'
			:modal_txt = 'modal_txt'
			:endTwo = 'endTwo'
			:endThree = 'endThree'
			@subOrder = 'deSubmite()'
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
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  	import {Select} from '../../../../component/Select/index'
  	import search from '../component/search'
  	import {goAjax} from '../js/ajaxCommon.js'
  	import deleteAlert from '../component/delete'
  	
	export default{
		name:'endOrder',
		components: {
	      search,
		  deleteAlert
	    },
		data(){
			return{
				floor_status:this.$route.query.floor_status||'',
				listItem:[
					{'name':'楼层','center':'请选择楼层','right':''},
					{'name':'车位号','center':'请输入车位号','right':''},
					
				],
			    resetAll:false,//是否重置
			    modal:false,
			    checkData:[],
			    checkId:[],
			    feeNote:'',
			    textLen:0,
			    searchWord:this.$route.query.branch_name||'',
				isnone:false,//全部清除按钮
				issucc:false,//是否请求回来数据
				search_id:this.$route.query.branch_id||'',
				car_num:this.$route.query.car_num||'',
				status_id:'',
				pageModal:false,
				 modal_txt:'',
				 endTwo:false,
				 endThree:false,//删除
				 subType:'',
				 formMit:false,//是否强制提交
				 status_txt:'',
				 status_note:this.$route.query.status_note
				
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
			this.$refs.search.searchWord=this.$route.query.branch_name;
			this.$refs.search.id=this.$route.query.branch_id;
			this.$refs.search.search_id=this.$route.query.branch_id;
			this.search_id = this.$refs.search.search_id||this.$route.query.branch_id;
			var xx= this.searchWord.substring(8,this.searchWord.length);
			this.searchWord.length>=8?this.searchWord=this.searchWord.replace(xx,"..."):this.searchWord
			
		},
		methods: {
			results(){
				this.car_num = '';
				this.floor_status = '';
				this.searchWord = this.$refs.search.searchWord;
				this.search_id = this.$refs.search.search_id;
				var xx= this.searchWord.substring(8,this.searchWord.length);
				this.searchWord.length>8?this.searchWord=this.searchWord.replace(xx,"..."):this.searchWord
				this.$refs.search.searchWord = this.searchWord;
			},
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			choiceFloor(){
				if(this.searchWord){
					let _this=this;
		            new Select({
		                name: '楼层',
		                id: '公司id',
		                options: [
		                {'name':'1'},{'name':'2'},{'name':'3'},{'name':'4'},{'name':'5'},{'name':'6'},
		                {'name':'地面'},{'name':'B1'},{'name':'B2'},{'name':'B3'},{'name':'B4'},{'name':'B5'},{'name':'B6'},
		                ],
		                callback: function (item) {
		                    _this.floor_status=item.name;
		                    
		                    
		                }
		            })
		       }else{
		       		this.$_LIKE_toast('请选择网点')
		       }
			},
			choiceStatus(){
	            let _this2=this;
	            new Select({
	                name: '更改车辆状态',
	                id: '公司id',
	                options: [
            					{'name':'空闲','id':'1'},
//          					{'name':'故障','id':'32'},
            					{'name':'车辆整备','id':'20'},
	                ],
	                callback: function (item) {
	                    _this2.status_txt=item.name;
	                    _this2.status_id=item.id;
	                }
	            })
	        },
	        goMap(){
	        	window.location.href = 'index.html#/serviceMap?order_id='+this.$route.query.order_id+'&type=1&status_note='+this.$route.query.status_note;
	        },
	        isSub(type){
	        	this.pageModal = true;
	        	if(type==2){
					this.endTwo = true;
					this.endThree = false;
					this.modal_txt = '车机里程为0，三方GPS里程大于3km，禁止上线，请检查车机或调故障！'
	        	}else{
					this.endThree = true;
					this.endTwo = false;
					this.modal_txt = '车机里程为0，三方GPS里程大于1小于3km，请检查车机！'
	        	}
		    		
			},
			cancelOrder(){
	    		this.pageModal = false;
	    		this.endThree = false;
				this.endTwo = false;
	    	},
	    	deSubmite(){
	    		if(this.$refs.dAlert.subType==1){
	    			this.cancelOrder()
	    		}else{
	    			this.formMit=true;
	    			this.createSub();
	    			
	    		}
	    	},
	        createSub(){
				var param = {
						mobile:userData.state.mobile||sessionStorage.getItem('mobile'),
					    order_id:this.$route.query.order_id,
					    item_id:this.$route.query.item_id||'5',
					    params:{
					    	branch_id:this.search_id,
					    	parking_floor:this.floor_status,
					    	parking_no:this.car_num,
					    	status:this.status_id?this.status_id:'1',//如未选择车辆状态，默认为空闲
					    	remark:this.feeNote,
					    }
				};
				if(this.formMit){//是否强制提交
					param.params.force_commit = '1'
				}
				if (this.search_id&&this.floor_status&&this.car_num) {
					var isajax = goAjax(param);
					if(isajax.status=== 0 ){
						this.pageModal = false;
			    		this.endThree = false;
						this.endTwo = false;
						window.location.href = 'index.html#/finishedOrder?order_id='+this.$route.query.order_id
					}else if(isajax.status == 10011){
						this.$_LIKE_toast('续航未满足上线要求，请检查车机。')
					}else if(isajax.status == 10012){
						this.isSub(2);
					}else if(isajax.status == 10013){
						this.isSub(3);
					}else{
						this.$_LIKE_toast(isajax.msg)
					}
				}
			},
			ifNext(){
				if(this.floor_status){
					this.car_num
				}else{
					this.car_num=''
					this.$_LIKE_toast('请先选择楼层')
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
	.subf33{
		background: #333333;
	}
	.subfc8{
		background: #c8c8c8;
	}
	.endOrder{
		background: #F6F6F6;
	}
	.endOrder /deep/ .search{
		flex: 1;
	}
	.search_left{
		background: #FFFFFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		-webkit-align-items: center;
		height: .55rem;
		/*line-height: .55rem;*/
		margin-bottom: .1rem;
		padding: .12rem;
	}
	.search_left /deep/ .repair_shop{
		padding: 0;
		overflow: hidden;
	}
	.search_left /deep/ .repair_shop input{
		width: 120%;
	}
	.search_left /deep/ .repair_shop input::-webkit-input-placeholder{
		font-size: 12px;
	}
	input{
		color: #999999;
		font-size: 14px;
		border: none;
		padding: 0;
	}
	input::-webkit-input-placeholder{
		color: #999999;
		font-size: 14px;
		padding: 0;
	}
	.left_txt{
		display: inline-block;
		/*width: .75rem;*/
	}
	/*右箭头*/
	.right_icon {
	    display :inline-block;
	    position: relative;
	    width: 20px;
	    height: 15px;
	}
	.right_icon::after {
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
	.bgc8{
		background-color: #C8C8C8!important;
	}
	.note{
		margin-bottom: .63rem;
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
	.search_map{
		height: .35rem;
	    line-height: .35rem;
	    border-left: 1px solid #f6f6f6;
	    padding-left: .1rem;
	    color: #44a8ec;
	}
	.fee_list{
		background: #fff;
	    height: .53rem;
	    line-height: .53rem;
	    padding: 0 .1rem;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    display: -webkit-flex;
	    -webkit-justify-content: space-between;
	    -webkit-align-items: center;
	    border-bottom: 1px solid #F6F6F6;
	}
	.list_item{
		margin-bottom: .1rem;
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
	.endOrder /deep/ .repair_shop{
		border-bottom: none;
	}
	.status_note{
		padding: .1rem;
		background: #FFFFFF;
		border-bottom: 1px solid #F6F6F6;
		color: #666666;
	}
</style>