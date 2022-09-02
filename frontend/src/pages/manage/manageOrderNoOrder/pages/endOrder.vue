<!--
	作者：xurui_518@163.com
	时间：2018-10-23
	描述：结束工单
	url参数      type：1，无需追车信息
-->
<template>
	<div class="endOrder">
		<div class="search_left" v-show="continueUse!=1">
			<search 
				@result = 'results' 
				ref='search'
				:search_name="'网点名称：'"
				:plac_txt="'请输入网点或使用地图选择'"
				:apiUrl="'/branch-car-stock/search'"
				:search_type='2'
				>
				
			</search>
			<span class="search_map" @click="goMap()">地图选择</span>
		</div>
		<div class="list_item"  v-show="continueUse!=1">
			<div class="fee_list" v-for="(item,index) in listItem" :key = 'index'  @click="choiceFloor(index)">
				<p>
					<span class="left_txt">
						{{item.name}}：
					</span>
					<span class="center_txt" :class="floor_status?'fc33':'fc99'" v-if='index==0'>{{floor_status?floor_status:item.center}}</span>
					<span class="center_txt" :class="car_num?'fc33':'fc99'" v-if='index!=0'>
						<input :class="car_num?'fc33':'fc99'" @input="ifNext()" type="text" name="car_num" v-model="car_num"  :placeholder="item.center"/>
					</span>
				</p>
				<span :class="index==0?'right_icon':'right_txt' ">{{item.right}}</span>
			</div>
		</div>
		<div class="fee_list"  v-show="continueUse!=1">
				<p>
					<span class="left_txt">
						车辆状态：
					</span>
					<span class="center_txt">{{resultData.status_text}}</span>
				</p>
			</div>
        <div class="note">
        	<p>备注：</p>
			<textarea class="creat_input" v-model="feeNote" id="textarea" @input="noteTxt()" placeholder="请填写备注信息，200字以内(必填)" name="" maxlength ="200"></textarea>
		</div>
         <div class="creat_btn" @click="createSub()">
			<p class="crea_submit" :class="continueUse==1&&textLen>0||floor_status>=1&&textLen>0||floor_status=='地面'&&textLen>0||floor_status!='地面'&&floor_status!='1'&&floor_status!='2'&&floor_status!='3'&&floor_status!='4'&&floor_status!='5'&&floor_status!='6'
				&&searchWord&&car_num&&textLen>0?'subf33':'subfc8'">提交</p>
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
  	import {Select} from '../../../../component/Select/index'
  	import search from '../component/search'
  	import {goAjax} from '../js/ajaxCommon.js'
  	
	export default{
		name:'endOrder',
		components: {
	      search,
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
				type:this.$route.query.type,//1添加追车信息
				choice_floor:'',
				resultData:JSON.parse(sessionStorage.getItem('resultData')),
				continueUse:sessionStorage.getItem('continueUse')
			}
		},
		beforeCreate () {
		},
		created(){
			if(this.type==1){
					this.$route.meta.title='添加无需追车信息'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
			}else{
					this.$route.meta.title='结束工单'
					document.title = this.$route.meta.title
					var title = this.$route.meta.title
					dd.setWebTitle(title)
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
			this.init()
		},
		methods: {
			init(){
				this.$refs.search.searchWord=this.$route.query.branch_name||'';
				this.$refs.search.id=this.$route.query.branch_id||'';
				this.$refs.search.search_id=this.$route.query.branch_id||'';
				this.search_id = this.$refs.search.search_id||this.$route.query.branch_id;
				var xx= this.searchWord.substring(8,this.searchWord.length);
				this.searchWord&&this.searchWord.length>8?this.searchWord=this.searchWord.replace(xx,"..."):this.searchWord
				var floor = this.$route.query.choice_floor;
				this.choice_floor = this.$refs.search.list_item.choice_floor||floor?floor.split(','):'';
				if(this.choice_floor.length==1&&this.choice_floor[0]=='地面'){
					this.floor_status = '地面';
				}
			},
			results(){
				this.car_num = '';
				this.floor_status = '';
				this.choice_floor = '';
				this.searchWord = this.$refs.search.searchWord;
				this.search_id = this.$refs.search.search_id;
				var xx= this.searchWord.substring(8,this.searchWord.length);
				this.searchWord&&this.searchWord.length>8?this.searchWord=this.searchWord.replace(xx,"..."):this.searchWord
				this.$refs.search.searchWord = this.searchWord;
				this.choice_floor = this.$refs.search.list_item.choice_floor||[];
				if(this.choice_floor.length==1&&this.choice_floor[0]=='地面'){
					this.floor_status = '地面';
				}
			},
			noteTxt(){//判断输入框是否有内容
				this.textLen = $('#textarea').val().length;
			},
			choiceFloor(index){
				if(index==0){
					if(this.searchWord){
						let _this=this,floors=[];
						for(var i=0;i<this.choice_floor.length;i++){
							floors.push({'name':this.choice_floor[i]})
						}
			            new Select({
			                name: '楼层',
			                id: '公司id',
			                options: floors,
			                callback: function (item) {
			                    _this.floor_status=item.name;
			                }
			            })
			       }else{
			       		this.$_LIKE_toast('请选择网点')
			       }
			   }
			},
	        goMap(){
	        	if(this.type==1){
	        		window.location.href = 'index.html#/serviceMap?order_id='+this.$route.query.order_id+'&type=1&noorder=1&car_id='+this.$route.query.car_id;
	        	}else{
	        		window.location.href = 'index.html#/serviceMap?order_id='+this.$route.query.order_id+'&type=1'
	        	}
	        },
	        createSub(){
	        	//如果楼层是地面
				if (this.floor_status=='地面'||this.floor_status>=1||this.floor_status!='地面'&&
				this.floor_status!='1'&&this.floor_status!='2'&&this.floor_status!='3'&&
				this.floor_status!='4'&&this.floor_status!='5'&&this.floor_status!='6'&&
				this.search_id&&this.car_num||this.continueUse==1&&this.textLen>0) {
		        	if(this.type==1){
		        		var param = {
							mobile:userData.state.mobile,
						    order_id:this.$route.query.order_id,
						    car_id:this.$route.query.car_id,
						    params:{
						    	branch_id:this.search_id,
						    	parking_floor:this.floor_status,
						    	parking_no:this.car_num,
						    	remark:this.feeNote,
						    }
						};
						this.goAjax(param);
		        	}else{
						var param = {
								mobile:userData.state.mobile||sessionStorage.getItem('mobile'),
							    order_id:this.$route.query.order_id,
							    item_id:this.$route.query.item_id||'3',
							    params:{
							    	branch_id:this.search_id,
							    	parking_floor:this.floor_status,
							    	parking_no:this.car_num,
							    	remark:this.feeNote,
							    }
						};
						var isajax = goAjax(param);
						if(isajax.status=== 0 ){
							sessionStorage.removeItem('continueUse');
							sessionStorage.removeItem('resultData');
							window.location.href = 'index.html#/finishedOrder?order_id='+this.$route.query.order_id
						}else if(isajax.status == 10013){
							this.$_LIKE_toast(isajax.msg)
							sessionStorage.removeItem('continueUse');
							sessionStorage.removeItem('resultData');
							setTimeout(()=>{
								window.location.href = 'index.html#/finishedOrder?order_id='+this.$route.query.order_id
							},1000)
						}else{
							this.$_LIKE_toast(isajax.msg)
						}
					}
		       }else{
					this.$_LIKE_toast('请填写信息')
				}
			},
			ifNext(){
				if(this.floor_status){
					this.car_num
				}else{
					this.car_num=''
					this.$_LIKE_toast('请先选择楼层')
				}
			},
			goAjax(param){
				var _this = this;
				$.ajax({
			        timeout: 3000,
			        type: "post",
			        url: getOspApiUrl('/vehicle-abnormal/quit'),
			        data: param,
			        async: false,
			        success: function (data) {
			            if(data.status==0){
							_this.$router.push({
				          		path:'/list',
				        	})
							sessionStorage.removeItem('resultData')
						}else{
							_this.$_LIKE_toast(data.msg)
						}
			        },
			        error: function (data) {
			            _this.$_LIKE_toast(data.msg)
			        }
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
	    margin-top: -10px;
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
</style>